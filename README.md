# IHatePDF v2.0

A full-featured, client-side PDF toolkit. Merge, split, sort, sign, annotate, fill forms, and more—all in your browser.

## Features
- Merge PDFs
- Split PDF to images
- Sort/reorder pages
- Digital signature (sign)
- PDF annotation
- Form fill (AcroForm)
- Utilities: reorder, delete, extract text, compress, watermark, page numbers, viewer
- Onboarding/Learn section
- 100% client-side, privacy-first

## Folder Structure
```
/src
  /components
    – Onboarding.jsx
  /features
    – merge.jsx, split.jsx, sort.jsx, sign.js, annotate.js, fillform.js, reorder.js, delete.js, extractText.js, compress.js, watermark.js, pageNumbers.js, viewer.js
  /utils
    – pdfUtils.js, fileUtils.js, session.js
/public
  – index.html
  – favicon.png
/styles
  – tailwind.css
/tests
  – unit/
  – integration/
  – e2e/
```

## Quickstart
1. `npm install`
2. `npm run dev` (or your preferred dev server)
3. Open `localhost:3000` (or as configured)

## Development
- React + Tailwind CSS
- Modular, lazy-loaded features
- Utility functions in `/src/utils`
- Add new features in `/src/features`

## Documentation
- See `/docs/PRD-v2.md` for product requirements
- See `/docs/CHANGELOG.md` for changes

## License
MIT


