# IHatePDF

A fast, free, privacy-friendly web app for merging PDFs, extracting images, and sorting documents for mortgage applications.

[View it live here](https://i-hate-pdf.netlify.app/)

## Features
- **Merge PDFs:** Drag & drop or browse to upload multiple PDF files and merge them into one.
- **Extract Images:** Select a PDF and extract all images as PNG files, with batch download as ZIP.
- **Smart Sorting:** Automatically sort mortgage documents by type using filename keywords.
- **Modern UI:** Responsive, touch-friendly interface with onboarding, progress bars, and toast notifications.
- **Privacy:** All processing is done client-side; no files are uploaded to any server.

## Technologies Used
- [Tailwind CSS](https://tailwindcss.com/) for styling (pre-built CSS for production)
- [Alpine.js](https://alpinejs.dev/) for UI interactivity
- [PDF.js](https://mozilla.github.io/pdf.js/) for PDF rendering
- [PDF-lib](https://pdf-lib.js.org/) for PDF merging
- [JSZip](https://stuk.github.io/jszip/) and [FileSaver.js](https://github.com/eligrey/FileSaver.js/) for ZIP downloads
- [Font Awesome](https://fontawesome.com/) for icons

## How to Use
1. **Open `index.html` in your browser.**
2. **Merge PDFs:**
   - Drag & drop PDF files or click "Browse Files".
   - Reorder files by dragging thumbnails.
   - Click "Merge PDFs" to download the merged file.
3. **Extract Images:**
   - Switch to "Extract Images" tab.
   - Drag & drop a PDF or click "Browse PDF".
   - Select images and download individually or as ZIP.
4. **Sort for Mortgage:**
   - Click "Sort for Mortgage" to auto-arrange files by document type.

## Accessibility, SEO & Compatibility
- Works on all modern browsers, including iOS Safari (with iOS-specific fixes).
- Accessible buttons with `aria-label` attributes.
- Open Graph and Twitter meta tags for rich social sharing.
- All favicon and manifest files are referenced for cross-browser/device support.
- SEO/social image (`IHatePDF.png`) included.

## Project Structure
- `index.html` — Main HTML file, optimized for production, SEO, and accessibility
- `style.css` — Custom styles (minified, typo-free)
- `app.js` — Alpine.js logic (minified, externalized, modular-ready)
- `favicon.ico`, `favicon-32x32.png`, `favicon-16x16.png`, `apple-touch-icon.png` — Favicons
- `site.webmanifest` — Web app manifest
- `IHatePDF.png` — SEO/social sharing image
- `android-chrome-192x192.png`, `android-chrome-512x512.png` — PWA icons
- `tests/unit/` — Unit tests (Vitest)
- `tests/e2e/` — End-to-end tests (Playwright)
- `CONTRIBUTING.md` — Contribution guidelines

## Production & Deployment
- All assets are present and referenced in `index.html`.
- Cache-busting query strings added to CSS/JS links for reliable updates.
- Use minified versions of CSS and JS for best performance.
- No server required; deploy as static files to any web host.
- Fully optimized for SEO, accessibility, and cross-browser/device compatibility.

## Development & Customization
- All custom styles are in `style.css`.
- All app logic is in `app.js` (modular structure for scalability).
- For production, use minified versions of CSS and JS.
- Automated tests in `tests/` folder (see CONTRIBUTING.md).

## Credits
Made by <a href="https://github.com/Cyberangelo-King" target="_blank" rel="noopener">Angelo (The Web Maven)</a>


