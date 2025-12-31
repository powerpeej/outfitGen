# [FEATURE] Impl: My Wardrobe Image Gallery

**User Story:**
As a user, I want a simple image gallery to view and manage the images I have generated, so that I can easily access my previous creations. This collection will be called "My Wardrobe".

**Technical Implementation:**
- **Constraint:** Browser security prevents the client-side app from writing to the server's file system. Therefore, `localStorage` will be used for image persistence.
- Create a new component `components/WardrobeGallery.tsx`.
- Create a new service `services/wardrobe.ts` to manage storing and retrieving outfits from `localStorage`.
  - It should expose methods like `getWardrobeItems()`, `saveWardrobeItem(imageDataUrl: string)`, and `deleteWardrobeItem(itemId: string)`.
  - Data should be stored under a versioned key, e.g., `outfitGenie_wardrobe_v1`.
- The `WardrobeGallery` component will use the `wardrobe.ts` service to fetch and display images in a grid.
- A "My Wardrobe" button in the main UI will toggle the gallery's visibility.
- Clicking a thumbnail will open a larger view (modal/lightbox) with an option to delete the image permanently.

**Acceptance Criteria:**
- [ ] A "My Wardrobe" button is visible in the main application UI.
- [ ] When an image is successfully generated, it is saved to the user's wardrobe in `localStorage`.
- [ ] Clicking the "My Wardrobe" button opens a gallery view displaying all saved images.
- [ ] The gallery displays a grid of all images retrieved from `localStorage`.
- [ ] Clicking a thumbnail opens a larger, detailed view of that image.
- [ ] The detailed view includes a "Delete" button that removes the image from the gallery and `localStorage`.
- [ ] A mechanism exists to close the detailed view and return to the gallery grid.
