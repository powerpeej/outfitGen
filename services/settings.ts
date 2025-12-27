export interface AppSettings {
  comfyUrl: string;
  lmStudioUrl: string;
  useRefiner: boolean;
}

export const loadSettings = (): AppSettings | null => {
  const saved = localStorage.getItem('outfitGenieSettings');
  if (saved) {
    return JSON.parse(saved);
  }
  return null;
};

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem('outfitGenieSettings', JSON.stringify(settings));
};
