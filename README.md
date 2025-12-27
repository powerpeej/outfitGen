# OutfitGenie - Local AI Edition

A React application for generating and customizing character outfits using local AI tools (**ComfyUI** and **LM Studio**). This project uses the powerful **Z-Image Turbo** model for high-efficiency image generation.

## Prerequisites

To run this application, you need the following local AI services running:

### 1. ComfyUI (Image Generation)

You need a working installation of [ComfyUI](https://github.com/comfyanonymous/ComfyUI).

**Required Models:**
Download and place these models in your `ComfyUI/models/` directory structure as follows:

| File Name | Download Link | Target Directory |
| :--- | :--- | :--- |
| `z_image_turbo_bf16.safetensors` | [Download](https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/diffusion_models/z_image_turbo_bf16.safetensors) | `models/diffusion_models/` |
| `qwen_3_4b.safetensors` | [Download](https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/text_encoders/qwen_3_4b.safetensors) | `models/text_encoders/` |
| `ae.safetensors` | [Download](https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/vae/ae.safetensors) | `models/vae/` |

*Note: Ensure you are using a recent version of ComfyUI for Z-Image support.*

**Setup:**
1.  **Update ComfyUI:** Ensure your ComfyUI is updated to the latest version to support `ModelSamplingAuraFlow` (native in recent versions).
2.  **Start Server:** Start ComfyUI (default: `http://127.0.0.1:8188`).
3.  **Cross-Origin:** If running on a different machine or IP, ensure you run ComfyUI with `--listen` and potentially `--enable-cors-header *`.

### 2. LM Studio (Text & Vision)

You need [LM Studio](https://lmstudio.ai/) for prompt enhancement and image analysis.

**Recommended Models:**
*   **For Prompt Enhancement (Text):**
    *   [Meta Llama 3 8B Instruct](https://huggingface.co/lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF) - Excellent general purpose instruction following.
*   **For Image Analysis (Vision):**
    *   [MiniCPM-V 2.6](https://huggingface.co/lmstudio-community/MiniCPM-V-2_6-GGUF) - State-of-the-art efficiency for vision tasks (Requires LM Studio 0.3.0+).
    *   [LLaVA Llama 3 8B](https://huggingface.co/xtuner/llava-llama-3-8b-v1_1-gguf) - Strong alternative based on Llama 3.

**Setup:**
1.  **Load Model:** Search for and download one of the recommended models above within LM Studio.
2.  **Start Server:** Start the Local Server in LM Studio (default: `http://localhost:1234`).
3.  **CORS (Important):** You **MUST** enable "CORS" in the LM Studio server settings (right sidebar) to allow the web app to communicate with it.

## Installation & Running

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Configuration:**
    Create a `.env.local` file in the root directory to point to your local services if they differ from defaults:

    ```env
    # Default ComfyUI URL
    VITE_COMFY_API_URL=http://127.0.0.1:8188

    # Default LM Studio URL (ensure /v1 is included)
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

*   **CORS Errors:** Ensure LM Studio server has CORS enabled. For ComfyUI, if accessing from a different device, check startup arguments.
*   **"Model not found" in ComfyUI:** Verify you placed the `.safetensors` files in the exact directories listed above.
*   **Generation Failed:** Check the ComfyUI console window for error messages. If a node is red, you might be missing a model or need to update ComfyUI.
