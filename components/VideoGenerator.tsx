import React, { useState } from 'react';
import { GeneratedAsset, VideoConfigState } from '../types';
import Button from './Button';
import { generateVideo, refinePrompt } from '../services/geminiService';

interface VideoGeneratorProps {
  onAssetCreated: (asset: GeneratedAsset) => void;
  existingAsset?: GeneratedAsset; // If passed, we are in extension mode
  onCancelExtension?: () => void;
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ onAssetCreated, existingAsset, onCancelExtension }) => {
  const [prompt, setPrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState<VideoConfigState>({
    aspectRatio: '16:9',
    resolution: '720p',
    style: 'Cinematic',
  });

  const handleRefine = async () => {
    if (!prompt) return;
    setIsRefining(true);
    const refined = await refinePrompt(prompt);
    setPrompt(refined);
    setIsRefining(false);
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const result = await generateVideo(
        prompt, 
        config.aspectRatio, 
        config.resolution,
        existingAsset?.metadata // Pass previous video object if extending
      );
      
      const newAsset: GeneratedAsset = {
        id: Date.now().toString(),
        type: 'video',
        url: result.uri,
        prompt: prompt,
        timestamp: Date.now(),
        metadata: result.video
      };
      
      onAssetCreated(newAsset);
      if (!existingAsset) setPrompt(''); // Clear prompt only on new generation
    } catch (error) {
      alert("Failed to generate video. Please try again or check your API key quota.");
    } finally {
      setIsGenerating(false);
    }
  };

  const isExtension = !!existingAsset;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          {isExtension ? 'Extend Video Scene' : 'Generate New Video'}
        </h2>
        <p className="text-slate-400">
          {isExtension 
            ? 'Add 7 seconds of continuity to your selected clip.' 
            : 'Turn your text descriptions into professional 1080p video scenes.'}
        </p>
      </div>

      {isExtension && (
        <div className="bg-slate-800/50 border border-indigo-500/30 p-4 rounded-xl mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="w-32 h-20 bg-black rounded overflow-hidden relative">
                     <video src={existingAsset.url} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h3 className="text-white font-medium">Extending: {existingAsset.prompt.slice(0, 30)}...</h3>
                    <p className="text-xs text-indigo-400">Resolution locked to 720p for extensions</p>
                </div>
            </div>
            <button onClick={onCancelExtension} className="text-slate-400 hover:text-white text-sm underline">
                Cancel Extension
            </button>
        </div>
      )}

      <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Scene Description
          </label>
          <div className="relative">
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none h-32 resize-none"
              placeholder="Describe your scene in detail: A futuristic cyberpunk city street at night, neon lights reflecting in puddles, cinematic lighting..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={handleRefine}
              disabled={isRefining || !prompt}
              className="absolute bottom-4 right-4 text-xs bg-slate-800 hover:bg-slate-700 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/30 transition-colors flex items-center"
            >
               {isRefining ? 'Refining...' : '✨ Enhance Prompt'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
            <select
              disabled={isExtension}
              value={config.aspectRatio}
              onChange={(e) => setConfig({ ...config, aspectRatio: e.target.value as any })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
            >
              <option value="16:9">16:9 (Landscape)</option>
              <option value="9:16">9:16 (Portrait)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Resolution</label>
            <select
              disabled={isExtension} // Extensions are locked to 720p usually in this demo context or inherit
              value={isExtension ? '720p' : config.resolution}
              onChange={(e) => setConfig({ ...config, resolution: e.target.value as any })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
            >
              <option value="720p">720p HD</option>
              <option value="1080p">1080p Full HD</option>
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-300 mb-2">Style Preset</label>
            <select
              value={config.style}
              onChange={(e) => setConfig({ ...config, style: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Cinematic">Cinematic</option>
              <option value="Photorealistic">Photorealistic</option>
              <option value="Anime">Anime</option>
              <option value="3D Render">3D Render</option>
              <option value="Vintage">Vintage Film</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-slate-700 pt-6">
          <div className="text-slate-500 text-sm mr-auto">
            Estimated time: {isExtension ? '30-60s' : '1-2 mins'}
          </div>
          <Button
            onClick={handleGenerate}
            isLoading={isGenerating}
            disabled={!prompt}
            className="w-full md:w-auto min-w-[200px]"
          >
            {isGenerating ? 'Generating...' : isExtension ? 'Extend Video (+7s)' : 'Generate Video'}
          </Button>
        </div>
      </div>
      
      {isGenerating && (
         <div className="mt-8 text-center p-8 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed animate-pulse">
            <p className="text-indigo-400 font-medium">Video generation in progress...</p>
            <p className="text-slate-500 text-sm mt-2">This may take a moment. The AI is rendering frame by frame.</p>
         </div>
      )}
    </div>
  );
};

export default VideoGenerator;