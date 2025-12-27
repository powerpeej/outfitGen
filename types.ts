

export interface OutfitPreset {
  id: string;
  name: string;
  prompt: string;
  icon: string;
  category: string;
  colors?: string[];
  materials?: string[];
  styles?: string[];
}

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
}

export interface SavedOutfit {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
}

export interface CharacterTraits {
  hairColor: string;
  skinTone: string;
  bodyType: string;
  backgroundColor: string;
  chestSize: number;
  waistSize: number;
  hipSize: number;
  underwearColor: string;
  underwearStyle?: string;
  pose: string;
  nsfw: boolean;
  renderStyle: 'Anime' | 'Photorealistic';
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}