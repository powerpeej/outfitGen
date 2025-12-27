import React from 'react';
import { CharacterTraits } from '../types';
import { Button } from './Button';
// import { getBodyPartDescriptor } from '../services/geminiService'; // Moved locally or duplicated
import { HAIR_COLORS, SKIN_TONES, BODY_TYPES, BACKGROUND_COLORS, UNDERWEAR_COLORS, RENDER_STYLES, UNDERWEAR_STYLES, POSES } from '../constants';

// Helper duplicated from service or imported if exported from localService
const getBodyPartDescriptor = (value: number): string => {
  if (value < 30) return "slender";
  if (value < 50) return "toned";
  if (value < 70) return "average";
  if (value < 90) return "curvy";
  return "voluptuous";
};

interface BaseAppearanceProps {
  traits: CharacterTraits;
  updateTrait: (key: keyof CharacterTraits, value: any) => void;
  handleApplyBaseAppearance: (traits?: CharacterTraits) => void;
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
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
          <span>👤</span> Base Appearance
        </h2>
        {/* NSFW Switch */}
        <div className="flex items-center gap-2 bg-slate-900/50 px-2 py-1 rounded-lg border border-slate-700/50">
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">NSFW Mode</span>
          <button 
              onClick={() => updateTrait('nsfw', !traits.nsfw)}
              className={`w-9 h-5 rounded-full transition-all duration-300 relative focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-slate-900 focus:ring-indigo-500 ${traits.nsfw ? 'bg-red-500/90 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-700'}`}
              title={traits.nsfw ? "NSFW Enabled: Relaxed filters" : "NSFW Disabled: Strict filtering"}
          >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm ${traits.nsfw ? 'left-5' : 'left-1'}`}></div>
          </button>
        </div>
      </div>
      
      {isGeneratingBase && <div className="text-[10px] text-indigo-400 animate-pulse text-right mb-2">Processing base model update...</div>}

      <div className="grid grid-cols-1 gap-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Hair Color */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">Hair</label>
            <select 
              value={traits.hairColor}
              onChange={(e) => updateTrait('hairColor', e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-md py-1.5 px-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              {HAIR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {/* Skin Tone */}
          <div>
              <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">Skin</label>
              <select 
                value={traits.skinTone}
                onChange={(e) => updateTrait('skinTone', e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-md py-1.5 px-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                {SKIN_TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            {/* Body Type */}
            <div>
              <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">Body</label>
              <select 
                value={traits.bodyType}
                onChange={(e) => updateTrait('bodyType', e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-md py-1.5 px-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                {BODY_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            {/* Background */}
            <div>
            <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">BG Color</label>
            <select 
              value={traits.backgroundColor}
              onChange={(e) => updateTrait('backgroundColor', e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-md py-1.5 px-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              {BACKGROUND_COLORS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            {/* Underwear Color */}
          <div>
              <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">Underwear Color</label>
              <select 
                value={traits.underwearColor}
                onChange={(e) => updateTrait('underwearColor', e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-md py-1.5 px-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                {UNDERWEAR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
          </div>
            {/* Pose */}
          <div>
              <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">Pose</label>
              <select 
                value={traits.pose}
                onChange={(e) => updateTrait('pose', e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-md py-1.5 px-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                {POSES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Render Style */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">Render Style</label>
            <select 
              value={traits.renderStyle}
              onChange={(e) => updateTrait('renderStyle', e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-md py-1.5 px-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              {RENDER_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
          {/* Underwear Style */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">Underwear Style</label>
            <select 
              value={traits.underwearStyle}
              onChange={(e) => updateTrait('underwearStyle', e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-md py-1.5 px-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              {UNDERWEAR_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
        </div>

        {/* Sliders */}
        <div className="space-y-3 pt-2 border-t border-slate-700/50">
          {[
            { label: 'Chest', key: 'chestSize', val: traits.chestSize },
            { label: 'Waist', key: 'waistSize', val: traits.waistSize },
            { label: 'Hips', key: 'hipSize', val: traits.hipSize }
          ].map((item) => (
            <div key={item.key}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-medium text-slate-400 uppercase">{item.label}</label>
                <span className="text-[9px] text-indigo-300 font-medium uppercase bg-indigo-900/30 px-1.5 py-0.5 rounded">
                  {getBodyPartDescriptor(item.val as number)}
                </span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={item.val} 
                onChange={(e) => updateTrait(item.key as keyof CharacterTraits, parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-[9px] text-slate-500 px-0.5 mt-1 font-medium">
                <span>Slender</span>
                <span>Average</span>
                <span>Curvy</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex gap-2">
          <Button 
            variant="pink" 
            onClick={() => handleApplyBaseAppearance(traits)}
            isLoading={isGeneratingBase}
            disabled={!hasImage}
            className="flex-1 py-2 text-sm"
          >
            Regenerate Base
          </Button>
          <Button
              variant="secondary"
              onClick={handleAnalyzeImage}
              isLoading={isAnalyzing}
              disabled={!hasImage}
              className="py-2 text-sm"
              title="Analyze character style"
          >
              {isAnalyzing ? "..." : "✨ Analyze"}
          </Button>
        </div>
        
        {/* Analysis Result */}
        {analysisResult && (
            <div className="mt-2 bg-slate-900/50 p-2 rounded-lg border border-indigo-500/30 text-xs text-indigo-100 animate-fade-in">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-bold uppercase text-[10px] text-indigo-400">AI Analysis</span>
                    <button onClick={() => setAnalysisResult(null)} className="text-slate-500 hover:text-white">&times;</button>
                </div>
                <p className="leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">{analysisResult}</p>
            </div>
        )}
      </div>
    </div>
  );
};
