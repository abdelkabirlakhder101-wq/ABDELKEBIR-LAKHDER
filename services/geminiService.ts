import { GoogleGenAI, Modality } from "@google/genai";
import { decode, decodeAudioData, bufferToWave } from "./audioUtils";

// We create the instance dynamically to ensure we get the latest key
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVideo = async (
  prompt: string,
  aspectRatio: '16:9' | '9:16',
  resolution: '720p' | '1080p',
  previousVideo?: any
): Promise<{ uri: string; video: any }> => {
  const ai = getAI();
  const model = 'veo-3.1-fast-generate-preview'; // Using fast preview for responsiveness
  
  // Construct config
  const config: any = {
    numberOfVideos: 1,
    resolution: resolution,
    aspectRatio: aspectRatio,
  };

  let operation;

  try {
    if (previousVideo) {
        // Extension mode
        // Only 720p is supported for extensions currently per guidelines if extending? 
        // Guidelines say: "Extend a video... The resolution must be '720p'"
        // So we force 720p if extending.
        config.resolution = '720p';
        // Aspect ratio must match previous video
        
        operation = await ai.models.generateVideos({
            model: 'veo-3.1-generate-preview', // Use standard model for extension capabilities often
            prompt: prompt || "Continue the video",
            video: previousVideo,
            config: config
        });
    } else {
        // Generation mode
        operation = await ai.models.generateVideos({
            model: model,
            prompt: prompt,
            config: config
        });
    }

    // Polling loop
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoResult = operation.response?.generatedVideos?.[0];
    if (!videoResult?.video?.uri) {
        throw new Error("No video URI returned");
    }

    // Append API key for access
    const authenticatedUri = `${videoResult.video.uri}&key=${process.env.API_KEY}`;
    
    return {
        uri: authenticatedUri,
        video: videoResult.video // Return the raw object for future extensions
    };
  } catch (error) {
    console.error("Video generation failed:", error);
    throw error;
  }
};

export const generateVoiceover = async (text: string, voiceName: string = 'Kore'): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) throw new Error("No audio data returned");

        // Decode PCM
        const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            audioContext,
            24000,
            1
        );

        // Convert to WAV Blob URL for easy playback in <audio> tag
        const wavBlob = bufferToWave(audioBuffer, audioBuffer.length);
        return URL.createObjectURL(wavBlob);

    } catch (error) {
        console.error("Voiceover generation failed:", error);
        throw error;
    }
};

// Helper to refine prompts using a text model
export const refinePrompt = async (rawIdea: string): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `You are a professional video director. Transform this raw idea into a detailed, cinematic video prompting description suitable for an AI video generator. Keep it under 50 words. Focus on visual details, lighting, and camera movement. Raw Idea: ${rawIdea}`,
        });
        return response.text || rawIdea;
    } catch (e) {
        return rawIdea;
    }
};