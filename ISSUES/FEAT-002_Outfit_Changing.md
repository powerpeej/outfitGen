# [FEATURE] Impl: Outfit Changing (Inpainting)

**User Story:**
As a user, I want to upload a photo of a person, mask the clothing they are wearing, and provide a text prompt to change their outfit, so I can seamlessly modify existing images with new fashion ideas.

**Reference:**
- [docs/PRD.md#feat-002](docs/PRD.md)

**Technical Implementation:**
- Create a new UI section in `App.tsx` for Image-to-Image generation. This will require:
    - An image upload component for the user to provide the source image.
    - A simple masking interface (e.g., using a brush on a canvas element) to allow the user to specify the area to be changed.
    - A text input for the prompt describing the new outfit.
- The generation logic will be handled by the ComfyUI service (`services/comfyui.ts`).
- When the user clicks "Generate":
    1. The source image and the user-drawn mask must be uploaded to the ComfyUI `/upload/image` endpoint.
    2. The `public/workflows/z_image_i2i_gguf_api.json` workflow template will be used.
    3. The filenames of the uploaded image and mask will be injected into the `%INPUT_IMAGE%` and `%MASK_IMAGE%` placeholders in the workflow. The user's prompt will be injected into `%POSITIVE_PROMPT%`.
    4. The modified workflow will be sent to the ComfyUI `/prompt` endpoint.
- A loading state must be displayed while the new image is being generated.
- The final image should be fetched from the API and displayed to the user.
- Error handling is required for API failures.

**Acceptance Criteria:**
- [ ] The UI provides controls to upload an image, draw a mask on it, and enter a text prompt.
- [ ] After providing an image, mask, and prompt, clicking "Generate" triggers a loading state.
- [ ] The application successfully uploads the source image and mask to the ComfyUI server.
- [ ] The application makes a successful API call using the I2I workflow with the correct image filenames and prompt.
- [ ] When generation is complete, the new, modified image is displayed.
- [ ] A clear error message is shown if the API call or generation process fails.
