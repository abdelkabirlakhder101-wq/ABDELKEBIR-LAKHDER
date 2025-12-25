import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import VideoGenerator from './components/VideoGenerator';
import AudioGenerator from './components/AudioGenerator';
import Library from './components/Library';
import { GeneratorMode, GeneratedAsset } from './types';
import Button from './components/Button';

const App: React.FC = () => {
  const [apiKeySet, setApiKeySet] = useState(false);
  const [mode, setMode] = useState<GeneratorMode>(GeneratorMode.VIDEO);
  const [showLibrary, setShowLibrary] = useState(false);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [extensionSource, setExtensionSource] = useState<GeneratedAsset | undefined>(undefined);

  // Check for API Key on mount
  useEffect(() => {
    const checkKey = async () => {
      try {
        if (window.aistudio && window.aistudio.hasSelectedApiKey) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setApiKeySet(hasKey);
        } else {
            // Fallback for dev environment or if injected script is delayed
            console.warn("window.aistudio not found, assuming dev env with env vars might work, but strict flow requires selection.");
        }
      } catch (e) {
        console.error("Error checking API key", e);
      }
    };
    checkKey();
  }, []);

  const handleConnect = async () => {
    try {
      if (window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        // Assume success after interaction
        setApiKeySet(true);
      }
    } catch (e) {
      console.error("Failed to open key selector", e);
      alert("Could not open Google Cloud project selector. Please check your connection.");
    }
  };

  const handleAssetCreated = (asset: GeneratedAsset) => {
    setAssets(prev => [asset, ...prev]);
    // If we were extending, switch back to library to show result or stay in gen mode?
    // Let's go to library to see the result.
    setExtensionSource(undefined);
    setShowLibrary(true);
  };

  const handleExtendRequest = (asset: GeneratedAsset) => {
    setExtensionSource(asset);
    setMode(GeneratorMode.VIDEO);
    setShowLibrary(false);
  };

  if (!apiKeySet) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div>
             <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
              VideoGenie AI
            </h1>
            <p className="text-slate-400 text-lg">
              Professional video generation studio powered by Google Veo and Gemini.
            </p>
          </div>

          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
            <div className="mb-6">
               <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                 </svg>
               </div>
               <h3 className="text-xl font-semibold text-white mb-2">Connect Google Cloud</h3>
               <p className="text-sm text-slate-400">
                 To generate videos with Veo, you must select a paid Google Cloud project with the Gemini API enabled.
               </p>
            </div>
            
            <Button onClick={handleConnect} className="w-full py-3 text-lg">
              Connect & Start Creating
            </Button>
            
            <p className="mt-4 text-xs text-slate-500">
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-slate-300">
                Learn more about billing and pricing
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Sidebar 
        currentMode={mode} 
        setMode={setMode} 
        showLibrary={showLibrary} 
        setShowLibrary={setShowLibrary} 
      />
      
      <main className="ml-64 p-8 min-h-screen">
        <header className="flex justify-between items-center mb-8">
            <div>
              {/* Breadcrumbs or Header Info could go here */}
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <p className="text-sm text-white font-medium">Session Active</p>
                    <p className="text-xs text-emerald-400">API Key Connected</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-700 border border-slate-600"></div>
            </div>
        </header>

        {showLibrary ? (
          <Library assets={assets} onExtend={handleExtendRequest} />
        ) : mode === GeneratorMode.VIDEO ? (
          <VideoGenerator 
             onAssetCreated={handleAssetCreated} 
             existingAsset={extensionSource}
             onCancelExtension={() => setExtensionSource(undefined)}
          />
        ) : (
          <AudioGenerator onAssetCreated={handleAssetCreated} />
        )}
      </main>
    </div>
  );
};

export default App;