# SAFE SHARE
> **YOUR DOCUMENTS. YOUR DEVICE. YOUR CONTROL.**

Safe Share is a professional, client-side web application designed to help individuals and businesses sanitize sensitive personal data from documents and images prior to sharing.

---

## 🛡️ Executive Summary & Privacy Architecture

The core tenet of **Safe Share** is uncompromising client-side isolation:
1. **Zero Server Uploads**: The application has no backend, database, or analytics tracking. Your files never leave your device.
2. **Local Canvas Processing**: All rasterization, pixel manipulation, Gaussian blur convolution, and mosaic downsampling execute purely within your browser's V8 engine and HTML5 Canvas API.
3. **Permanent Pixel Redaction**: Unlike tools that merely draw an SVG rectangle or visual CSS mask over an image, Safe Share modifies the raw RGBA pixels directly into an offscreen canvas. Once redacted, the underlying pixel data is permanently overwritten and destroyed.
4. **Metadata Re-Rasterization**: Exporting via `canvas.toBlob()` re-encodes the image stream, naturally stripping standard photographic EXIF/IPTC metadata (e.g., GPS coordinates, camera serials, lens settings).

---

## ✨ Features

- **Disruptor / Neo-Brutalist Visual Design**: High-contrast dark aesthetic (#000000, #121212) accented with Volt Green (#CCFF00), solid 4px/8px borders, hard offset shadows, Ranchers display typography, Space Mono technical labels, and a subtle vertical curtain-like background texture.
- **Three Permanent Redaction Modes**:
  - **Blackout**: 100% opaque black blocks. Recommended for maximum privacy on high-stakes PII (Aadhaar, PAN, SSN, bank credentials).
  - **Pixelate**: Downsamples selected regions into mosaic blocks.
  - **Blur**: Multi-pass mathematical blur convolution.
- **Precise Interactive Canvas**:
  - Full coordinate mapping from screen viewport to natural image pixels.
  - 8-point resize handles and move controls.
  - Multi-level Undo (`Ctrl+Z`) and Redo (`Ctrl+Y`).
  - Zoom controls (25% to 300%) with instant **Fit to Screen**.
  - **Hold to Peek Original**: Temporarily review the source image before finalizing.
- **Assisted Detection & Pattern Presets**:
  - Regex detection pattern library for Aadhaar (12-digit UID), PAN (10-char alphanumeric), Phone numbers, Emails, and Dates of Birth.
  - Instant 1-click **Sample Fictional Document** generator with pre-verified coordinate detectors for testing.
- **Export & Verification Modal**:
  - Inspect final baked output copy before downloading.
  - Live dimension and file size audit.
  - EXIF stripping verification.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4 + Neo-Brutalist Custom Utilities
- **Icons**: Lucide React
- **Graphics Engine**: HTML5 Canvas 2D Rendering API

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
git clone <repository-url>
cd safeshare
npm install
```

### Local Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
```
Generates production-ready, minified static assets in the `dist/` directory.

### Code Quality & Linting
```bash
npm run lint
```

---

## 🔒 Security Audit & How to Verify

You can independently verify Safe Share's privacy claims:
1. Open your browser's Developer Tools (`F12` or `Ctrl+Shift+I`).
2. Switch to the **Network** tab and filter by **Fetch/XHR**.
3. Upload any sensitive document, apply redactions, and export the file.
4. Verify that **zero network payloads or outbound requests** are triggered.

---

## ⚠️ Important User Guidance & Limitations

- **Always Review Before Sharing**: Automatic and manual redaction processes are subject to human judgment. You must inspect the final exported copy before sending it to third parties.
- **Blackout vs Blur**: Blur and pixelation distort spatial frequencies; for critical cryptographic privacy, always use **Blackout**.
- **Supported Formats**: JPG, JPEG, and PNG up to 15 MB. PDF files are not supported in this version to preserve pure client-side raster guarantees without heavy external runtimes.

---

## 👥 About the Creators

- **Nawal Kishore S Pai** — Creator / Developer ([nawalkishoresatishpai@gmail.com](mailto:nawalkishoresatishpai@gmail.com))
- **Gokul B** — Creator / Developer ([gokulb7776@gmail.com](mailto:gokulb7776@gmail.com))

---

## 📄 License
MIT License. Safe Share — Your Documents. Your Device. Your Control.
