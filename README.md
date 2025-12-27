# OutfitGenie - Local AI Edition

A React application for generating and customizing character outfits using local AI tools (**ComfyUI** and **LM Studio**). This project uses the powerful **Z-Image Turbo** model for high-efficiency image generation.

## Prerequisites

To run this application, you need the following local AI services running:

### 1. ComfyUI (Image Generation)

You need a working installation of [ComfyUI](https://github.com/comfyanonymous/ComfyUI).

**Required Models:**
Download and place these models in your `ComfyUI/models/` directory:

*   **Checkpoints (`models/checkpoints/`):**
    *   `z_image_turbo_bf16.safetensors` ([Download](https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/diffusion_models/z_image_turbo_bf16.safetensors)) - *Note: Place in `models/diffusion_models/` or `models/checkpoints/` depending on your ComfyUI version, usually `diffusion_models` for Z-Image.*
*   **Text Encoders (`models/text_encoders/`):**
    *   `qwen_3_4b.safetensors` ([Download](https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/text_encoders/qwen_3_4b.safetensors))
*   **VAE (`models/vae/`):**
    *   `ae.safetensors` ([Download](https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/vae/ae.safetensors))
*   **LoRA (`models/loras/`):**
    *   `pixel_art_style_z_image_turbo.safetensors` (Optional, if you want specific styles)

**Setup:**
1.  Start ComfyUI (usually at `http://127.0.0.1:8188`).
2.  Ensure you have the required custom nodes installed. The app uses standard nodes + `ModelSamplingAuraFlow`. If missing, use ComfyUI Manager to install them.

### 2. LM Studio (Text & Vision)

You need [LM Studio](https://lmstudio.ai/) for prompt enhancement and image analysis.

**Setup:**
1.  Load a text model (e.g., Llama 3, Mistral) for prompt enhancement.
2.  Load a **Vision-compatible model** (e.g., LLaVA, BakLLaVA) if you want to use the "Analyze Image" feature.
3.  Start the Local Server in LM Studio (usually at `http://localhost:1234`).
4.  Ensure "CORS" is enabled in LM Studio server settings (to allow browser requests).

## Installation & Running

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Configuration (Optional):**
    If your services are running on different ports, create a `.env.local` file:
    ```env
    VITE_COMFY_API_URL=http://127.0.0.1:8188
    VITE_LM_STUDIO_API_URL=http://localhost:1234/v1
    ```

3.  **Run the App:**
    ```bash
    npm run dev
    ```

## How It Works

*   **Base Model Generation:** Uses the `Z-Image Turbo` Text-to-Image workflow (`z_image_t2i_api.json`) to create a character based on selected traits.
*   **Outfit Change:** Uses the `Z-Image Turbo` Image-to-Image workflow (`z_image_i2i_api.json`) to redraw the outfit while preserving the character pose and composition.
*   **Prompt Enhancement:** Sends your simple description to LM Studio to generate a detailed prompt.

## Troubleshooting

*   **CORS Errors:** Ensure LM Studio server has CORS enabled. ComfyUI usually handles local requests fine, but if you access from a different IP, check ComfyUI arguments (`--listen`).
*   **Generation Failed:** Check the ComfyUI console for red error messages. You might be missing a model file or a custom node.
