import React from 'react';
import { CharacterTraits } from '../types';
import { HAIR_COLORS, SKIN_TONES, BODY_TYPES, UNDERWEAR_COLORS, UNDERWEAR_STYLES, POSES, RENDER_STYLES } from '../constants';
import { Spinner } from './Spinner';

interface BaseAppearanceProps {
  traits: CharacterTraits;
  updateTrait: (key: keyof CharacterTraits, value: any) => void;
  handleApplyBaseAppearance: () => void;
  isGeneratingBase: boolean;
  hasImage: boolean;
  handleAnalyzeImage: () => void;
  isAnalyzing: boolean;
  analysisResult: string | null;
  setAnalysisResult: (res: string | null) => void;
}

export const BaseAppearance: React.FC<BaseAppearanceProps> = ({
  traits,
  updateTrait,
  handleApplyBaseAppearance,
  isGeneratingBase,
  hasImage,
  handleAnalyzeImage,
  isAnalyzing,
  analysisResult,
  setAnalysisResult
}) => {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex flex-col gap-4">
      <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
        <span>👤</span> Base Character
      </h2>

      {/* Analysis Section */}
      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
          <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-400">AI Analysis</span>
               <button
                  onClick={handleAnalyzeImage}
                  disabled={!hasImage || isAnalyzing}
                  className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded transition-colors disabled:opacity-50"
              >
                  {isAnalyzing ? 'Scanning...' : 'Analyze Image'}
              </button>
          </div>

          {isAnalyzing && (
              <div className="flex justify-center py-2">
                  <Spinner />
              </div>
          )}

          {analysisResult && (
              <div className="text-[10px] text-slate-400 bg-black/20 p-2 rounded border border-slate-700 max-h-20 overflow-y-auto custom-scrollbar">
                  {analysisResult}
                  <button
                      onClick={() => setAnalysisResult(null)}
                      className="block w-full text-center text-indigo-400 mt-1 hover:text-indigo-300"
                  >
                      Clear
                  </button>
              </div>
          )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Hair Color */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Hair Color</label>
          <select
            value={traits.hairColor}
            onChange={(e) => updateTrait('hairColor', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            {HAIR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Skin Tone */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Skin Tone</label>
           <select
            value={traits.skinTone}
            onChange={(e) => updateTrait('skinTone', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            {SKIN_TONES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Body Type */}
         <div className="space-y-1">
          <label className="text-xs text-slate-400">Body Type</label>
           <select
            value={traits.bodyType}
            onChange={(e) => updateTrait('bodyType', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            {BODY_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Render Style */}
         <div className="space-y-1">
          <label className="text-xs text-slate-400">Render Style</label>
           <select
            value={traits.renderStyle}
            onChange={(e) => updateTrait('renderStyle', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            {RENDER_STYLES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

       {/* Sliders */}
      <div className="space-y-3 pt-2 border-t border-slate-700/50">
           {/* Chest */}
           <div className="space-y-1">
               <div className="flex justify-between">
                 <label className="text-xs text-slate-400">Chest Size</label>
                 <span className="text-[10px] text-slate-500">{traits.chestSize}%</span>
               </div>
               <input
                  type="range" min="0" max="100"
                  value={traits.chestSize}
                  onChange={(e) => updateTrait('chestSize', parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
           </div>

             {/* Waist */}
           <div className="space-y-1">
               <div className="flex justify-between">
                 <label className="text-xs text-slate-400">Waist Size</label>
                 <span className="text-[10px] text-slate-500">{traits.waistSize}%</span>
               </div>
               <input
                  type="range" min="0" max="100"
                  value={traits.waistSize}
                  onChange={(e) => updateTrait('waistSize', parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
           </div>

             {/* Hips */}
           <div className="space-y-1">
               <div className="flex justify-between">
                 <label className="text-xs text-slate-400">Hip Size</label>
                 <span className="text-[10px] text-slate-500">{traits.hipSize}%</span>
               </div>
               <input
                  type="range" min="0" max="100"
                  value={traits.hipSize}
                  onChange={(e) => updateTrait('hipSize', parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
           </div>
      </div>

      {/* Underwear Config (Collapsed if not needed, but showing for comprehensive control) */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/50">
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Underwear Color</label>
            <select
                value={traits.underwearColor}
                onChange={(e) => updateTrait('underwearColor', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none"
            >
                {UNDERWEAR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Underwear Style</label>
            <select
                value={traits.underwearStyle}
                onChange={(e) => updateTrait('underwearStyle', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none"
            >
                {UNDERWEAR_STYLES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
      </div>

       <div className="space-y-1 pt-2">
            <label className="text-xs text-slate-400">Pose</label>
            <select
                value={traits.pose}
                onChange={(e) => updateTrait('pose', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none"
            >
                {POSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
       </div>

      <button
        onClick={handleApplyBaseAppearance}
        disabled={!hasImage || isGeneratingBase}
        className="mt-2 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {isGeneratingBase ? <Spinner /> : '↻ Update Base Body'}
      </button>
    </div>
  );
};
