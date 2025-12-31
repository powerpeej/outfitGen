import React, { useState, useEffect } from 'react';
import { AppSettings, loadSettings, saveSettings } from '../services/settings';
import { Button } from './Button';
import { DEFAULT_SETTINGS } from '../constants';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const [comfyUrl, setComfyUrl] = useState('');
  const [lmStudioUrl, setLmStudioUrl] = useState('');
  const [useRefiner, setUseRefiner] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentSettings = loadSettings();
      setComfyUrl(currentSettings?.comfyUrl ?? DEFAULT_SETTINGS.comfyUrl);
      setLmStudioUrl(currentSettings?.lmStudioUrl ?? DEFAULT_SETTINGS.lmStudioUrl);
      setUseRefiner(currentSettings?.useRefiner ?? DEFAULT_SETTINGS.useRefiner);
    }
  }, [isOpen]);

  const handleSave = () => {
    const newSettings: AppSettings = {
      comfyUrl,
      lmStudioUrl,
      useRefiner,
    };
    saveSettings(newSettings);
    onClose();
    // Force a reload to apply settings globally
    window.location.reload();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md p-6 m-4">
        <h2 className="text-lg font-bold text-white mb-4">Settings</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="comfyUrl" className="block text-sm font-medium text-slate-300 mb-1">
              ComfyUI API URL
            </label>
            <input
              type="text"
              id="comfyUrl"
              value={comfyUrl}
              onChange={(e) => setComfyUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="http://127.0.0.1:8188"
            />
          </div>
          <div>
            <label htmlFor="lmStudioUrl" className="block text-sm font-medium text-slate-300 mb-1">
              LM Studio API URL
            </label>
            <input
              type="text"
              id="lmStudioUrl"
              value={lmStudioUrl}
              onChange={(e) => setLmStudioUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="http://localhost:1234/v1"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={handleCancel} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save & Reload
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-4 text-center">
            The application will reload to apply the new settings.
        </p>
      </div>
    </div>
  );
};