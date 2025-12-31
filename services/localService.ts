import { ComfyClient } from "./comfyClient";
import { LmStudioClient } from "./lmStudioClient";
import { CharacterTraits } from "../types";
import { loadSettings } from './settings';
import { DEFAULT_SETTINGS } from '../constants';

// Since services are singletons, we load settings once at initialization.
// The user must reload the page for new settings to take effect.
const currentSettings = loadSettings() ?? DEFAULT_SETTINGS;

const comfy = new ComfyClient(currentSettings.comfyUrl);
const lmStudio = new LmStudioClient(currentSettings.lmStudioUrl);

// --- Helpers ---

const getBodyPartDescriptor = (value: number): string => {
  if (value < 30) return "slender";
  if (value < 50) return "toned";
  if (value < 70) return "average";
  if (value < 90) return "curvy";
  return "voluptuous";
};

// --- Exported Functions ---

export const enhancePrompt = async (currentPrompt: string): Promise<string> => {
    try {
        const systemPrompt = "You are a fashion design assistant. Expand the given outfit description for a highly detailed image generation prompt. Focus on fabrics, textures, fit, and lighting. Keep it under 60 words.";
        return await lmStudio.chatCompletion([
            { role: "system", content: systemPrompt },
            { role: "user", content: currentPrompt }
        ]);
    } catch (e) {
        console.warn("Local LLM enhance prompt failed, returning original.", e);
        return currentPrompt;
    }
};

export const analyzeImage = async (base64Image: string): Promise<string> => {
    try {
        const prompt = "Analyze this character's appearance and outfit. Describe the style, key items, materials, and overall vibe. Suggest 3 specific outfit changes.";
        return await lmStudio.analyzeImage(base64Image, prompt);
    } catch (e) {
        console.warn("Local Vision Analysis failed.", e);
        return "Analysis unavailable. Ensure a Vision model is loaded in LM Studio.";
    }
};

export const generateBaseModel = async (
  base64Image: string, // Ignored for base model gen usually, or used as reference
  traits: CharacterTraits
): Promise<string> => {
    // 1. Load the T2I Workflow API Template
    const response = await fetch('/workflows/z_image_t2i_gguf_api.json');
    if (!response.ok) throw new Error("Failed to load T2I workflow template");
    const workflowTemplate = await response.text(); // Get as text for replacement

    // 2. Construct Prompt
    const chestDesc = getBodyPartDescriptor(traits.chestSize);
    const waistDesc = getBodyPartDescriptor(traits.waistSize);
    const hipDesc = getBodyPartDescriptor(traits.hipSize);

    const positivePrompt = `Full body character design. Female, ${traits.hairColor} hair, ${traits.skinTone} skin, ${traits.bodyType} build. Physique: ${chestDesc} bust, ${waistDesc} waist, ${hipDesc} hips. Wearing ${traits.underwearColor || 'Black'} ${traits.underwearStyle || 'Lingerie'}. Pose: ${traits.pose}. High quality, detailed, masterpiece.`;

    // Note: Negative prompt is handled by "ZeroOut" in the workflow, effectively using the empty conditioning.
    // If explicit negative prompt support is added to the template, we can inject it here.

    const seed = Math.floor(Math.random() * 1000000000);

    // 3. Inject into Workflow (String Replacement)
    // Use JSON.stringify to safely escape characters, then slice off the surrounding quotes
    // because our placeholder "%POSITIVE_PROMPT%" is already inside quotes in the template.
    const safePrompt = JSON.stringify(positivePrompt).slice(1, -1);

    const workflowString = workflowTemplate
        .replace('"%POSITIVE_PROMPT%"', `"${safePrompt}"`)
        .replace('"%SEED%"', String(seed));

    const workflow = JSON.parse(workflowString);

    // 4. Queue and Wait
    const promptResponse = await comfy.queuePrompt(workflow);
    const promptId = promptResponse.prompt_id;
    const imageUrl = await comfy.waitForCompletion(promptId);

    return await comfy.downloadImageAsBase64(imageUrl);
};


export const generateOutfitChange = async (
  base64Image: string,
  outfitDescription: string,
  traits: CharacterTraits,
  scene: string = 'Original'
): Promise<string> => {
    // 1. Upload the source image
    const imageName = await comfy.uploadImage(base64Image);

    // 2. Load the I2I Workflow API Template
    const response = await fetch('/workflows/z_image_i2i_gguf_api.json');
    if (!response.ok) throw new Error("Failed to load I2I workflow template");
    const workflowTemplate = await response.text();

    // 3. Construct Prompt
    const promptText = `Character wearing ${outfitDescription}. ${scene !== 'Original' ? scene : ''}. High quality, detailed.`;
    const seed = Math.floor(Math.random() * 1000000000);

    // 4. Inject into Workflow
    const safePrompt = JSON.stringify(promptText).slice(1, -1);

    const workflowString = workflowTemplate
        .replace('"%POSITIVE_PROMPT%"', `"${safePrompt}"`)
        .replace('"%INPUT_IMAGE%"', `"${imageName}"`)
        .replace('"%SEED%"', String(seed));

    const workflow = JSON.parse(workflowString);

    // 5. Queue and Wait
    const promptResponse = await comfy.queuePrompt(workflow);
    const promptId = promptResponse.prompt_id;
    const imageUrl = await comfy.waitForCompletion(promptId);

    return await comfy.downloadImageAsBase64(imageUrl);
};
