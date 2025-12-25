export interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio?: AIStudio;
    webkitAudioContext: typeof AudioContext;
  }
}

export enum GeneratorMode {
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}

export interface GeneratedAsset {
  id: string;
  type: 'video' | 'audio';
  url: string;
  prompt: string;
  timestamp: number;
  metadata?: any; // To store raw API response parts if needed for extension
}

export interface VideoConfigState {
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
  style: string;
}

export interface AudioConfigState {
  voiceName: string;
  language: string;
}

// Helper types for the API responses since we might not have all types exported
export interface VeoResponse {
  uri: string;
  video: any; // The raw video object for extension
}