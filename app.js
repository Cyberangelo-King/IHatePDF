// PDF.js library and worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

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
            if (!localStorage.getItem('ihatepdf_onboarding_completed')) {
                this.showOnboarding = true;
            }
            this.$nextTick(() => {
                document.querySelectorAll('.btn-primary').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const rect = button.getBoundingClientRect();
                        const size = Math.max(rect.width, rect.height);
                        const x = e.clientX - rect.left - size / 2;
                        const y = e.clientY - rect.top - size / 2;
                        const ripple = document.createElement('span');
                        ripple.classList.add('ripple');
                        ripple.style.width = ripple.style.height = `${size}px`;
                        ripple.style.left = `${x}px`;
                        ripple.style.top = `${y}px`;
                        button.appendChild(ripple);
                        ripple.addEventListener('animationend', () => {
                            ripple.remove();
                        });
                    });
                });
            });
        },
        nextOnboardingStep() {
            if (this.currentOnboardingStep < this.onboardingSteps.length - 1) {
                this.currentOnboardingStep++;
            } else {
                this.skipOnboarding();
            }
        },
        skipOnboarding() {
            this.showOnboarding = false;
            localStorage.setItem('ihatepdf_onboarding_completed', 'true');
        },
        showToast(message, type = 'info', duration = 3000) {
            const id = this.toastIdCounter++;
            this.toasts.push({ id, message, type });
            setTimeout(() => {
                this.toasts = this.toasts.filter(toast => toast.id !== id);
            }, duration);
            if (navigator.vibrate) {
                if (type === 'success') navigator.vibrate(100);
                else if (type === 'error') navigator.vibrate([200, 100, 200]);
            }
        },
        async handleFileSelect(event, type) {
            this.isDragOver = false;
            this.showInvalidFileWarning = false;
            const files = Array.from(event.target.files);
            await this.processFiles(files, type);
        },
        async handleDrop(event, type) {
            this.isDragOver = false;
            this.showInvalidFileWarning = false;
            const files = Array.from(event.dataTransfer.files);
            await this.processFiles(files, type);
        },
        async processFiles(files, type) {
            const pdfFiles = files.filter(file => file.type === 'application/pdf');
            const invalidFiles = files.filter(file => file.type !== 'application/pdf');
            if (invalidFiles.length > 0) {
                this.showInvalidFileWarning = true;
                this.showToast('Only PDF files are allowed. Invalid files were ignored.', 'error');
            }
            if (type === 'merge') {
                for (const file of pdfFiles) {
                    const id = crypto.randomUUID();
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        let pdfDoc = null;
                        try {
                            pdfDoc = await pdfjsLib.getDocument({ data: e.target.result }).promise;
                            const pageCount = pdfDoc.numPages;
                            this.mergeFiles.push({ id, name: file.name, file, pageCount, thumbnail: null });
                            this.mergeFiles = [...this.mergeFiles];
                            this.$nextTick(() => {
                                this.renderPdfThumbnail(file, id);
                            });
                        } catch (error) {
                            console.error("Error loading PDF for thumbnail:", error);
                            this.showToast(`Could not load PDF: ${file.name}. It might be corrupted or password-protected.`, 'error');
                        } finally {
                            if (pdfDoc) {
                                pdfDoc.destroy();
                            }
                        }
                    };
                    reader.readAsArrayBuffer(file);
                }
            } else if (type === 'extract') {
                if (pdfFiles.length === 0) return;
                if (pdfFiles.length > 1) {
                    this.showToast('Please select only one PDF for image extraction.', 'error');
                    return;
                }
                this.extractFile = { id: crypto.randomUUID(), name: pdfFiles[0].name, file: pdfFiles[0] };
                this.extractedImages = [];
                this.selectedImages = [];
                await this.extractImages();
            }
        },
        async renderPdfThumbnail(file, id) {
            const canvas = document.getElementById(`pdf-thumbnail-${id}`);
            if (!canvas) return;
            const fileReader = new FileReader();
            fileReader.onload = async (e) => {
                let pdf = null;
                try {
                    pdf = await pdfjsLib.getDocument({ data: e.target.result }).promise;
                    const page = await pdf.getPage(1);
                    const viewport = page.getViewport({ scale: 0.5 });
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    await page.render({ canvasContext: context, viewport: viewport }).promise;
                } catch (error) {
                    console.error("Error rendering thumbnail:", error);
                    const context = canvas.getContext('2d');
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.font = "12px Inter";
                    context.fillStyle = "#ef4444";
                    context.textAlign = "center";
                    context.fillText("Error rendering", canvas.width / 2, canvas.height / 2 - 10);
                    context.fillText("thumbnail", canvas.width / 2, canvas.height / 2 + 10);
                } finally {
                    if (pdf) {
                        pdf.destroy();
                    }
                }
            };
            fileReader.readAsArrayBuffer(file);
        },
        removeFile(id, type) {
            if (type === 'merge') {
                this.mergeFiles = this.mergeFiles.filter(file => file.id !== id);
                this.showToast('PDF removed.', 'info');
            }
        },
        clearExtractFile() {
            this.extractFile = null;
            this.extractedImages = [];
            this.selectedImages = [];
            this.showToast('Extracted PDF cleared.', 'info');
        },
        handleDragStart(event, index) {
            this.draggingIndex = index;
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', index);
            event.target.classList.add('dragging');
        },
        handleDragOver(event, index) {
            event.preventDefault();
            if (this.draggingIndex !== null && this.draggingIndex !== index) {
                this.dragOverIndex = index;
            }
        },
        handleDragLeave(event, index) {
            if (this.dragOverIndex === index) {
                this.dragOverIndex = null;
            }
        },
        handleDropReorder(event, targetIndex) {
            event.preventDefault();
            const draggedIndex = parseInt(event.dataTransfer.getData('text/plain'));
            if (draggedIndex !== targetIndex) {
                const [draggedItem] = this.mergeFiles.splice(draggedIndex, 1);
                this.mergeFiles.splice(targetIndex, 0, draggedItem);
                this.mergeFiles = [...this.mergeFiles];
                this.showToast('PDF order updated.', 'info');
            }
            this.dragOverIndex = null;
        },
        handleDragEnd(event) {
            this.draggingIndex = null;
            this.dragOverIndex = null;
            if (event && event.target) {
                event.target.classList.remove('dragging');
            }
        },
        async mergePdfs() {
            if (this.mergeFiles.length === 0) {
                this.showToast('Please upload PDFs to merge first.', 'error');
                return;
            }
            this.isProcessing = true;
            this.processingProgress = 0;
            this.showToast('Merging PDFs...', 'info', 5000);
            try {
                const { PDFDocument } = PDFLib;
                const mergedPdf = await PDFDocument.create();
                let completedFiles = 0;
                for (const mergeFile of this.mergeFiles) {
                    const arrayBuffer = await mergeFile.file.arrayBuffer();
                    const pdf = await PDFDocument.load(arrayBuffer);
                    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                    copiedPages.forEach((page) => mergedPdf.addPage(page));
                    completedFiles++;
                    this.processingProgress = (completedFiles / this.mergeFiles.length) * 100 * 0.9;
                }
                this.processingProgress = 95;
                const mergedPdfBytes = await mergedPdf.save();
                this.processingProgress = 100;
                const filename = this.mergedFilename.endsWith('.pdf') ? this.mergedFilename : this.mergedFilename + '.pdf';
                saveAs(new Blob([mergedPdfBytes], { type: 'application/pdf' }), filename);
                this.showToast('PDFs merged successfully! Download started.', 'success');
                this.triggerConfetti();
                this.resetMergeState();
            } catch (error) {
                console.error("Error merging PDFs:", error);
                let errorMessage = 'An unexpected error occurred during merging.';
                if (error.message.includes('password-protected')) {
                    errorMessage = 'One or more PDFs are password-protected and cannot be merged.';
                } else if (error.message.includes('corrupted')) {
                    errorMessage = 'One or more PDFs are corrupted or invalid.';
                }
                this.showToast(`Failed to merge PDFs: ${errorMessage}`, 'error');
            } finally {
                this.isProcessing = false;
                this.processingProgress = 0;
            }
        },
        resetMergeState() {
            this.mergeFiles = [];
            this.mergedFilename = 'merged-documents-' + new Date().getFullYear() + '.pdf';
        },
        async extractImages() {
            if (!this.extractFile) {
                this.extractedImages = [];
                this.selectedImages = [];
                return;
            }
            this.isProcessing = true;
            this.processingProgress = 0;
            this.extractedImages = [];
            this.selectedImages = [];
            this.showToast('Extracting images...', 'info', 5000);
            try {
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(this.extractFile.file);
                fileReader.onload = async (e) => {
                    let pdf = null;
                    try {
                        pdf = await pdfjsLib.getDocument({ data: e.target.result }).promise;
                        const numPages = pdf.numPages;
                        const scale = parseFloat(this.imageQuality);
                        let completedPages = 0;
                        for (let i = 1; i <= numPages; i++) {
                            const page = await pdf.getPage(i);
                            const viewport = page.getViewport({ scale: scale });
                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d');
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;
                            await page.render({ canvasContext: context, viewport: viewport }).promise;
                            const imageUrl = canvas.toDataURL('image/png');
                            const filename = `${this.extractFile.name.replace('.pdf', '')}_page_${i}.png`;
                            this.extractedImages.push({ id: crypto.randomUUID(), url: imageUrl, filename: filename });
                            completedPages++;
                            this.processingProgress = (completedPages / numPages) * 100;
                        }
                        this.showToast('Images extracted successfully!', 'success');
                    } catch (error) {
                        console.error("Error extracting images:", error);
                        let errorMessage = 'An unexpected error occurred during image extraction.';
                        if (error.message.includes('password-protected')) {
                            errorMessage = 'This PDF is password-protected and images cannot be extracted.';
                        } else if (error.message.includes('corrupted')) {
                            errorMessage = 'This PDF is corrupted or invalid.';
                        }
                        this.showToast(`Failed to extract images: ${errorMessage}`, 'error');
                    } finally {
                        if (pdf) {
                            pdf.destroy();
                        }
                    }
                };
            } catch (error) {
                console.error("Error reading PDF file for extraction:", error);
                this.showToast('Failed to read PDF file for extraction.', 'error');
                this.isProcessing = false;
                this.processingProgress = 0;
            }
        },
        toggleImageSelection(imageId, event) {
            if (event.shiftKey && this.selectedImages.length > 0) {
                const lastSelectedId = this.selectedImages[this.selectedImages.length - 1];
                const lastSelectedIndex = this.extractedImages.findIndex(img => img.id === lastSelectedId);
                const currentIndex = this.extractedImages.findIndex(img => img.id === imageId);
                if (lastSelectedIndex !== -1 && currentIndex !== -1) {
                    const start = Math.min(lastSelectedIndex, currentIndex);
                    const end = Math.max(lastSelectedIndex, currentIndex);
                    for (let i = start; i <= end; i++) {
                        const imgIdToAdd = this.extractedImages[i].id;
                        if (!this.selectedImages.includes(imgIdToAdd)) {
                            this.selectedImages.push(imgIdToAdd);
                        }
                    }
                }
            } else {
                if (this.selectedImages.includes(imageId)) {
                    this.selectedImages = this.selectedImages.filter(id => id !== imageId);
                } else {
                    this.selectedImages.push(imageId);
                }
            }
        },
        selectAllImages() {
            this.selectedImages = this.extractedImages.map(img => img.id);
            this.showToast('All images selected.', 'info');
        },
        clearSelection() {
            this.selectedImages = [];
            this.showToast('Image selection cleared.', 'info');
        },
        downloadImage(url, filename) {
            saveAs(url, filename);
            this.showToast(`Downloading ${filename}...`, 'success');
        },
        async downloadSelectedImages() {
            if (this.selectedImages.length === 0) {
                this.showToast('Please select images to download first.', 'error');
                return;
            }
            this.isProcessing = true;
            this.showToast('Preparing ZIP for download...', 'info', 5000);
            try {
                const zip = new JSZip();
                let completedImages = 0;
                for (const imageId of this.selectedImages) {
                    const image = this.extractedImages.find(img => img.id === imageId);
                    if (image) {
                        const response = await fetch(image.url);
                        const blob = await response.blob();
                        zip.file(image.filename, blob);
                        completedImages++;
                        this.processingProgress = (completedImages / this.selectedImages.length) * 100;
                    }
                }
                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, `${this.extractFile.name.replace('.pdf', '')}_images.zip`);
                this.showToast('Selected images zipped and downloaded!', 'success');
                this.selectedImages = [];
            } catch (error) {
                console.error("Error zipping images:", error);
                this.showToast('Failed to create ZIP file for download.', 'error');
            } finally {
                this.isProcessing = false;
                this.processingProgress = 0;
            }
        },
        sortForMortgage() {
            if (this.mergeFiles.length === 0) {
                this.showToast('Please upload PDFs to sort first.', 'error');
                return;
            }
            this.isProcessing = true;
            this.$refs.sortMortgageButton.classList.add('bg-indigo-700', 'scale-95');
            this.showToast('Sorting documents for mortgage order...', 'info', 3000);
            const sortedFiles = [];
            const unmatchedFiles = [...this.mergeFiles];
            const foundDocuments = [];
            const notFoundDocuments = [];
            const normalizeName = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
            for (const mortgageDoc of this.mortgageDocumentOrder) {
                let foundMatch = false;
                for (let i = 0; i < unmatchedFiles.length; i++) {
                    const uploadedFileName = normalizeName(unmatchedFiles[i].name);
                    const keywordsNormalized = mortgageDoc.keywords.map(normalizeName);
                    if (keywordsNormalized.some(keyword => uploadedFileName.includes(keyword))) {
                        sortedFiles.push(unmatchedFiles[i]);
                        foundDocuments.push(mortgageDoc.name);
                        unmatchedFiles.splice(i, 1);
                        foundMatch = true;
                        break;
                    }
                }
                if (!foundMatch) {
                    notFoundDocuments.push(mortgageDoc.name);
                }
            }
            unmatchedFiles.sort((a, b) => a.name.localeCompare(b.name));
            sortedFiles.push(...unmatchedFiles);
            this.mergeFiles = sortedFiles;
            this.isProcessing = false;
            this.$refs.sortMortgageButton.classList.remove('bg-indigo-700', 'scale-95');
            let toastMessage = '';
            if (notFoundDocuments.length === 0 && foundDocuments.length > 0) {
                toastMessage = 'All expected mortgage documents found and sorted successfully!';
                this.showToast(toastMessage, 'success');
            } else if (foundDocuments.length > 0) {
                toastMessage = `Documents sorted. Some missing: ${notFoundDocuments.join(', ')}. Please check names or reorder manually.`;
                this.showToast(toastMessage, 'warning', 7000);
            } else {
                toastMessage = 'No mortgage documents were recognized. Please ensure correct naming or reorder manually.';
                this.showToast(toastMessage, 'error', 7000);
            }
            this.mergedFilename = `mortgage-documents-${new Date().getFullYear()}.pdf`;
        },
        triggerConfetti() {
            const confettiContainer = document.createElement('div');
            confettiContainer.classList.add('confetti-container');
            document.body.appendChild(confettiContainer);
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.classList.add('confetti');
                confetti.style.left = `${Math.random() * 100}vw`;
                confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
                confetti.style.animationDelay = `${Math.random() * 0.5}s`;
                confetti.style.animationDuration = `${1.5 + Math.random() * 1}s`;
                confettiContainer.appendChild(confetti);
            }
            setTimeout(() => {
                confettiContainer.remove();
            }, 3000);
        }
    }));
});

// For production, use a minified version of this file to improve performance.
