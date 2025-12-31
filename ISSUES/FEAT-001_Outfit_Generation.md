# [FEATURE] Impl: Outfit Generation (Text-to-Image)

**User Story:**
As a user, I want to generate a complete outfit image from a descriptive text prompt, so I can visualize and create new fashion concepts from my ideas.

**Reference:**
- [docs/PRD.md#feat-001](docs/PRD.md)

**Technical Implementation:**
- Enhance the main `App.tsx` component to include a text input area for the prompt and a "Generate" button.
- The generation logic will be handled by the ComfyUI service integration (`services/comfyui.ts`).
- When the user clicks "Generate", the application will:
    1. Load the `public/workflows/z_image_t2i_gguf_api.json` workflow template.
    2. Inject the user's text into the `%POSITIVE_PROMPT%` placeholder.
    3. Send the modified workflow to the ComfyUI `/prompt` endpoint.
- A loading state (e.g., a spinner or disabled button) must be displayed in the UI while the image is being generated.
- The resulting image from the ComfyUI API should be fetched and displayed in a designated image preview area.
- Error handling should be implemented to notify the user if the ComfyUI API call fails.

**Acceptance Criteria:**
- [ ] The main UI displays a text area for prompt input and a "Generate" button.
- [ ] After entering a prompt and clicking "Generate", a visual loading indicator appears.
- [ ] The application makes a successful API call to the configured ComfyUI endpoint using the T2I workflow.
- [ ] The text from the input area is correctly placed in the positive prompt section of the API payload.
- [ ] When generation is complete, the output image is rendered and visible to the user.
- [ ] If the connection to ComfyUI fails or the generation process errors out, a clear error message is shown.
