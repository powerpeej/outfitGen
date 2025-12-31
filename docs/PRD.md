# Product Requirements Document: OutfitGenie

**Version:** 1.0
**Status:** Draft

## 1. Overview

OutfitGenie is a modern web application for generating and managing outfits, powered by local AI. It allows users to create unique outfits from text prompts and seamlessly modify outfits in existing photos. The application is designed to run efficiently on consumer-grade hardware with limited VRAM.

## 2. Target Audience

The primary audience is fashion enthusiasts, content creators, and individuals who want to experiment with style and clothing combinations without needing physical garments. They are tech-savvy enough to install local applications like ComfyUI and LM Studio but require a user-friendly interface to interact with the powerful AI models.

## 3. Core Features & Roadmap

The status of each feature will be tracked here. The goal is to synchronize this section with GitHub Issues.

| Feature ID | Feature Name          | Description                                                                                             | Status      |
|------------|-----------------------|---------------------------------------------------------------------------------------------------------|-------------|
| FEAT-001   | **Outfit Generation** | Generate a full outfit image from a descriptive text prompt (Text-to-Image).                            | `In Progress` |
| FEAT-002   | **Outfit Changing**   | Upload an image and a mask to replace an existing outfit with a new one based on a prompt (Inpainting). | `In Progress` |
| FEAT-003   | **Local AI Integration** | Connect to locally running ComfyUI and LM Studio instances to perform generation tasks.                  | `In Progress` |
| FEAT-004   | **Settings Panel**    | A UI panel to configure API endpoints for ComfyUI and LM Studio.                                        | `Planned`     |
| FEAT-005   | **Image Gallery**     | A simple gallery to view and manage previously generated images.                                        | `Planned`     |


## 4. Technical Requirements & Constraints

### 4.1. Hardware Optimization
- The application **must** be optimized to run on an **NVIDIA RTX 2070 with 8GB VRAM**.
- All AI models must be GGUF Quantized to fit within this memory constraint.

### 4.2. Software Dependencies
- **ComfyUI**: Must be installed and running locally.
    - **Required Custom Node**: `ComfyUI-GGUF`.
- **LM Studio**: Must be installed and running locally for text processing.

### 4.3. Architecture
- **Frontend**: React, Vite, TypeScript.
- **Styling**: Tailwind CSS (via CDN).
- **Structure**: Flat directory structure (no `src/` folder).

## 5. Out of Scope (for V1)

- Cloud-based AI model support.
- User authentication and accounts.
- Social sharing features.
- Advanced image editing tools beyond masking/inpainting.
