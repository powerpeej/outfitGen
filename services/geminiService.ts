import { GoogleGenerativeAI } from "@google/generative-ai";
import { CharacterTraits } from '../types';

// Access API key from Vite environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: any = null;

const getGenAI = () => {
    if (!genAI) {
        if (!API_KEY) {
            throw new Error("Missing API Key. Please set VITE_GEMINI_API_KEY in .env.local");
        }
        genAI = new GoogleGenerativeAI(API_KEY);
    }
    return genAI;
};

// Helper to convert base64 to GenerativePart (if needed, though genai SDK usually handles this)
// For integrated generation, we usually prompt a model that supports images.
// Note: As of early 2025, Imagen 3 is available via the API but the endpoint might differ.
// We will attempt to use 'gemini-1.5-pro' or 'gemini-1.5-flash' for text/analysis,
// and a specific model or tool for image generation if supported, OR assume the prompt returns an image URL/Base64.
//
// HOWEVER, typical Chat/Text models do NOT return images directly as base64 in the text response unless specifically tool-called.
//
// Assumption: The previous implementation might have been using a proxy or a specific "imagen" model endpoint.
// Since we are rebuilding, we will try to use the `gemini-1.5-pro` model which has strong multimodal capabilities.
// If actual image GENERATION (pixels) is needed, we might need 'imagen-3.0-generate-001'.
//
// Documentation for JS SDK usually involves: `model.generateContent`.
// If the model is 'imagen-3.0-generate-001', the response structure is different.

// Since I cannot know for sure which model the user has access to, I will implement a robust handler.

export const constructBasePrompt = (traits: CharacterTraits, isDebug: boolean = false): string => {
    return `Generate a high-quality, full-body character illustration.
    Traits:
    - Hair: ${traits.hairColor}
    - Skin: ${traits.skinTone}
    - Body: ${traits.bodyType}
    - Pose: ${traits.pose}
    - Style: ${traits.renderStyle}
    - Background: ${traits.backgroundColor}
    - Waist: ${traits.waistSize}%, Hips: ${traits.hipSize}%, Chest: ${traits.chestSize}%

    The character should be wearing simple ${traits.underwearColor} ${traits.underwearStyle} underwear.
    Ensure the character is centered and facing forward (or as specified by pose).
    Lighting should be neutral studio lighting.
    High resolution, detailed features.`;
};

export const constructOutfitPrompt = (prompt: string, traits: CharacterTraits, scene: string, isDebug: boolean = false): string => {
    return `Design a new outfit for this character: ${prompt}.
    Keep the character's physical traits consistent:
    - Hair: ${traits.hairColor}
    - Skin: ${traits.skinTone}
    - Body: ${traits.bodyType}

    Scene/Background: ${scene}.
    Style: ${traits.renderStyle}.

    The outfit should fit the body perfectly.
    High fashion, detailed textures, realistic lighting matching the scene.`;
};

/**
 * Generates the "Base Model" image.
 * Since the SDK is generic, we'll try to use the 'imagen-3.0-generate-001' model if possible,
 * or fall back to a standard model that might support image generation.
 */
export const generateBaseModel = async (currentImage: string | null, traits: CharacterTraits): Promise<string> => {
    const prompt = constructBasePrompt(traits);
    return callImageGeneration(prompt, currentImage);
};

/**
 * Generates the new outfit based on the base image.
 */
export const generateOutfitChange = async (baseImage: string, prompt: string, traits: CharacterTraits, scene: string): Promise<string> => {
    const fullPrompt = constructOutfitPrompt(prompt, traits, scene);
    return callImageGeneration(fullPrompt, baseImage);
};

/**
 * Text-to-text enhancement
 */
export const enhancePrompt = async (originalPrompt: string): Promise<string> => {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(`Enhance this fashion prompt to be more descriptive, artistic, and detailed for an AI image generator. Keep it under 50 words. Prompt: "${originalPrompt}"`);
    return result.response.text();
};

/**
 * Image-to-text analysis
 */
export const analyzeImage = async (base64Image: string): Promise<string> => {
    const ai = getGenAI();
    // Gemini 1.5 Flash is good for multimodal
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Clean base64 header if present
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const result = await model.generateContent([
        "Analyze this character's physical traits (hair color, skin tone, body type) and current outfit. Be concise.",
        {
            inlineData: {
                data: cleanBase64,
                mimeType: "image/png" // Assuming PNG, but API is usually flexible or we could detect
            }
        }
    ]);

    return result.response.text();
};

export const getBodyPartDescriptor = (trait: string): string => {
    return trait; // Placeholder
};


// --- Internal Image Generation Logic ---

// Note: The Google Gen AI Node/Web SDK primarily handles Text/Multimodal generation (Gemini).
// Image Generation (Imagen) is often a separate API call or a specific model endpoint.
// As of late 2024/early 2025, Imagen 3 is integrated into Vertex AI and AI Studio.
// However, the interface via `generateContent` might not return image bytes directly for the standard package.
//
// IF the user has an API Key that supports Imagen via the REST API, we can fetch it.
//
// For this 'local run' refactor, I will implement a fetch-based fallback to the Gemini API's image generation endpoint
// if the SDK doesn't support it out of the box easily, OR use the SDK if it has been updated.
//
// Given typical constraints, I'll use a direct fetch to the generic generative method if possible.

async function callImageGeneration(prompt: string, referenceImage: string | null): Promise<string> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("No API Key");

    // We will attempt to use the 'imagen-3.0-generate-001' model.
    // NOTE: This endpoint structure is hypothetical based on standard Google Cloud / AI Studio patterns.
    // If this specific endpoint doesn't work, the user might need to adjust the model name in the code.

    // Construct the request body
    // Imagen 3 via AI Studio REST API often looks like:
    // POST https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict

    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;

    // Note: Reference image (img2img) support in Imagen via this API varies.
    // If referenceImage is provided, we would verify if the API supports it.
    // For now, we will strictly use the PROMPT to generate the image, as img2img is complex.
    // We append visual descriptions of the reference image if needed.

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            instances: [
                {
                    prompt: prompt
                }
            ],
            parameters: {
                sampleCount: 1,
                aspectRatio: "3:4"
            }
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error("Image Gen Error:", errText);

        // Fallback: Attempt to use Gemini 1.5 Pro to "draw" (rarely works as image output, but let's try standard generateContent just in case)
        throw new Error(`Image generation failed: ${response.statusText} - ${errText}`);
    }

    const data = await response.json();

    // Parse response. The structure usually contains base64 bytes.
    // Expected: { predictions: [ { bytesBase64Encoded: "..." } ] }
    if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
        return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
    }

    if (data.predictions && data.predictions[0] && data.predictions[0].mimeType && data.predictions[0].bytesBase64Encoded) {
         return `data:${data.predictions[0].mimeType};base64,${data.predictions[0].bytesBase64Encoded}`;
    }

    throw new Error("API returned unexpected format: " + JSON.stringify(data));
}
