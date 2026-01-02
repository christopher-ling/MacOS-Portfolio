# macOS Portfolio

View live demo → [Click Here](https://christopher-ling.github.io/MacOS-Portfolio)

A compact macOS-style portfolio built with React + Vite. Shows a windowed UI, Dock with magnification, theme Control Center, and responsive mobile behavior.

--

## Preview

[![Site preview](public/files/preview.gif)](https://christopher-ling.github.io/MacOS-Portfolio/preview.mp4)

_Note:_ Place `public/files/preview.gif` and `public/preview.mp4` locally to make the preview render and link correctly.

## Features

- Windowed UI (draggable windows)
- Dock with GSAP hover magnification
- Control Center for Light / Dark / System themes
- Responsive mobile navbar and dock

## Tech

- React (Vite)
- Tailwind CSS
- Zustand
- GSAP
- lucide-react

## Usage

Install and run locally:

```bash
npm install
npm run dev
```

Open the URL Vite reports (usually `http://localhost:5173`) to preview.

Build for production:

```bash
npm run build
```

## Customize

- Projects: edit `src/constants/index.js`
- Dock apps: update `dockApps` in `src/constants/index.js`
- Theming: `src/store/theme.js`
