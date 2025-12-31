import React, { useState, useRef, useEffect, useCallback } from 'react';
import { generateOutfitChange, generateBaseModel, enhancePrompt, analyzeImage } from './services/localService';
import { OutfitPreset, GenerationStatus, SavedOutfit, CharacterTraits } from './types';
import { Button } from './components/Button';
import { Spinner } from './components/Spinner';
import { ZoomableImage } from './components/ZoomableImage';
import { EyeIcon, EyeSlashIcon, SettingsIcon } from './components/Icons';
import { BaseAppearance } from './components/BaseAppearance';
import { PromptDesigner } from './components/PromptDesigner';
import { StatusIndicator } from './components/StatusIndicator';
import { SettingsPanel } from './components/SettingsPanel';
import { AppSettings } from './services/settings';
import { loadSettings } from './services/settings';
import { LOCAL_STORAGE_KEY, DEFAULT_TRAITS, DEFAULT_SETTINGS } from './constants';

const App: React.FC = () => {
  // uploadedImage stores the raw file uploaded by the user (immutable source)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  // originalImage stores the current "Base Model" (mutable result of base generation)
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [failedPrompt, setFailedPrompt] = useState<string | null>(null);
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  
  const [traits, setTraits] = useState<CharacterTraits>(DEFAULT_TRAITS);
  const [isGeneratingBase, setIsGeneratingBase] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // Visibility toggles
  const [showOriginal, setShowOriginal] = useState(true);
  const [showGenerated, setShowGenerated] = useState(true);
  
  // Preset Selection
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Scene Selection
  const [scene, setScene] = useState<string>('Original');

  // Settings Panel State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastGeneratedTraitsRef = useRef<string>(JSON.stringify(DEFAULT_TRAITS));
  
  useEffect(() => {
    // Load settings from localStorage on initial render
    const loadedSettings = loadSettings();
    if (loadedSettings) {
      setSettings(loadedSettings);
    }
  }, []);

  const handleSelectKey = async () => {
    if ((window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
    }
  };

  // Load saved outfits on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setSavedOutfits(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Storage access error or parsing failed", e);
    }
  }, []);

  // Handle File Upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadedImage(result);
        setOriginalImage(result); // Initially, base model IS the uploaded image
        setGeneratedImage(null);
        setStatus(GenerationStatus.IDLE);
        setErrorMsg(null);
        setFailedPrompt(null);
        setAnalysisResult(null);
        
        // Reset traits and history
        setTraits(DEFAULT_TRAITS);
        lastGeneratedTraitsRef.current = JSON.stringify(DEFAULT_TRAITS);
        // Ensure visibility
        setShowOriginal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleError = (err: any) => {
     // If we get an error implying permissions or quota, suggesting key change might help
     if (err.message && (err.message.includes("Requested entity was not found") || err.message.includes("403") || err.message.includes("429"))) {
        console.warn("API Error suggesting check of key/quota");
     }
     setErrorMsg(err.message || "An error occurred.");
     console.error(err);
  };

  // Handle Base Model Generation
  const handleApplyBaseAppearance = useCallback(async (traitsToUse: CharacterTraits = traits) => {
    // Always prefer the clean uploaded image as source to prevent deep-frying quality
    const sourceImage = uploadedImage || originalImage;
    if (!sourceImage) return;
    
    setIsGeneratingBase(true);
    setErrorMsg(null);
    setFailedPrompt(null);
    setShowOriginal(true); // Make sure it's visible when regenerating

    try {
      const newBase = await generateBaseModel(sourceImage, traitsToUse);
      setOriginalImage(newBase);
      // Reset generated outfit since the base body changed
      setGeneratedImage(null);
      setStatus(GenerationStatus.IDLE);
      
      // Update ref to confirm this generation completed
      lastGeneratedTraitsRef.current = JSON.stringify(traitsToUse);
    } catch (err: any) {
      handleError(err);
      // If error, we don't update originalImage, keeping the old one
      // const debugPrompt = constructBasePrompt(traitsToUse, false);
      // setFailedPrompt(debugPrompt);
    } finally {
      setIsGeneratingBase(false);
    }
  }, [uploadedImage, originalImage, traits]);


  // Handle Outfit Generation Logic
  const handleGenerate = async () => {
    if (!originalImage) {
      setErrorMsg("Please upload an image first.");
      return;
    }
    if (!prompt.trim()) {
      setErrorMsg("Please describe the outfit.");
      return;
    }

    setStatus(GenerationStatus.LOADING);
    setErrorMsg(null);
    setFailedPrompt(null);
    setGeneratedImage(null);
    setShowGenerated(true); // Ensure visible

    try {
      const resultBase64 = await generateOutfitChange(originalImage, prompt, traits, scene);
      setGeneratedImage(resultBase64);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      setStatus(GenerationStatus.ERROR);
      handleError(err);
      // const debugPrompt = constructOutfitPrompt(prompt, traits, scene, false);
      // setFailedPrompt(debugPrompt);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsEnhancing(true);
    try {
      const enhanced = await enhancePrompt(prompt);
      setPrompt(enhanced);
    } catch (e) {
      console.error("Failed to enhance prompt", e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAnalyzeImage = async () => {
      const sourceImage = uploadedImage || originalImage;
      if (!sourceImage) return;

      setIsAnalyzing(true);
      setErrorMsg(null);
      setAnalysisResult(null);

      try {
          const result = await analyzeImage(sourceImage);
          setAnalysisResult(result);
      } catch (err: any) {
          handleError(err);
      } finally {
          setIsAnalyzing(false);
      }
  };

  const handleUseAsBase = () => {
    if (generatedImage) {
      setOriginalImage(generatedImage);
      setGeneratedImage(null);
      setPrompt("");
      setStatus(GenerationStatus.IDLE);
      // Reset scene for the next iteration to avoid double-baking backgrounds
      setScene('Original'); 
    }
  };

  const handleSaveOutfit = () => {
    if (!generatedImage) return;

    try {
      const newOutfit: SavedOutfit = {
        id: Date.now().toString(),
        imageUrl: generatedImage,
        prompt: prompt,
        timestamp: Date.now(),
      };
      
      const updatedOutfits = [newOutfit, ...savedOutfits];
      
      // Try to save to local storage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedOutfits));
      setSavedOutfits(updatedOutfits);
    } catch (e) {
      // Handle quota exceeded (Local Storage is usually ~5MB)
      setErrorMsg("Storage full! Delete some old outfits to save new ones.");
    }
  };

  const handleDeleteOutfit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent loading the outfit when clicking delete
    const updatedOutfits = savedOutfits.filter(outfit => outfit.id !== id);
    setSavedOutfits(updatedOutfits);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedOutfits));
  };

  const handleLoadOutfit = (outfit: SavedOutfit) => {
    setGeneratedImage(outfit.imageUrl);
    setPrompt(outfit.prompt);
    setStatus(GenerationStatus.SUCCESS);
    setShowGenerated(true);
    setSelectedPresetId(null); // Clear preset selection when loading saved outfit
  };

  const applyPreset = (preset: OutfitPreset) => {
    setPrompt(preset.prompt);
    setSelectedPresetId(preset.id);
  };
  
  const handleVariationClick = (type: 'color' | 'material' | 'style', value: string) => {
    if (!prompt) return;
    
    // Prevent duplicate values to keep prompts clean
    if (prompt.toLowerCase().includes(value.toLowerCase())) return;
    
    // Create logical additions rather than just comma lists
    let addition = "";
    if (type === 'color') addition = ` in ${value} color`;
    else if (type === 'material') addition = ` made of ${value}`;
    else if (type === 'style') addition = `, ${value} style`;

    setPrompt(prev => {
        const trimmed = prev.trim();
        // Check if we need a separator
        const needsSeparator = trimmed.length > 0 && !trimmed.endsWith(',') && !trimmed.endsWith('.');
        return trimmed + (needsSeparator ? ',' : '') + addition;
    });
  };

  const updateTrait = (key: keyof CharacterTraits, value: any) => {
    setTraits(prev => ({ ...prev, [key]: value }));
  };

  const handleRandomize = () => {
    const styles = ['futuristic', 'vintage', 'medieval', 'streetwear', 'gothic', 'bohemian', 'minimalist', 'steampunk', 'preppy', 'grunge', 'anime', 'techwear', 'victorian'];
    const colors = ['neon blue', 'emerald green', 'matte black', 'pastel pink', 'crimson', 'gold', 'silver', 'iridescent', 'royal purple', 'burnt orange', 'rainbow', 'translucent'];
    const materials = ['leather', 'silk', 'denim', 'latex', 'velvet', 'holographic fabric', 'chainmail', 'lace', 'spandex', 'chiffon', 'carbon fiber'];
    const items = ['bodysuit', 'evening gown', 'plate armor', 'hoodie & shorts combo', 'trench coat', 'kimono', 'jumpsuit', 'school uniform', 'mech suit', 'summer dress', 'bikini'];

    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
    const randomItem = items[Math.floor(Math.random() * items.length)];

    if (prompt.trim()) {
      // Append randomization to existing prompt
      const newPrompt = `${prompt.trim()}, ${randomStyle} style, made of ${randomMaterial}, with ${randomColor} details`;
      setPrompt(newPrompt);
    } else {
      // Full random generation
      const newPrompt = `A ${randomStyle} ${randomColor} ${randomMaterial} ${randomItem}, highly detailed anime style illustration`;
      setPrompt(newPrompt);
    }
  };

  const handleTransparency = () => {
    const modifier = "completely transparent clear vinyl material, translucent sheer fabric, see-through fashion style";
    if (prompt.trim()) {
      setPrompt(`${modifier}, ${prompt.trim()}`);
    } else {
      setPrompt(`a ${modifier} outfit, futuristic plastic fashion`);
    }
  };

  const hasImage = !!(uploadedImage || originalImage);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col overflow-hidden">

      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-md flex-shrink-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">👗</span>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              OutfitGenie
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-xs text-slate-400 hidden sm:inline">Powered by Local AI</span>
             <div className="h-4 w-[1px] bg-slate-700 hidden sm:block"></div>
             <StatusIndicator settings={settings} />
             <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-slate-400 hover:text-white transition-colors"
                title="Settings"
              >
                <SettingsIcon />
              </button>
          </div>
        </div>
      </header>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <main className="flex-1 max-w-[1920px] mx-auto w-full p-4 flex flex-col lg:flex-row gap-4 overflow-hidden">
        
        {/* Left Column: Image Area & Wardrobe */}
        <div className="flex-1 flex flex-col gap-4 h-full min-h-0">
          
          {/* Main Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[300px]">
            
            {/* Original Image Card */}
            <div className="relative group bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-600 hover:border-indigo-500/50 transition-colors flex flex-col items-center justify-center overflow-hidden h-full">
              <div className="absolute top-2 left-2 bg-slate-900/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-white pointer-events-none z-10 uppercase tracking-wide border border-white/10 shadow-sm">
                Original / Base
              </div>
              
              {/* Controls */}
              <div className="absolute top-2 right-2 z-30 flex gap-2">
                <button 
                  onClick={() => setShowOriginal(!showOriginal)}
                  className="bg-black/40 hover:bg-slate-700 text-white p-1.5 rounded-lg backdrop-blur-sm transition-all border border-white/10"
                  title={showOriginal ? "Hide Image" : "Show Image"}
                >
                  {showOriginal ? <EyeIcon /> : <EyeSlashIcon />}
                </button>
              </div>

              {originalImage ? (
                <>
                  {showOriginal ? (
                    <ZoomableImage 
                      src={originalImage} 
                      alt="Original Character" 
                      className={`w-full h-full object-cover ${isGeneratingBase ? 'opacity-50 blur-sm' : 'opacity-100'} transition-all duration-300`}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                      <EyeSlashIcon />
                      <span className="text-sm">Image Hidden</span>
                    </div>
                  )}

                  {isGeneratingBase && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                        <Spinner />
                        <p className="text-white font-medium mt-2 bg-black/50 px-3 py-1 rounded-lg backdrop-blur-sm">Updating Base Model...</p>
                      </div>
                  )}
                  <button 
                    onClick={triggerFileInput}
                    className="absolute bottom-4 right-4 bg-slate-900/80 hover:bg-indigo-600 text-white p-2 rounded-lg backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10 shadow-lg"
                    title="Change Image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </>
              ) : (
                <div className="text-center p-6 cursor-pointer" onClick={triggerFileInput}>
                  <div className="mx-auto h-12 w-12 text-slate-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-slate-300">Upload Character</h3>
                  <p className="text-xs text-slate-500 mt-1">Click to browse</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {/* Generated Image Card */}
            <div className="relative bg-slate-800/50 rounded-xl border border-slate-700 flex flex-col items-center justify-center overflow-hidden h-full group">
              <div className="absolute top-2 left-2 bg-indigo-600/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-white z-10 pointer-events-none uppercase tracking-wide shadow-sm shadow-indigo-500/20">
                New Look
              </div>

               {/* Controls */}
              <div className="absolute top-2 right-2 z-30 flex gap-2">
                 {/* Use as Base Button (New) */}
                 {generatedImage && showGenerated && (
                  <button 
                    onClick={handleUseAsBase}
                    className="bg-black/40 hover:bg-green-600 text-white p-1.5 rounded-lg backdrop-blur-sm transition-all border border-white/10"
                    title="Evolve: Use this as new Base"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                    </svg>
                  </button>
                 )}

                <button 
                  onClick={() => setShowGenerated(!showGenerated)}
                  disabled={!generatedImage && status !== GenerationStatus.LOADING}
                  className="bg-black/40 hover:bg-slate-700 text-white p-1.5 rounded-lg backdrop-blur-sm transition-all border border-white/10 disabled:opacity-50"
                  title={showGenerated ? "Hide Image" : "Show Image"}
                >
                  {showGenerated ? <EyeIcon /> : <EyeSlashIcon />}
                </button>
              </div>
              
              {status === GenerationStatus.LOADING ? (
                <div className="flex flex-col items-center">
                  <Spinner />
                  <p className="text-xs text-indigo-300 mt-2 animate-pulse">Designing outfit...</p>
                </div>
              ) : generatedImage ? (
                showGenerated ? (
                  <>
                    <ZoomableImage 
                      src={generatedImage} 
                      alt="Generated Outfit" 
                      className="w-full h-full object-cover"
                    />
                     {/* Download Overlay (New) */}
                     <a 
                      href={generatedImage} 
                      download={`outfit-${Date.now()}.png`}
                      className="absolute bottom-4 right-4 bg-slate-900/80 hover:bg-indigo-600 text-white p-2 rounded-lg backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10 shadow-lg"
                      title="Download Image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l7.5-7.5M12 12.75l-7.5-7.5M12 12.75V3" />
                      </svg>
                    </a>
                  </>
                ) : (
                   <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                      <EyeSlashIcon />
                      <span className="text-sm">Image Hidden</span>
                    </div>
                )
              ) : (
                <div className="text-center p-6 text-slate-500">
                  <p className="text-sm">The generated outfit will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Wardrobe Strip (Bottom of left col) */}
          {savedOutfits.length > 0 && (
            <div className="h-32 bg-slate-800/50 rounded-xl p-3 border border-slate-700 flex-shrink-0 flex flex-col">
              <h2 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                <span>📂</span> Wardrobe ({savedOutfits.length})
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar flex-1">
                {savedOutfits.map((outfit) => (
                  <div 
                    key={outfit.id} 
                    onClick={() => handleLoadOutfit(outfit)}
                    className="group relative flex-shrink-0 aspect-[3/4] h-full bg-slate-800 rounded-lg overflow-hidden cursor-pointer border border-slate-600 hover:border-indigo-500 transition-all"
                  >
                    <img 
                      src={outfit.imageUrl} 
                      alt="Saved" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                         <p className="text-[10px] text-white line-clamp-2">{outfit.prompt}</p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteOutfit(e, outfit.id)}
                      className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Controls (Scrollable) */}
        <div className="w-full lg:w-[400px] xl:w-[420px] flex flex-col gap-4 h-full overflow-y-auto pr-1 custom-scrollbar flex-shrink-0">
          
          <BaseAppearance 
            traits={traits}
            updateTrait={updateTrait}
            handleApplyBaseAppearance={handleApplyBaseAppearance}
            isGeneratingBase={isGeneratingBase}
            hasImage={hasImage}
            handleAnalyzeImage={handleAnalyzeImage}
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
            setAnalysisResult={setAnalysisResult}
          />

          <PromptDesigner 
            prompt={prompt}
            setPrompt={setPrompt}
            handleEnhancePrompt={handleEnhancePrompt}
            isEnhancing={isEnhancing}
            handleTransparency={handleTransparency}
            handleRandomize={handleRandomize}
            scene={scene}
            setScene={setScene}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedPresetId={selectedPresetId}
            setSelectedPresetId={setSelectedPresetId}
            applyPreset={applyPreset}
            handleVariationClick={handleVariationClick}
            errorMsg={errorMsg}
            failedPrompt={failedPrompt}
            handleGenerate={handleGenerate}
            status={status}
            hasImage={hasImage}
            generatedImage={generatedImage}
            handleSaveOutfit={handleSaveOutfit}
          />

        </div>
      </main>
    </div>
  );
};

export default App;