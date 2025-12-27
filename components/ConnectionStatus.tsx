import React, { useEffect, useState } from 'react';
import { AppSettings } from '../services/settings';

interface ConnectionStatusProps {
  settings: AppSettings;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ settings }) => {
  const [comfyStatus, setComfyStatus] = useState<'pending' | 'ok' | 'error'>('pending');
  const [lmStatus, setLmStatus] = useState<'pending' | 'ok' | 'error'>('pending');

  useEffect(() => {
    const checkComfy = async () => {
      try {
        // ComfyUI /system/stats or similar usually works, or just root
        const res = await fetch(`${settings.comfyUrl}/system_stats`, { method: 'GET' });
        if (res.ok) setComfyStatus('ok');
        else setComfyStatus('error');
      } catch (e) {
        setComfyStatus('error');
      }
    };

    const checkLm = async () => {
      try {
        // LM Studio /v1/models is a standard endpoint
        const res = await fetch(`${settings.lmStudioUrl}/models`, { method: 'GET' });
        if (res.ok) setLmStatus('ok');
        else setLmStatus('error');
      } catch (e) {
        setLmStatus('error');
      }
    };

    checkComfy();
    checkLm();
  }, [settings.comfyUrl, settings.lmStudioUrl]);

  if (comfyStatus === 'ok' && lmStatus === 'ok') return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      {comfyStatus === 'error' && (
        <div className="bg-red-900/80 text-red-100 px-4 py-2 rounded-lg border border-red-700 shadow-lg backdrop-blur-md text-sm">
          ⚠️ ComfyUI unreachable at {settings.comfyUrl}
        </div>
      )}
      {lmStatus === 'error' && (
        <div className="bg-yellow-900/80 text-yellow-100 px-4 py-2 rounded-lg border border-yellow-700 shadow-lg backdrop-blur-md text-sm">
          ⚠️ LM Studio unreachable at {settings.lmStudioUrl}
        </div>
      )}
    </div>
  );
};
