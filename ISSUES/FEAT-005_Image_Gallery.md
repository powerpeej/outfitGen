# [FEATURE] Impl: Image Gallery for Generated Images

**User Story:**
As a user, I want a simple image gallery to view and manage the images I have generated, so that I can easily access my previous creations.

**Technical Implementation:**
- Create a new component `components/ImageGallery.tsx`.
- This component should display a grid of thumbnail images.
- The generated images should be stored in a dedicated folder, for example `public/gallery`.
- A button or link in the main UI should open the gallery view.
- When an image is generated, it should be saved to the `public/gallery` directory.
- The gallery should read the list of images from the `public/gallery` directory and display them.
- Clicking on a thumbnail in the gallery should display a larger version of the image in a modal or a lightbox.

**Acceptance Criteria:**
- [ ] An icon/button is visible in the main application UI to open the gallery.
- [ ] When an image is successfully generated, it is saved as a file in the `public/gallery` folder.
- [ ] The gallery view displays a grid of all images from the `public/gallery` folder.
- [ ] Clicking on a thumbnail in the gallery opens a larger view of that image.
- [ ] There is a way to close the larger image view and return to the gallery grid.
