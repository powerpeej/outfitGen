# Agent Guidelines for OutfitGenie

This document provides instructions and constraints for AI agents and developers working on the OutfitGenie codebase.

## 1. Project Structure

*   **Flat Structure:** This project deliberately uses a flat file structure.
    *   Source files (`App.tsx`, `index.tsx`, `vite-env.d.ts`) reside in the **root directory**.
    *   **Do not** create a `src/` directory or move files into one.
*   **Components:** UI components are located in `components/`.
*   **Services:** API logic and settings are in `services/`.
*   **Public Assets:** Static files and workflow templates are in `public/`.

## 2. Hardware Constraints & Models

*   **Target Hardware:** NVIDIA RTX 2070 (8GB VRAM).
*   **Constraint:** All changes must respect the **8GB VRAM limit**.
    *   **Image Generation:** MUST use **GGUF Quantized Models** (Z-Image) via `ComfyUI-GGUF`.
    *   **LLM:** MUST use quantized models (e.g., Llama 3.1 8B Q4) in **LM Studio**, offloaded primarily to System RAM.
*   **Verification:** Before suggesting model changes, verify they fit within this VRAM budget.

## 3. Workflows

*   The application relies on specific ComfyUI API workflow templates located in `public/workflows/`.
*   **Key Files:**
    *   `z_image_t2i_gguf_api.json`: Text-to-Image (Base generation).
    *   `z_image_i2i_gguf_api.json`: Image-to-Image (Inpainting/Outfit Change).
*   **Note:** These files use placeholder strings (e.g., `%POSITIVE_PROMPT%`) for dynamic inputs. Do not alter this format without updating the corresponding service logic.

## 4. External Integrations

*   **Documentation First:** Before writing code for external tools (ComfyUI, LM Studio, React libraries), you **must** check their latest online documentation if you are unsure.
*   **Model Setup:** Refer to `scripts/setup_models.py` for the exact URLs and file paths of the required models.

## 5. Environment Variables

*   Use `import.meta.env` for accessing environment variables (Vite).
*   Required variables:
    *   `VITE_COMFY_API_URL`
    *   `VITE_LM_STUDIO_API_URL`
