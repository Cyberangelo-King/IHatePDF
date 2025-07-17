# IHatePDF

A fast, free, privacy-friendly web app for merging PDFs, extracting images, and sorting documents for mortgage applications.

## Features
- **Merge PDFs:** Drag & drop or browse to upload multiple PDF files and merge them into one.
- **Extract Images:** Select a PDF and extract all images as PNG files, with batch download as ZIP.
- **Smart Sorting:** Automatically sort mortgage documents by type using filename keywords.
- **Modern UI:** Responsive, touch-friendly interface with onboarding, progress bars, and toast notifications.
- **Privacy:** All processing is done client-side; no files are uploaded to any server.

## Technologies Used
- [Tailwind CSS](https://tailwindcss.com/) for styling
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

## Accessibility & Compatibility
- Works on all modern browsers, including iOS Safari.
- Accessible buttons with `aria-label` attributes.

## Development & Customization
- All custom styles are in `style.css`.
- All app logic is in `app.js`.
- For production, use minified versions of CSS and JS.

## Credits
Made by Angelo (The Web Maven)

## License
This project is open source. See LICENSE if provided.
