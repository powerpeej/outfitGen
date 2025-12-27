# Required Models for OutfitGenie (RTX 2070 8GB Optimized)

This guide is optimized for an **NVIDIA RTX 2070 (8GB VRAM)**.

**Strategy:** We use **GGUF Quantized Models** for image generation. This allows the massive Z-Image model (~19GB original size) to fit entirely within your 6-7GB of available VRAM, leaving just enough room for the system.

---

## 1. Image Generation Models (ComfyUI)

These models are required for the `Z-Image GGUF` workflows (both Text-to-Image and Outfit Changing).

### 🛠️ Required Custom Nodes
**You must install this custom node in ComfyUI for these models to work:**
*   **ComfyUI-GGUF**: [https://github.com/city96/ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF)
    *   *How to install:* Open ComfyUI Manager -> "Install Custom Nodes" -> Search "GGUF" -> Install "ComfyUI-GGUF".

### 📥 Model Downloads

| Component | Model Name | Size | Download Link | Destination Folder |
| :--- | :--- | :--- | :--- | :--- |
| **Diffusion Model** | `z_image_turbo-q3_k_s.gguf` | **3.8 GB** | [Download](https://huggingface.co/gguf-org/z-image-gguf/resolve/main/z-image-turbo-q3_k_s.gguf) | `ComfyUI/models/diffusion_models/` |
| **Text Encoder** | `Qwen3-4B-Q4_K_M.gguf` | **2.5 GB** | [Download](https://huggingface.co/unsloth/Qwen3-4B-GGUF/resolve/main/Qwen3-4B-Q4_K_M.gguf) | `ComfyUI/models/text_encoders/` |
| **VAE** | `ae.safetensors` | **335 MB** | [Download](https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/vae/ae.safetensors) | `ComfyUI/models/vae/` |

> **Note:** We use the `Q3_K_S` version (3.8GB) because it is the **only** version that leaves enough VRAM for the Text Encoder (2.5GB) + VAE + System Overhead on an 8GB card.

---

## 2. Text & Vision Models (LM Studio)

For describing outfits and chatting, we need a "smart" model that doesn't steal VRAM from the image generator.

### ⚙️ Configuration
*   **Key Setting:** In LM Studio, ensure **"GPU Offload"** is set to **"Split"** or partially reduced if you experience crashes.
*   Ideally, let this model run mostly in **System RAM** (DDR4/DDR5) so your **VRAM** (GDDR6) is free for ComfyUI.

### 📥 Recommended Model

| Model Name | Variant | Size | Notes |
| :--- | :--- | :--- | :--- |
| **Llama 3.1 8B Instruct** | `Q4_K_M.gguf` | ~4.9 GB | Industry standard. Great at fashion descriptions. |
| **Phi-3.5 Mini Instruct** | `Q4_K_M.gguf` | ~2.4 GB | Faster alternative if Llama 3 is too heavy for your system RAM. |

---

## 3. Workflow Usage

### Text-to-Image (New Outfit Base)
*   **File:** `z_image_t2i_gguf_api.json`
*   **Usage:** Generates a full image from a text prompt.
*   **Speed:** Expect **10-20 seconds** per image (faster than the 50s+ of the old setup).

### Image-to-Image (Outfit Change)
*   **File:** `z_image_i2i_gguf_api.json`
*   **Usage:**
    1.  Provide an input image (e.g., a photo of a person).
    2.  Provide a **Mask** (white pixels = area to change/outfit, black = keep).
    3.  The workflow uses `VAEEncodeForInpaint` to seamlessly replace the masked area with the new prompt description.
