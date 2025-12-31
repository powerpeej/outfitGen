# [FEATURE] Impl: Local AI Integration Services

**User Story:**
As a developer, I need a set of robust and well-defined services to handle all communication with the local ComfyUI and LM Studio APIs, so that I can build user-facing features (like image generation) that rely on these connections.

**Reference:**
- [docs/PRD.md#feat-003](docs/PRD.md)

**Technical Implementation:**
- **Settings Service (`services/settings.ts`):**
    - This service will be the single source of truth for managing API endpoint URLs.
    - It must read the URLs for ComfyUI and LM Studio from `localStorage`.
    - It should provide sensible default values (e.g., `http://127.0.0.1:8188`) if no settings are found in `localStorage`.
    - It will be consumed by the other AI services.

- **ComfyUI Service (`services/comfyui.ts`):**
    - This service will encapsulate all API interactions with the ComfyUI server.
    - It must expose functions to:
        1.  `checkStatus()`: Fetches `/system_stats` to verify that the server is running.
        2.  `uploadImage(image, mask)`: Uploads an image and an optional mask to the `/upload/image` endpoint for use in Image-to-Image workflows.
        3.  `queuePrompt(workflow)`: Sends a workflow JSON object to the `/prompt` endpoint to start a generation job.
        4.  `getImage(filename, subfolder, type)`: Fetches the final image from the `/view` endpoint using details from the prompt queue response.
    - The service must include robust error handling for failed API calls.

- **LM Studio Service (`services/lmstudio.ts`):**
    - This service will encapsulate all API interactions with the LM Studio server.
    - It must expose a `checkStatus()` function that fetches `/v1/models` to verify the server is running and models are loaded.
    - (Future functionality for chat/prompt assistance can be added later).

**Acceptance Criteria:**
- [ ] A `services/settings.ts` file is created and correctly manages API URLs in `localStorage`.
- [ ] A `services/comfyui.ts` file is created with functions to check status, upload images, queue prompts, and retrieve images.
- [ ] A `services/lmstudio.ts` file is created with a function to check the server status.
- [ ] The application includes a `StatusIndicator` component in its UI that uses these services to show the connection status (e.g., Connected/Disconnected) for both ComfyUI and LM Studio.
- [ ] The services correctly handle and report errors if an API endpoint is not reachable or returns an error.
- [ ] Other features (`FEAT-001`, `FEAT-002`) can successfully use these services to perform their functions.
