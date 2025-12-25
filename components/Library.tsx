import React from 'react';
import { GeneratedAsset } from '../types';

interface LibraryProps {
  assets: GeneratedAsset[];
  onExtend: (asset: GeneratedAsset) => void;
}

const Library: React.FC<LibraryProps> = ({ assets, onExtend }) => {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-lg font-medium">No assets created yet</p>
        <p className="text-sm mt-1">Generate a video or voiceover to get started.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8">Asset Library</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="aspect-video bg-black relative group">
              {asset.type === 'video' ? (
                <video 
                  src={asset.url} 
                  controls 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900">
                  <div className="p-4 rounded-full bg-indigo-600/20 text-indigo-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </div>
                  <audio src={asset.url} controls className="absolute bottom-4 left-4 right-4" />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between">
                 <div className="flex-1 min-w-0">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${asset.type === 'video' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {asset.type.toUpperCase()}
                    </span>
                    <p className="text-sm text-slate-300 line-clamp-2" title={asset.prompt}>
                      {asset.prompt}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(asset.timestamp).toLocaleDateString()} • {new Date(asset.timestamp).toLocaleTimeString()}
                    </p>
                 </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                 <a 
                   href={asset.url} 
                   download={`videogenie-${asset.id}.${asset.type === 'video' ? 'mp4' : 'wav'}`}
                   className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs py-2 px-3 rounded-lg text-center transition-colors"
                 >
                   Download
                 </a>
                 {asset.type === 'video' && (
                   <button 
                     onClick={() => onExtend(asset)}
                     className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                   >
                     <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                     </svg>
                     Extend
                   </button>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;