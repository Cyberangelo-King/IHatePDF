const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const pdfCompressor = require('pdf-compressor');
const fs = require('fs');
const path = require('path');
const libre = require('libreoffice-convert');
const { fromPath } = require('pdf-poppler');
const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/unlock', upload.single('file'), async (req, res) => {
    try {
        const pdfDoc = await PDFDocument.load(req.file.buffer, {
            password: req.body.password,
        });
        const pdfBytes = await pdfDoc.save();
        res.send(pdfBytes);
    } catch (error) {
        console.error("Error unlocking PDF:", error);
        res.status(500).send('Failed to unlock PDF');
    }
});

app.post('/compress', upload.single('file'), async (req, res) => {
    const tempFilePath = path.join(__dirname, 'temp.pdf');
    fs.writeFileSync(tempFilePath, req.file.buffer);

    try {
        await pdfCompressor.compress(tempFilePath, {
            // options
        });
        const compressedPdf = fs.readFileSync(tempFilePath);
        fs.unlinkSync(tempFilePath);
        res.send(compressedPdf);
    } catch (error) {
        console.error("Error compressing PDF:", error);
        res.status(500).send('Failed to compress PDF');
    }
});

app.post('/convert', upload.single('file'), async (req, res) => {
    const { conversionType } = req.body;
    const tempFilePath = path.join(__dirname, req.file.originalname);
    fs.writeFileSync(tempFilePath, req.file.buffer);

    try {
        if (conversionType === 'pdf-to-word') {
            const outputPath = `${tempFilePath}.docx`;
            const docxBuf = await libre.convert(req.file.buffer, '.docx', undefined);
            res.send(docxBuf);
        } else if (conversionType === 'word-to-pdf') {
            const outputPath = `${tempFilePath}.pdf`;
            const pdfBuf = await libre.convert(req.file.buffer, '.pdf', undefined);
            res.send(pdfBuf);
        } else if (conversionType === 'pdf-to-jpg') {
            const opts = {
                format: 'jpeg',
                out_dir: path.dirname(tempFilePath),
                out_prefix: path.basename(tempFilePath, path.extname(tempFilePath)),
                page: null
            }
            await fromPath(tempFilePath, opts);
            const jpgPath = `${path.dirname(tempFilePath)}/${path.basename(tempFilePath, path.extname(tempFilePath))}-1.jpg`;
            const jpgFile = fs.readFileSync(jpgPath);
            res.send(jpgFile);
        } else if (conversionType === 'jpg-to-pdf') {
            const pdfDoc = await PDFDocument.create();
            const jpgImage = await pdfDoc.embedJpg(req.file.buffer);
            const page = pdfDoc.addPage();
            page.drawImage(jpgImage);
            const pdfBytes = await pdfDoc.save();
            res.send(Buffer.from(pdfBytes));
        } else {
            res.status(400).send('Invalid conversion type');
        }
    } catch (error) {
        console.error('Error during conversion: ', error);
        res.status(500).send('Failed to convert file');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
