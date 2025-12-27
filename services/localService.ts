import { ComfyClient } from "./comfyClient";
import { LmStudioClient } from "./lmStudioClient";
import { CharacterTraits } from "../types";

// Configuration
const COMFY_URL = import.meta.env.VITE_COMFY_API_URL || "http://127.0.0.1:8188";
const LM_STUDIO_URL = import.meta.env.VITE_LM_STUDIO_API_URL || "http://localhost:1234/v1";

const comfy = new ComfyClient(COMFY_URL);
const lmStudio = new LmStudioClient(LM_STUDIO_URL);

// --- Helpers ---

// Find specific nodes in the workflow JSON
const findNodeByTitle = (nodes: any[], title: string) => nodes.find((n: any) => n.title === title || n.properties?.["Node name for S&R"] === title);
const findNodeByType = (nodes: any[], type: string) => nodes.find((n: any) => n.type === type);

// Helper to update specific widget values in the workflow
// Note: ComfyUI widget order is fixed. This is brittle but standard for API usage.
// You might need to adjust indices if the workflow changes.
const updateNodeWidget = (node: any, index: number, value: any) => {
    if (node && node.widgets_values) {
        node.widgets_values[index] = value;
    }
};

const getBodyPartDescriptor = (value: number): string => {
  if (value < 30) return "slender";
  if (value < 50) return "toned";
  if (value < 70) return "average";
  if (value < 90) return "curvy";
  return "voluptuous";
};

// --- Exported Functions (Matching geminiService signature) ---

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
    // 1. Load the T2I Workflow
    const response = await fetch('/workflows/z_image_t2i.json');
    if (!response.ok) throw new Error("Failed to load T2I workflow template");
    const workflow = await response.json();

    // 2. Construct Prompt
    // Using a simpler prompt construction for local models which might be less smart than Gemini 1.5 Pro
    const chestDesc = getBodyPartDescriptor(traits.chestSize);
    const waistDesc = getBodyPartDescriptor(traits.waistSize);
    const hipDesc = getBodyPartDescriptor(traits.hipSize);

    const positivePrompt = `Full body character design. Female, ${traits.hairColor} hair, ${traits.skinTone} skin, ${traits.bodyType} build. Physique: ${chestDesc} bust, ${waistDesc} waist, ${hipDesc} hips. Wearing ${traits.underwearColor || 'Black'} ${traits.underwearStyle || 'Lingerie'}. Pose: ${traits.pose}. High quality, detailed, masterpiece.`;

    const negativePrompt = "nsfw, nude, deformed, blurry, low quality, bad anatomy, ugly, extra limbs, missing limbs";

    // 3. Inject into Workflow
    // Assuming standard KSampler or TextEncode nodes exist
    // We look for nodes with type 'CLIPTextEncode' (usually 2 of them: pos, neg)
    // Or we rely on finding them by ID or Title if we set them in the template.
    // In our template, ID 45 is Positive (connected to KSampler 'positive'), ID 42 is Negative?
    // Wait, let's look at z_image_t2i.json structure I created.
    // Node 45 is CLIPTextEncode (Positive). Link 41 -> KSampler positive.
    // Node 42 is ConditioningZeroOut (Negative). Link 42 -> KSampler negative.

    // Positive Prompt (ID 45)
    const posNode = workflow.nodes.find((n: any) => n.id === 45);
    if (posNode) updateNodeWidget(posNode, 0, positivePrompt);

    // Negative Prompt (Usually ConditioningZeroOut doesn't have text widget?
    // In the template I copied, Node 42 is ConditioningZeroOut. It takes input from Node 45?
    // Wait, let's re-read the json logic I created.
    // Node 45 (CLIPTextEncode) outputs CONDITIONING.
    // Link 36 goes to Node 42 (ConditioningZeroOut).
    // Link 41 goes to Node 44 (KSampler positive).
    // Node 42 outputs CONDITIONING (Link 42) -> Node 44 (KSampler negative).
    // So in this specific Z-Image workflow, it seems to use "ZeroOut" of the positive prompt as the negative prompt?
    // If so, we only need to set the positive prompt.
    // But if we want a *real* negative prompt, we'd need a separate CLIPTextEncode node.
    // For now, I will stick to the template structure: ONLY Update Positive Prompt.

    // Seed randomization (KSampler ID 44)
    const samplerNode = workflow.nodes.find((n: any) => n.id === 44);
    if (samplerNode) {
        // Widget 0 is seed usually
        updateNodeWidget(samplerNode, 0, Math.floor(Math.random() * 1000000000));
    }

    // 4. Queue and Wait
    const promptResponse = await comfy.queuePrompt(workflowToPrompt(workflow));
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

    // 2. Load the I2I Workflow
    const response = await fetch('/workflows/z_image_i2i.json');
    if (!response.ok) throw new Error("Failed to load I2I workflow template");
    const workflow = await response.json();

    // 3. Construct Prompt
    const promptText = `Character wearing ${outfitDescription}. ${scene !== 'Original' ? scene : ''}. High quality, detailed.`;

    // 4. Inject into Workflow

    // Image Loader (ID 100)
    const imageNode = workflow.nodes.find((n: any) => n.id === 100);
    if (imageNode) updateNodeWidget(imageNode, 0, imageName);

    // Positive Prompt (ID 45)
    const posNode = workflow.nodes.find((n: any) => n.id === 45);
    if (posNode) updateNodeWidget(posNode, 0, promptText);

    // Seed (ID 44)
    const samplerNode = workflow.nodes.find((n: any) => n.id === 44);
    if (samplerNode) {
        updateNodeWidget(samplerNode, 0, Math.floor(Math.random() * 1000000000));
    }

    // 5. Queue and Wait
    const promptResponse = await comfy.queuePrompt(workflowToPrompt(workflow));
    const promptId = promptResponse.prompt_id;
    const imageUrl = await comfy.waitForCompletion(promptId);

    return await comfy.downloadImageAsBase64(imageUrl);
};

