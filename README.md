# OutfitGenie

A modern web application for generating and managing outfits, powered by ComfyUI and local LLMs.

**Hardware Optimized:** This project is specifically optimized for an **NVIDIA RTX 2070 (8GB VRAM)**. It uses **GGUF Quantized Models** to fit massive image generation models into limited VRAM.

## Features

- **Outfit Generation**: Create unique outfits using text prompts (Z-Image GGUF).
- **Outfit Changing**: Seamlessly replace outfits in existing photos (Inpainting).
- **Local AI Integration**:
  - Uses **ComfyUI** for image generation.
  - Uses **LM Studio** for text processing and descriptions.
- **Responsive UI**: Built with React and Tailwind CSS for a seamless experience.

## Prerequisites

1.  **Node.js**: Install Node.js (v18 or higher recommended).
2.  **ComfyUI**: Installed and running locally.
    *   **Required Custom Node**: [ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF).
3.  **LM Studio**: Installed and running locally.
4.  **Python**: Required to run the model setup script.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Models (Automated)
We have a script to automate the installation of the `ComfyUI-GGUF` node and the download of the required GGUF models (`z-image-turbo-q3_k_s.gguf`, `Qwen3-4B-Q4_K_M.gguf`, `ae.safetensors`).

1.  Open `scripts/setup_models.py` and verify/edit the `COMFY_PATH` to point to your local ComfyUI installation.
2.  Run the script:
    ```bash
    python scripts/setup_models.py
    ```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add your API endpoints:
```env
VITE_COMFY_API_URL=http://127.0.0.1:8188
VITE_LM_STUDIO_API_URL=http://localhost:1234
```

### 4. LM Studio Configuration
To prevent the LLM from stealing VRAM needed for image generation:
*   **GPU Offload**: Set to **"Split"** or reduce until stable.
*   **Recommendation**: Run models like `Llama 3.1 8B Instruct (Q4_K_M)` mostly in **System RAM** to leave VRAM for ComfyUI.

### 5. Run Development Server
```bash
npm run dev
```

## Usage

1.  Start **ComfyUI**.
2.  Start **LM Studio** (Server mode enabled).
3.  Open the application in your browser (usually `http://localhost:3000`).
4.  **Text-to-Image**: Generates a full image from a text prompt.
5.  **Image-to-Image**: Uploads an image and a mask to change specific parts (e.g., the outfit).

## Project Structure

The project uses a flat directory structure in the root:

- `App.tsx`: Main application component.
- `components/`: React UI components.
- `services/`: API services and settings.
- `scripts/`: Utility scripts (e.g., model setup).
- `public/`: Static assets and ComfyUI workflow templates (`.json`).

## License

[License Information]
