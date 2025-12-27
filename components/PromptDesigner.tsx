import React from 'react';
import { OutfitPreset, GenerationStatus } from '../types';
import { CATEGORIES, SCENES, PRESETS } from '../constants';
import { Spinner } from './Spinner';

interface PromptDesignerProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleEnhancePrompt: () => void;
  isEnhancing: boolean;
  handleTransparency: () => void;
  handleRandomize: () => void;
  scene: string;
  setScene: (scene: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedPresetId: string | null;
  setSelectedPresetId: (id: string | null) => void;
  applyPreset: (preset: OutfitPreset) => void;
  handleVariationClick: (type: 'color' | 'material' | 'style', value: string) => void;
  errorMsg: string | null;
  failedPrompt: string | null;
  handleGenerate: () => void;
  status: GenerationStatus;
  hasImage: boolean;
  generatedImage: string | null;
  handleSaveOutfit: () => void;
}

export const PromptDesigner: React.FC<PromptDesignerProps> = ({
  prompt,
  setPrompt,
  handleEnhancePrompt,
  isEnhancing,
  handleTransparency,
  handleRandomize,
  scene,
  setScene,
  selectedCategory,
  setSelectedCategory,
  selectedPresetId,
  setSelectedPresetId,
  applyPreset,
  handleVariationClick,
  errorMsg,
  failedPrompt,
  handleGenerate,
  status,
  hasImage,
  generatedImage,
  handleSaveOutfit
}) => {
  const filteredPresets = selectedCategory === 'All'
    ? PRESETS
    : PRESETS.filter(p => p.category === selectedCategory);

  const currentPreset = PRESETS.find(p => p.id === selectedPresetId);

  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0">
       {/* Prompt Input Area */}
       <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex-shrink-0">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <span>✨</span> Outfit Designer
             </div>
             <div className="flex gap-2">
                 <button
                    onClick={handleRandomize}
                    className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-300 transition-colors"
                    title="Randomize Parameters"
                 >
                    🎲 Random
                 </button>
                 <button
                    onClick={handleTransparency}
                    className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-300 transition-colors"
                    title="Add Transparency/Sheer Effects"
                 >
                    👻 Sheer
                 </button>
             </div>
          </h2>

          <div className="relative">
             <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the outfit in detail (e.g. A futuristic white bodysuit made of latex...)"
                className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none custom-scrollbar"
             />
             <button
               onClick={handleEnhancePrompt}
               disabled={isEnhancing || !prompt.trim()}
               className="absolute bottom-2 right-2 text-[10px] bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 px-2 py-1 rounded transition-all backdrop-blur-sm flex items-center gap-1"
             >
                {isEnhancing ? <Spinner /> : '✨ Enhance'}
             </button>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {SCENES.map(s => (
                  <button
                    key={s}
                    onClick={() => setScene(s)}
                    className={`whitespace-nowrap px-3 py-1 rounded-full text-[10px] border transition-colors ${scene === s ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                  >
                      {s}
                  </button>
              ))}
          </div>
       </div>

       {/* Presets & Variations */}
       <div className="flex-1 bg-slate-800/50 rounded-xl border border-slate-700 flex flex-col min-h-0 overflow-hidden">
          {/* Category Tabs */}
          <div className="flex border-b border-slate-700 overflow-x-auto custom-scrollbar">
             {CATEGORIES.map(cat => (
                 <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${selectedCategory === cat ? 'border-indigo-500 text-white bg-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                 >
                    {cat}
                 </button>
             ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
             {/* Presets Grid */}
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                 {filteredPresets.map(preset => (
                     <button
                        key={preset.id}
                        onClick={() => applyPreset(preset)}
                        className={`text-left p-2 rounded-lg border transition-all hover:shadow-lg group flex flex-col gap-1 ${selectedPresetId === preset.id ? 'bg-indigo-900/30 border-indigo-500 ring-1 ring-indigo-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}
                     >
                        <div className="flex items-center justify-between">
                            <span className="text-lg">{preset.icon}</span>
                            {selectedPresetId === preset.id && <span className="text-[10px] text-indigo-400 font-bold">✓</span>}
                        </div>
                        <span className="text-[10px] font-medium text-slate-300 group-hover:text-white truncate w-full">{preset.name}</span>
                     </button>
                 ))}
             </div>

             {/* Variations Panel (Only shows when a preset is selected) */}
             {currentPreset && (
                 <div className="mt-4 pt-4 border-t border-slate-700 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                     <h3 className="text-xs font-bold text-slate-400 uppercase">Variations for {currentPreset.name}</h3>

                     {currentPreset.colors && (
                         <div className="space-y-1">
                             <p className="text-[10px] text-slate-500">Colors</p>
                             <div className="flex flex-wrap gap-1">
                                 {currentPreset.colors.map(c => (
                                     <button key={c} onClick={() => handleVariationClick('color', c)} className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:text-indigo-400 text-slate-400 transition-colors">{c}</button>
                                 ))}
                             </div>
                         </div>
                     )}

                     {currentPreset.materials && (
                         <div className="space-y-1">
                             <p className="text-[10px] text-slate-500">Materials</p>
                             <div className="flex flex-wrap gap-1">
                                 {currentPreset.materials.map(m => (
                                     <button key={m} onClick={() => handleVariationClick('material', m)} className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:text-indigo-400 text-slate-400 transition-colors">{m}</button>
                                 ))}
                             </div>
                         </div>
                     )}

                     {currentPreset.styles && (
                         <div className="space-y-1">
                             <p className="text-[10px] text-slate-500">Styles</p>
                             <div className="flex flex-wrap gap-1">
                                 {currentPreset.styles.map(s => (
                                     <button key={s} onClick={() => handleVariationClick('style', s)} className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:text-indigo-400 text-slate-400 transition-colors">{s}</button>
                                 ))}
                             </div>
                         </div>
                     )}
                 </div>
             )}
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-slate-800 border-t border-slate-700 space-y-3">
             {errorMsg && (
                 <div className="p-2 bg-red-500/10 border border-red-500/50 rounded text-[10px] text-red-200">
                     {errorMsg}
                 </div>
             )}

             {failedPrompt && (
                 <div className="p-2 bg-orange-500/10 border border-orange-500/50 rounded text-[10px] text-orange-200 max-h-20 overflow-y-auto custom-scrollbar">
                     <strong>Debug Prompt:</strong> {failedPrompt}
                 </div>
             )}

             <button
                onClick={handleGenerate}
                disabled={!hasImage || !prompt || status === GenerationStatus.LOADING}
                className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex justify-center items-center gap-2"
             >
                {status === GenerationStatus.LOADING ? (
                    <>
                        <Spinner />
                        <span>Designing...</span>
                    </>
                ) : (
                    <>
                        <span>✨ Generate Outfit</span>
                    </>
                )}
             </button>

             {generatedImage && status === GenerationStatus.SUCCESS && (
                 <button
                    onClick={handleSaveOutfit}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors"
                 >
                    💾 Save to Wardrobe
                 </button>
             )}
          </div>
       </div>
    </div>
  );
};
