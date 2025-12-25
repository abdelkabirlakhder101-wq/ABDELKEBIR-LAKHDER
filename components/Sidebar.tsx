import React from 'react';
import { GeneratorMode } from '../types';

interface SidebarProps {
  currentMode: GeneratorMode;
  setMode: (mode: GeneratorMode) => void;
  showLibrary: boolean;
  setShowLibrary: (show: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, showLibrary, setShowLibrary }) => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-10">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          VideoGenie AI
        </h1>
        <p className="text-xs text-slate-500 mt-1">Professional Video Studio</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Create</div>
        
        <button
          onClick={() => { setMode(GeneratorMode.VIDEO); setShowLibrary(false); }}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
            !showLibrary && currentMode === GeneratorMode.VIDEO 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Video Generator
        </button>

        <button
          onClick={() => { setMode(GeneratorMode.AUDIO); setShowLibrary(false); }}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
             !showLibrary && currentMode === GeneratorMode.AUDIO 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Voiceover Studio
        </button>

        <div className="mt-8 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Manage</div>
        
        <button
          onClick={() => setShowLibrary(true)}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
            showLibrary 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Asset Library
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
            P
          </div>
          <div>
            <p className="text-sm font-medium text-white">Pro Plan</p>
            <p className="text-xs text-slate-500">Connected</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;