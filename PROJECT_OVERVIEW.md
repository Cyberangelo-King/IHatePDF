# IHatePDF Project Overview

## 1. Introduction

IHatePDF is a powerful, privacy-focused PDF manipulation toolkit designed to provide a comprehensive suite of features for handling PDF documents. The application operates with a hybrid client-server architecture, where most functionalities are executed directly in the browser to ensure user data remains private. For computationally intensive tasks, the application leverages a stateless backend that processes files in-memory without storing any data, enhancing both performance and security.

This document provides a detailed overview of the project's features, technical architecture, and setup instructions.

## 2. Features

The application offers a wide range of PDF manipulation tools, accessible through a modern sidebar interface.

### Client-Side Features

These features are executed entirely within the user's browser, ensuring that files never leave their computer.

*   **Merge:** Combine multiple PDF documents into a single file. Users can upload, reorder, and merge PDFs with ease.
*   **Split:** Extract a specific range of pages from a PDF document.
*   **Protect:** Add a password to a PDF file to encrypt it and restrict access.
*   **Sign:** Add a digital signature to a PDF. Users can draw a signature using a canvas, type it out, or upload an image of their signature.
*   **Extract Images:** Pull all images from a PDF file and allow the user to download them as a ZIP archive.

### Server-Side Features

These features rely on a stateless Node.js backend to perform complex operations that are not feasible to run in the browser.

*   **Unlock:** Remove password protection from an encrypted PDF file.
*   **Compress:** Reduce the file size of a PDF document by optimizing images and other content.
*   **Convert:** Transform files to and from PDF format. The supported conversions include:
    *   PDF to Word
    *   Word to PDF
    *   PDF to JPG
    *   JPG to PDF

## 3. Technical Architecture

### Frontend

The frontend is a single-page application built with modern web technologies:

*   **Alpine.js:** A lightweight JavaScript framework for adding declarative, reactive behavior to the HTML.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **pdf-lib & pdf.js:** JavaScript libraries for parsing, creating, and modifying PDF documents in the browser.
*   **Signature Pad:** A library for creating a smooth signature drawing canvas.

### Backend

The backend is a stateless Node.js server built with the Express framework. Its primary responsibility is to handle file processing tasks that require server-side resources.

*   **Stateless by Design:** The backend does not use a database and does not store any user files on the server. All processing is done in-memory, and the resulting file is immediately sent back to the client for download. This design choice is critical for ensuring the privacy and security of user data.
*   **External Dependencies:** The backend relies on several external command-line tools to perform its functions:
    *   **Ghostscript:** Used for PDF compression.
    *   **LibreOffice:** Used for converting documents to and from PDF format.
    *   **Poppler:** A PDF rendering library that may be used for certain conversion tasks.

## 4. Setup and Installation

To run the application locally, you will need to set up both the frontend and backend environments.

### Frontend Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    This will start a Vite development server, and you can access the application at `http://localhost:5173`.

### Backend Setup

1.  **Install Node.js Dependencies:**
    ```bash
    cd server
    npm install
    ```
2.  **Install System Dependencies:**
    You must install the following command-line tools on the server for the backend to function correctly.

    *   **Ghostscript:**
        *   On Debian/Ubuntu: `sudo apt-get install ghostscript`
        *   On macOS (using Homebrew): `brew install ghostscript`
    *   **LibreOffice:**
        *   On Debian/Ubuntu: `sudo apt-get install libreoffice`
        *   On macOS (using Homebrew): `brew install --cask libreoffice`

3.  **Run the Backend Server:**
    ```bash
    node server.js
    ```
    The backend server will run on `http://localhost:3000`.

## 5. Testing

The project includes a suite of end-to-end tests to ensure the application's functionality.

*   **Run End-to-End Tests:**
    ```bash
    npm run test:e2e
    ```
    This command will execute the Playwright test suite, which simulates user interactions and verifies that the UI and core features are working as expected.
