# [FEATURE] Impl: Settings Panel for API Endpoints

**User Story:**
As a user, I want a settings panel where I can easily configure and save the API endpoints for ComfyUI and LM Studio, so that the application can connect to my local AI services.

**Technical Implementation:**
- Create a new component `components/SettingsPanel.tsx`.
- This component should be a modal or a drawer that can be opened from the main UI (e.g., via a settings icon button).
- Use `useState` to manage the input fields for the ComfyUI and LM Studio URLs.
- The `services/settings.ts` file should be used to save and retrieve the settings from `localStorage`.
- The settings should be loaded from `localStorage` when the application starts.
- Add a "Save" button to persist the changes to `localStorage`.
- Add a "Close" or "Cancel" button to dismiss the panel without saving.

**Acceptance Criteria:**
- [ ] A settings icon/button is visible in the main application UI.
- [ ] Clicking the settings icon opens a modal/drawer with input fields for "ComfyUI API URL" and "LM Studio API URL".
- [ ] The input fields are pre-populated with the current values from `localStorage` (or default values if not set).
- [ ] When I change the values and click "Save", the new URLs are saved to `localStorage`.
- [ ] The application uses the new URLs for subsequent API calls.
- [ ] When I click "Close" or "Cancel", the modal/drawer closes and any changes are discarded.
