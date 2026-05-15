// PDF.js library and worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

const normalizePdfName = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

document.addEventListener('alpine:init', () => {
    Alpine.data('app', () => ({
        activeTab: 'merge',
        isDragOver: false,
        showInvalidFileWarning: false,
        mergeFiles: [],
        extractFile: null,
        extractedImages: [],
        imageQuality: '1.0',
        mergedFilename: 'merged-documents-' + new Date().getFullYear() + '.pdf',
        isProcessing: false,
        processingProgress: 0,
        toasts: [],
        toastIdCounter: 0,
        selectedImages: [],
        draggingIndex: null,
        dragOverIndex: null,
        showOnboarding: false,
        currentOnboardingStep: 0,
        onboardingSteps: [
            { title: '📤 Upload PDFs', description: 'Drag your PDF files into the designated area or click to browse and select them.', animation: '<div class="pulse-animation"></div>' },
            { title: '↕️ Reorder Documents', description: 'Once uploaded, drag and drop the PDF thumbnails to arrange them in your desired merging order.', animation: '<div class="drag-demo"></div>' },
            { title: '✨ Merge & Extract', description: 'Click the "Merge PDFs" button to combine them, or switch to "Extract Images" to get all images from a PDF.', animation: '<i class="fas fa-file-pdf text-6xl text-indigo-500"></i><i class="fas fa-arrow-right text-4xl text-gray-400 mx-4"></i><i class="fas fa-file-image text-6xl text-emerald-500"></i>' },
            { title: '✅ All Done!', description: 'Your processed files will be ready for instant download. Enjoy a seamless PDF experience!', animation: '<i class="fas fa-check-circle text-6xl text-green-500"></i>' }
        ],
        mortgageDocumentOrder: [
            { name: "Application letter", keywords: ["application", "letter", "application letter"] },
            { name: "Letter of Introduction", keywords: ["introduction letter", "intro letter", "intro", "letter of introduction"] },
            { name: "National Id", keywords: ["national id", "id card", "nin", "national identity"] },
            { name: "PMI account statement", keywords: ["pmi statement", "pmi account", "pmi account statement"] },
            { name: "PMI offer letter", keywords: ["pmi offer", "pmi offer letter"] },
            { name: "Property offer letter", keywords: ["property offer", "property offer letter"] },
            { name: "Verification of property", keywords: ["property verification", "verification of property"] },
            { name: "Consent form", keywords: ["consent form", "consent"] },
            { name: "RSA holder indemnity", keywords: ["rsa indemnity", "rsa holder indemnity", "rsa holder"] },
            { name: "PMI indemnity", keywords: ["pmi indemnity"] },
            { name: "Valuation", keywords: ["valuation report", "valuation"] },
            { name: "Property Insurance", keywords: ["property insurance", "house insurance", "building insurance"] },
            { name: "Life insurance", keywords: ["life insurance"] },
            { name: "Confirmation of availability", keywords: ["availability confirmation", "confirmation of availability"] },
            { name: "C of O (property title)", keywords: ["c of o", "cofo", "certificate of occupancy", "property title", "title document"] },
            { name: "Confirmation of title", keywords: ["title confirmation", "confirmation of title"] },
            { name: "Expression of disbursement", keywords: ["disbursement expression", "disbursement", "expression of disbursement"] }
        ],
        init() {
            if (!localStorage.getItem('ihatepdf_onboarding_completed')) this.showOnboarding = true;
            this.$nextTick(() => {
                document.querySelectorAll('.btn-primary').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const rect = button.getBoundingClientRect();
                        const size = Math.max(rect.width, rect.height);
                        const ripple = document.createElement('span');
                        ripple.classList.add('ripple');
                        ripple.style.width = ripple.style.height = `${size}px`;
                        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
                        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
                        button.appendChild(ripple);
                        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
                    });
                });
            });
        },
        nextOnboardingStep() { this.currentOnboardingStep < this.onboardingSteps.length - 1 ? this.currentOnboardingStep++ : this.skipOnboarding(); },
        skipOnboarding() { this.showOnboarding = false; localStorage.setItem('ihatepdf_onboarding_completed', 'true'); },
        showToast(message, type = 'info', duration = 3000) {
            const id = this.toastIdCounter++;
            this.toasts.push({ id, message, type });
            setTimeout(() => { this.toasts = this.toasts.filter(toast => toast.id !== id); }, duration);
        },
        isValidPdf(file) {
            return file && file.type === 'application/pdf' && file.size <= MAX_FILE_SIZE_BYTES;
        },
        async handleFileSelect(event, type) { this.isDragOver = false; this.showInvalidFileWarning = false; await this.processFiles(Array.from(event.target.files), type); },
        async handleDrop(event, type) { this.isDragOver = false; this.showInvalidFileWarning = false; await this.processFiles(Array.from(event.dataTransfer.files), type); },
        async processFiles(files, type) {
            const pdfFiles = files.filter(file => this.isValidPdf(file));
            const invalidFiles = files.filter(file => !this.isValidPdf(file));
            if (invalidFiles.length > 0) {
                this.showInvalidFileWarning = true;
                this.showToast('Only PDF files up to 25MB are allowed. Invalid files were ignored.', 'error');
            }
            if (type === 'merge') {
                for (const file of pdfFiles) {
                    const id = crypto.randomUUID();
                    try {
                        const arrayBuffer = await file.arrayBuffer();
                        const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                        this.mergeFiles.push({ id, name: file.name, file, arrayBuffer, pageCount: pdfDoc.numPages, normalizedName: normalizePdfName(file.name) });
                        await pdfDoc.destroy();
                        this.$nextTick(() => this.renderPdfThumbnail(arrayBuffer, id));
                    } catch (error) {
                        this.showToast(`Could not load PDF: ${file.name}.`, 'error');
                    }
                }
                this.mergeFiles = [...this.mergeFiles];
            } else if (type === 'extract') {
                if (pdfFiles.length !== 1) return this.showToast('Please select only one valid PDF for image extraction.', 'error');
                this.extractFile = { id: crypto.randomUUID(), name: pdfFiles[0].name, file: pdfFiles[0] };
                this.extractedImages = [];
                this.selectedImages = [];
                await this.extractImages();
            }
        },
        async renderPdfThumbnail(arrayBuffer, id) {
            const canvas = document.getElementById(`pdf-thumbnail-${id}`);
            if (!canvas) return;
            try {
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 0.5 });
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: canvas.getContext('2d', { alpha: false }), viewport }).promise;
                await pdf.destroy();
            } catch {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#ef4444';
                ctx.textAlign = 'center';
                ctx.fillText('Error rendering', canvas.width / 2, canvas.height / 2);
            }
        },
        removeFile(id, type) { if (type === 'merge') this.mergeFiles = this.mergeFiles.filter(file => file.id !== id); },
        clearExtractFile() { this.extractFile = null; this.extractedImages = []; this.selectedImages = []; },
        handleDragStart(event, index) { this.draggingIndex = index; event.dataTransfer.setData('text/plain', index); event.target.classList.add('dragging'); },
        handleDragOver(event, index) { event.preventDefault(); if (this.draggingIndex !== null && this.draggingIndex !== index) this.dragOverIndex = index; },
        handleDragLeave(event, index) { if (this.dragOverIndex === index) this.dragOverIndex = null; },
        handleDropReorder(event, targetIndex) {
            event.preventDefault();
            const draggedIndex = Number.parseInt(event.dataTransfer.getData('text/plain'), 10);
            if (draggedIndex !== targetIndex) {
                const [draggedItem] = this.mergeFiles.splice(draggedIndex, 1);
                this.mergeFiles.splice(targetIndex, 0, draggedItem);
                this.mergeFiles = [...this.mergeFiles];
            }
            this.dragOverIndex = null;
        },
        handleDragEnd(event) { this.draggingIndex = null; this.dragOverIndex = null; event?.target?.classList.remove('dragging'); },
        async mergePdfs() {
            if (!this.mergeFiles.length) return this.showToast('Please upload PDFs to merge first.', 'error');
            this.isProcessing = true;
            this.processingProgress = 0;
            try {
                const mergedPdf = await PDFLib.PDFDocument.create();
                for (let i = 0; i < this.mergeFiles.length; i++) {
                    const pdf = await PDFLib.PDFDocument.load(this.mergeFiles[i].arrayBuffer);
                    (await mergedPdf.copyPages(pdf, pdf.getPageIndices())).forEach((page) => mergedPdf.addPage(page));
                    this.processingProgress = ((i + 1) / this.mergeFiles.length) * 95;
                }
                const filename = this.mergedFilename.endsWith('.pdf') ? this.mergedFilename : `${this.mergedFilename}.pdf`;
                saveAs(new Blob([await mergedPdf.save()], { type: 'application/pdf' }), filename);
                this.processingProgress = 100;
                this.resetMergeState();
            } catch {
                this.showToast('Failed to merge PDFs.', 'error');
            } finally { this.isProcessing = false; this.processingProgress = 0; }
        },
        resetMergeState() { this.mergeFiles = []; this.mergedFilename = 'merged-documents-' + new Date().getFullYear() + '.pdf'; },
        async extractImages() {
            if (!this.extractFile) return;
            this.isProcessing = true; this.processingProgress = 0; this.extractedImages = []; this.selectedImages = [];
            try {
                const pdf = await pdfjsLib.getDocument({ data: await this.extractFile.file.arrayBuffer() }).promise;
                const numPages = pdf.numPages; const scale = parseFloat(this.imageQuality);
                for (let i = 1; i <= numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale });
                    const canvas = document.createElement('canvas');
                    canvas.height = viewport.height; canvas.width = viewport.width;
                    await page.render({ canvasContext: canvas.getContext('2d', { alpha: false }), viewport }).promise;
                    this.extractedImages.push({ id: crypto.randomUUID(), url: canvas.toDataURL('image/png'), filename: `${this.extractFile.name.replace('.pdf', '')}_page_${i}.png` });
                    this.processingProgress = (i / numPages) * 100;
                }
                await pdf.destroy();
            } catch { this.showToast('Failed to extract images from this PDF.', 'error'); }
            finally { this.isProcessing = false; this.processingProgress = 0; }
        },
        toggleImageSelection(imageId, event) {
            if (event.shiftKey && this.selectedImages.length > 0) {
                const a = this.extractedImages.findIndex(img => img.id === this.selectedImages[this.selectedImages.length - 1]);
                const b = this.extractedImages.findIndex(img => img.id === imageId);
                if (a !== -1 && b !== -1) this.selectedImages = [...new Set([...this.selectedImages, ...this.extractedImages.slice(Math.min(a, b), Math.max(a, b) + 1).map(img => img.id)])];
            } else this.selectedImages = this.selectedImages.includes(imageId) ? this.selectedImages.filter(id => id !== imageId) : [...this.selectedImages, imageId];
        },
        selectAllImages() { this.selectedImages = this.extractedImages.map(img => img.id); },
        clearSelection() { this.selectedImages = []; },
        downloadImage(url, filename) { saveAs(url, filename); },
        async downloadSelectedImages() {
            if (!this.selectedImages.length) return this.showToast('Please select images to download first.', 'error');
            this.isProcessing = true;
            try {
                const zip = new JSZip();
                for (let i = 0; i < this.selectedImages.length; i++) {
                    const image = this.extractedImages.find(img => img.id === this.selectedImages[i]);
                    if (image) zip.file(image.filename, await (await fetch(image.url)).blob());
                    this.processingProgress = ((i + 1) / this.selectedImages.length) * 100;
                }
                saveAs(await zip.generateAsync({ type: 'blob' }), `${this.extractFile.name.replace('.pdf', '')}_images.zip`);
                this.selectedImages = [];
            } catch { this.showToast('Failed to create ZIP file for download.', 'error'); }
            finally { this.isProcessing = false; this.processingProgress = 0; }
        },
        sortForMortgage() {
            if (!this.mergeFiles.length) return this.showToast('Please upload PDFs to sort first.', 'error');
            const sortedFiles = [];
            const unmatchedFiles = [...this.mergeFiles];
            for (const mortgageDoc of this.mortgageDocumentOrder) {
                const normalizedKeywords = mortgageDoc.keywords.map(normalizePdfName);
                const index = unmatchedFiles.findIndex(file => normalizedKeywords.some(keyword => file.normalizedName.includes(keyword)));
                if (index !== -1) sortedFiles.push(unmatchedFiles.splice(index, 1)[0]);
            }
            this.mergeFiles = [...sortedFiles, ...unmatchedFiles.sort((a, b) => a.name.localeCompare(b.name))];
            this.mergedFilename = `mortgage-documents-${new Date().getFullYear()}.pdf`;
        },
        showMeetMe: false,
        trapTab() {}
    }));
});
