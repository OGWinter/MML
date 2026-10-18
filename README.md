# MML — Radiant Vinyl & Digital Music Platform 🎵

An ultra-modern, full-stack music streaming and vinyl deck experience inspired by vintage analog turntables and sleek modern music interfaces.

## ✨ Key Features

- **Analog Vinyl Turntable**:
  - Realistic vinyl grooves and spinning animations with 33 / 45 RPM speed control.
  - Interactive pivoting tonearm with stylus drop and lift mechanics.
  - Seamless Side A / Side B flipping with dedicated track selections.
- **Midnight & Spotlight Experience**:
  - Curated hero banner with live audio waveform spectrum.
  - Interactive "Made For You" and "Popular Tracks" tables with instant play buttons.
  - Tag filtering for genres (Classic Rock, Hard Rock, Indie Pop, Synthwave, Electronic).
- **Global Music Discovery**:
  - Live Apple Music & Spotify API integration for worldwide track lookup and preview streaming.
- **Admin Music Studio**:
  - Multer audio (`.mp3`, `.wav`, `.m4a`) and album artwork file uploads.
  - 1-Click external catalog import into Side A or Side B.
  - Full catalog management and library analytics.
- **Audio Engine**:
  - Web Audio API real-time frequency spectrum analyzer.
  - High-performance local audio streaming with byte-range support.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, JWT, Multer
- **Database**: Dual-engine supporting MongoDB with local resilient persistent JSON fallback
- **APIs**: Apple Music / iTunes Search API, Spotify Discovery Proxy

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd server
npm install
node server.js
```
The server will start at `http://localhost:5050`.

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.

### 👑 Admin Credentials
- **Email**: `admin@radiant.music`
- **Password**: `admin123`
*(Or use the 1-Click Demo Admin Login button inside the app)*
