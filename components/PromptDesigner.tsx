import React from 'react';
import { OutfitPreset, GenerationStatus } from '../types';
import { Button } from './Button';
import { MagicWandIcon } from './Icons';
import { SCENES, CATEGORIES, PRESETS } from '../constants';

interface PromptDesignerProps {
  prompt: string;
  setPrompt: (val: string) => void;
  handleEnhancePrompt: () => void;
  isEnhancing: boolean;
  handleTransparency: () => void;
  handleRandomize: () => void;
  scene: string;
  setScene: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedPresetId: string | null;
  setSelectedPresetId: (val: string | null) => void;
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

  const activePreset = PRESETS.find(p => p.id === selectedPresetId);
  const filteredPresets = selectedCategory === 'All' 
    ? PRESETS 
    : PRESETS.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
          <span>🪄</span> Prompt
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleTransparency}
            className="text-[10px] flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-cyan-300 px-2 py-1 rounded-full transition-colors border border-slate-600"
            title="Make outfit transparent"
          >
            <span>💧</span> Clear
          </button>
          <button
            onClick={handleRandomize}
            className="text-[10px] flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-indigo-300 px-2 py-1 rounded-full transition-colors border border-slate-600"
          >
            <span>🎲</span> Randomize
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the outfit..."
            rows={3}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 pr-10 text-sm focus:ring-1 focus:ring-indigo-500 outline-none resize-none text-white placeholder-slate-500"
          />
          <button 
            onClick={handleEnhancePrompt}
            disabled={isEnhancing || !prompt.trim()}
            className="absolute bottom-2 right-2 p-1.5 text-indigo-400 hover:text-white hover:bg-indigo-600 rounded-md transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-indigo-400"
            title="Magic Wand: Enhance Prompt with AI"
          >
            {isEnhancing ? (
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <MagicWandIcon />
            )}
          </button>
        </div>

          {/* Scene Selection */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">Scene / Background</label>
            <select 
              value={scene}
              onChange={(e) => setScene(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-md py-1.5 px-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              {SCENES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar -mx-1 px-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[10px] px-3 py-1 rounded-full whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Preset List */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {filteredPresets.map(preset => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`flex-shrink-0 border rounded-lg px-3 py-1.5 flex items-center gap-2 transition-all text-xs ${
                selectedPresetId === preset.id 
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200' 
                : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-300 hover:text-white'
              }`}
              title={preset.name}
            >
              <span>{preset.icon}</span>
              <span>{preset.name}</span>
            </button>
          ))}
          {filteredPresets.length === 0 && (
            <div className="text-xs text-slate-500 italic p-2">No presets in this category.</div>
          )}
        </div>

        {/* Preset Variations (Dynamic Section) */}
        {activePreset && (
            <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600 animate-fade-in space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-slate-600/50 pb-2">
                    <span className="font-semibold text-slate-300">Customize {activePreset.name}</span>
                    <button onClick={() => setSelectedPresetId(null)} className="text-slate-500 hover:text-slate-300 px-2">Close</button>
                </div>
                
                {/* Colors */}
                {activePreset.colors && activePreset.colors.length > 0 && (
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-medium mb-1.5">Color Palette</div>
                      <div className="flex flex-wrap gap-1.5">
                          {activePreset.colors.map(color => (
                              <button
                                  key={color}
                                  onClick={() => handleVariationClick('color', color)}
                                  className="text-[10px] px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 border border-slate-600 rounded-md hover:border-indigo-500 transition-all text-slate-300 hover:text-white hover:shadow-lg hover:shadow-indigo-500/20"
                              >
                                  {color}
                              </button>
                          ))}
                      </div>
                    </div>
                )}

                  {/* Materials */}
                  {activePreset.materials && activePreset.materials.length > 0 && (
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-medium mb-1.5">Material</div>
                      <div className="flex flex-wrap gap-1.5">
                          {activePreset.materials.map(mat => (
                              <button
                                  key={mat}
                                  onClick={() => handleVariationClick('material', mat)}
                                  className="text-[10px] px-2.5 py-1 bg-slate-800 hover:bg-pink-600 border border-slate-600 rounded-md hover:border-pink-500 transition-all text-slate-300 hover:text-white hover:shadow-lg hover:shadow-pink-500/20"
                              >
                                  {mat}
                              </button>
                          ))}
                      </div>
                    </div>
                )}

                {/* Styles */}
                {activePreset.styles && activePreset.styles.length > 0 && (
                    <div>
                        <div className="text-[10px] text-slate-500 uppercase font-medium mb-1.5">Style Variant</div>
                        <div className="flex flex-wrap gap-1.5">
                          {activePreset.styles.map(style => (
                              <button
                                  key={style}
                                  onClick={() => handleVariationClick('style', style)}
                                  className="text-[10px] px-2.5 py-1 bg-slate-800 hover:bg-cyan-600 border border-slate-600 rounded-md hover:border-cyan-500 transition-all text-slate-300 hover:text-white hover:shadow-lg hover:shadow-cyan-500/20"
                              >
                                  {style}
                              </button>
                          ))}
                      </div>
                    </div>
                )}
            </div>
        )}

          {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-xs p-3 rounded-lg animate-fade-in break-words">
            <p className="font-bold mb-1">Error:</p>
            {errorMsg}
            {failedPrompt && (
              <div className="mt-2 pt-2 border-t border-red-500/30">
                <p className="font-bold mb-1 text-[10px] uppercase">Full Prompt Used:</p>
                <div className="bg-black/30 p-2 rounded text-[10px] font-mono max-h-24 overflow-y-auto select-all text-slate-300">
                  {failedPrompt}
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(failedPrompt)}
                  className="mt-1 text-[10px] text-indigo-300 hover:text-white underline"
                >
                  Copy Prompt to Clipboard
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button 
            onClick={handleGenerate}
            isLoading={status === GenerationStatus.LOADING}
            disabled={!hasImage || !prompt.trim()}
            className="flex-1"
          >
            Generate Outfit
          </Button>
          
          {generatedImage && (
            <Button 
              variant="secondary"
              onClick={handleSaveOutfit}
              title="Save to Wardrobe"
            >
              ❤️ Save
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
