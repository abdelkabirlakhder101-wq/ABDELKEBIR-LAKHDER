import React, { useState } from 'react';
import { GeneratedAsset, AudioConfigState } from '../types';
import Button from './Button';
import { generateVoiceover } from '../services/geminiService';

interface AudioGeneratorProps {
  onAssetCreated: (asset: GeneratedAsset) => void;
}

const AudioGenerator: React.FC<AudioGeneratorProps> = ({ onAssetCreated }) => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState<AudioConfigState>({
    voiceName: 'Kore',
    language: 'en-US'
  });

  const handleGenerate = async () => {
    if (!text) return;
    setIsGenerating(true);
    try {
      const audioUrl = await generateVoiceover(text, config.voiceName);
      
      const newAsset: GeneratedAsset = {
        id: Date.now().toString(),
        type: 'audio',
        url: audioUrl,
        prompt: text,
        timestamp: Date.now()
      };
      
      onAssetCreated(newAsset);
    } catch (error) {
      alert("Failed to generate voiceover. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Voiceover Studio</h2>
        <p className="text-slate-400">Generate professional voiceovers for your videos using Gemini TTS.</p>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Script
          </label>
          <textarea
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none h-48 resize-none"
            placeholder="Enter the text you want the AI to speak..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Voice</label>
            <select
              value={config.voiceName}
              onChange={(e) => setConfig({ ...config, voiceName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Kore">Kore (Balanced)</option>
              <option value="Puck">Puck (Energetic)</option>
              <option value="Charon">Charon (Deep)</option>
              <option value="Fenrir">Fenrir (Authoritative)</option>
              <option value="Zephyr">Zephyr (Soft)</option>
            </select>
          </div>
          
           <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
            <select
              disabled
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-500 cursor-not-allowed outline-none"
            >
              <option>English (US)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-slate-700 pt-6">
          <Button
            onClick={handleGenerate}
            isLoading={isGenerating}
            disabled={!text}
            className="w-full md:w-auto"
          >
            {isGenerating ? 'Synthesizing...' : 'Generate Voiceover'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AudioGenerator;