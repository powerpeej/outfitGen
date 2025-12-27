# Required Models for Z-Image Workflows (RTX 2070 8GB Optimized)

This guide is optimized for an **NVIDIA RTX 2070 (8GB VRAM)**. Using the standard BF16 models (~19GB total) would cause severe performance issues due to system RAM offloading.

**Recommendation: Use GGUF Quantized Models.** This reduces VRAM usage significantly while maintaining good quality.

## 1. Primary Recommendation: GGUF Models (Fast & Efficient)

These models fit comfortably within 8GB VRAM when offloaded smartly, or entirely if using lower quantizations.

### Required Custom Nodes
**You must install this custom node in ComfyUI for these models to work:**
*   **ComfyUI-GGUF**: [https://github.com/city96/ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF)
    *   *Install via ComfyUI Manager or `git clone` into `custom_nodes/`.*

### Model Downloads

| Component | Model Name | Size | Download Link | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Diffusion Model** | `z_image_turbo-Q5_K_M.gguf` | ~5.5 GB | [Download](https://huggingface.co/jayn7/Z-Image-Turbo-GGUF/resolve/main/z_image_turbo-Q5_K_M.gguf) | **Best Balance.** Place in `ComfyUI/models/diffusion_models/` |
| | `z_image_turbo-Q8_0.gguf` | ~7.2 GB | [Download](https://huggingface.co/jayn7/Z-Image-Turbo-GGUF/resolve/main/z_image_turbo-Q8_0.gguf) | Higher quality, but tighter on VRAM. |
| **Text Encoder** | `Qwen3-4B-Q4_K_M.gguf` | ~2.5 GB | [Download Folder](https://huggingface.co/unsloth/Qwen3-4B-GGUF/tree/main) | Pick `Q4_K_M` or `Q5_K_M`. Place in `ComfyUI/models/text_encoders/` |
| **VAE** | `ae.safetensors` | ~335 MB | [Download](https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/vae/ae.safetensors) | Standard Flux VAE. Place in `ComfyUI/models/vae/` |

### Workflow Configuration
The standard workflows included in this app (`z_image_t2i_api.json`) are configured for `safetensors` files. To use GGUF models:

1.  **Download the GGUF Workflow**: [example_workflow.json](https://huggingface.co/jayn7/Z-Image-Turbo-GGUF/resolve/main/example_workflow.json)
2.  Open this workflow in ComfyUI.
3.  Ensure the `UnetLoaderGGUF` node (from ComfyUI-GGUF) is selected and points to your downloaded `.gguf` file.
4.  Ensure the `CLIPLoader` (or DualCLIPLoader) points to the `Qwen3` GGUF text encoder.

---

## 2. Alternative: Original BF16 Models (High VRAM)

**⚠️ NOT Recommended for 8GB VRAM**
Running these will force ComfyUI to offload to system RAM, resulting in very slow generation times (potentially minutes per image).

*   **Launch Argument**: You must run ComfyUI with `--lowvram`.

| Component | Filename | Size | Link |
| :--- | :--- | :--- | :--- |
| Text Encoder | `qwen_3_4b.safetensors` | 6.8 GB | [Link](https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/text_encoders/qwen_3_4b.safetensors) |
| Diffusion | `z_image_turbo_bf16.safetensors` | 11.5 GB | [Link](https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/diffusion_models/z_image_turbo_bf16.safetensors) |
| VAE | `ae.safetensors` | 335 MB | [Link](https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/vae/ae.safetensors) |
