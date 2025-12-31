import React, { useEffect, useState } from 'react';
import { AppSettings } from '../services/settings';

interface StatusIndicatorProps {
  settings: AppSettings;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ settings }) => {
  const [comfyStatus, setComfyStatus] = useState<'pending' | 'ok' | 'error'>('pending');
  const [lmStatus, setLmStatus] = useState<'pending' | 'ok' | 'error'>('pending');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkComfy = async () => {
      try {
        const res = await fetch(`${settings.comfyUrl}/system_stats`, { method: 'GET' });
        if (res.ok) setComfyStatus('ok');
        else setComfyStatus('error');
      } catch (e) {
        setComfyStatus('error');
      }
    };

    const checkLm = async () => {
      try {
        const res = await fetch(`${settings.lmStudioUrl}/models`, { method: 'GET' });
        if (res.ok) setLmStatus('ok');
        else setLmStatus('error');
      } catch (e) {
        setLmStatus('error');
      }
    };

    checkComfy();
    checkLm();

    // Poll every 30 seconds
    const interval = setInterval(() => {
        checkComfy();
        checkLm();
    }, 30000);

    return () => clearInterval(interval);
  }, [settings.comfyUrl, settings.lmStudioUrl]);

  const allOk = comfyStatus === 'ok' && lmStatus === 'ok';
  const hasError = comfyStatus === 'error' || lmStatus === 'error';
  const isPending = comfyStatus === 'pending' || lmStatus === 'pending';

  let statusColor = 'bg-slate-500';
  if (allOk) statusColor = 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
  if (hasError) statusColor = 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse';
  if (isPending) statusColor = 'bg-yellow-500';

  return (
    <div
        className="relative flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${statusColor} cursor-help`}></div>

      {/* Tooltip Dropdown */}
      <div className={`absolute top-full right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-3 z-50 transform transition-all duration-200 origin-top-right ${isHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
         <h3 className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide border-b border-slate-700 pb-1">System Status</h3>

         <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">ComfyUI</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${comfyStatus === 'ok' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                    {comfyStatus === 'ok' ? 'Connected' : 'Disconnected'}
                </span>
            </div>
            {comfyStatus === 'error' && <div className="text-[9px] text-red-400 break-all">{settings.comfyUrl}</div>}

            <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">LM Studio</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${lmStatus === 'ok' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                    {lmStatus === 'ok' ? 'Connected' : 'Disconnected'}
                </span>
            </div>
             {lmStatus === 'error' && <div className="text-[9px] text-red-400 break-all">{settings.lmStudioUrl}</div>}
         </div>
      </div>
    </div>
  );
};