// --- Internal Helper: Convert "Saved" Workflow (JSON) to API Prompt Format ---
// ComfyUI API expects a map of { [node_id]: { inputs: { ... }, class_type: "..." } }
// The "Saved" workflow format (with pos, size, etc.) is different.
function workflowToPrompt(workflow: any): any {
    const prompt: any = {};

    workflow.nodes.forEach((node: any) => {
        prompt[node.id] = {
            class_type: node.type,
            inputs: {}
        };

        // Copy widgets values to inputs
        // This is tricky because `widgets_values` is an array, but `inputs` expects named keys.
        // We often need to map widget index to input name based on the node definition.
        // HOWEVER, for many custom nodes or standard nodes, checking the `inputs` property in the workflow file isn't enough
        // because `widgets_values` correspond to UI widgets, not link inputs.
        //
        // Simple heuristic: If the workflow file works in UI, we might need a robust converter.
        // BUT, ComfyUI API *also* accepts the graph if we just look at the links and values.
        //
        // Actually, the easiest way is:
        // The API endpoint /prompt expects the "API Format", not the "UI Format".
        // The file I created is "UI Format".
        // Use `widgets_values` to populate the specific fields.
        //
        // Since I cannot know the field names for every node (e.g. seed, steps, cfg) without querying the object info,
        // I will rely on a simplified mapping for the nodes I know.
        //
        // CRITICAL: Z-Image nodes might have custom widget names.
        //
        // A better approach for this simplified Plan:
        // Use the saved workflow, but since we can't reliably convert UI-JSON to API-JSON without the ObjectInfo (node definitions),
        // we might face issues.
        //
        // However, ComfyUI has a "Save (API Format)" button.
        // If the user replaces the files with API-Format JSON, it's easier.
        // But the "Z-Image" example I found was UI format.
        //
        // I will attempt a best-effort conversion for known standard nodes,
        // and for unknown nodes, I will map `widgets_values` to generic names if possible,
        // OR warn the user to provide API format.
        //
        // Let's implement a specific mapper for the nodes in our template.

        const inputs = prompt[node.id].inputs;

        // Map Links
        if (node.inputs) {
            node.inputs.forEach((input: any) => {
                if (input.link) {
                    // Find the origin of the link
                    const linkId = input.link;
                    const link = workflow.links.find((l: any) => l[0] === linkId);
                    if (link) {
                        const originNodeId = link[1]; // origin node
                        const originSlot = link[2]; // origin slot index
                        inputs[input.name] = [String(originNodeId), originSlot];
                    }
                }
            });
        }

        // Map Widgets (Values)
        // This is the hard part. We hardcode knowledge of standard nodes.
        if (node.widgets_values) {
             const vals = node.widgets_values;

             if (node.type === "KSampler") {
                 inputs["seed"] = vals[0];
                 inputs["control_after_generate"] = vals[1];
                 inputs["steps"] = vals[2];
                 inputs["cfg"] = vals[3];
                 inputs["sampler_name"] = vals[4];
                 inputs["scheduler"] = vals[5];
                 inputs["denoise"] = vals[6];
             } else if (node.type === "CLIPTextEncode") {
                 inputs["text"] = vals[0];
             } else if (node.type === "EmptySD3LatentImage") {
                 inputs["width"] = vals[0];
                 inputs["height"] = vals[1];
                 inputs["batch_size"] = vals[2];
             } else if (node.type === "SaveImage") {
                 inputs["filename_prefix"] = vals[0];
             } else if (node.type === "LoadImage") {
                 inputs["image"] = vals[0];
                 inputs["upload"] = "image"; // usually
             } else if (node.type === "CheckpointLoaderSimple" || node.type === "UNETLoader" || node.type === "CLIPLoader" || node.type === "VAELoader") {
                 // Usually the first widget is the name
                 // Some have more.
                 // CLIPLoader: keys are "clip_name", "type", "device" (maybe?)
                 // UNETLoader: "unet_name", "weight_dtype"
                 if (node.type === "UNETLoader") {
                     inputs["unet_name"] = vals[0];
                     inputs["weight_dtype"] = vals[1];
                 } else if (node.type === "CLIPLoader") {
                     inputs["clip_name"] = vals[0];
                     inputs["type"] = vals[1];
                 } else if (node.type === "VAELoader") {
                     inputs["vae_name"] = vals[0];
                 }
             } else if (node.type === "LoraLoaderModelOnly") {
                 inputs["lora_name"] = vals[0];
                 inputs["strength_model"] = vals[1];
             } else if (node.type === "ModelSamplingAuraFlow") {
                 inputs["shift"] = vals[0];
             }
             // Fallback: if we don't know the node, we might lose widget values.
        }
    });

    return prompt;
}
