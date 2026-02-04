# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Valentine's Day love letter web app built with React, TypeScript, and Vite. Users compose personalized love letters, seal them in an animated envelope, and present them with an interactive "Will you be my Valentine?" question. Letters can be shared via URL or downloaded.

## Commands

```bash
pnpm dev      # Start dev server (Vite)
pnpm build    # Build for production
pnpm preview  # Preview production build
```

Uses pnpm as the package manager.

## Architecture

### Application Flow (src/App.tsx)

The app is a single-page experience with 5 steps controlled by `step` state:
- **Step 0**: ComposeLetter - User writes and customizes their letter
- **Step 1**: Envelope - Animated envelope that opens on click
- **Step 2**: Letter - Typewriter-style letter reveal
- **Step 3**: Question - "Will you be my Valentine?" with playful Yes/No buttons
- **Step 4**: Celebration - Confetti and sharing options

### Letter Data Structure

```typescript
interface LetterData {
  recipient: string;
  opening: string;
  body: string;
  signature: string;
  postscript: string;
  sticker: string;  // emoji
  tone: number;     // 0-100 "cheesiness" level
}
```

Letters persist to localStorage and can be shared via base64-encoded URL parameter (`?letter=...`).

### Key Components (src/components/)

- **ComposeLetter** - Form with live preview, exports `LetterData` type and `defaultLetter`
- **Envelope** - CSS triangles + framer-motion for open animation
- **Letter** - Typewriter text effect using character-by-character reveal
- **BlurText** - Animated text reveal with blur/opacity transitions, uses IntersectionObserver
- **Squares** - Canvas-based animated grid background with hover effects
- **ShareActions** - Copy, Web Share API, download functionality

### Styling

- Tailwind CSS with custom theme (`tailwind.config.js`):
  - Custom colors: `ink` (#402133), `soft-ink` (#59404a)
  - Custom font: `font-handwriting` (Dancing Script)
- Component classes in `src/index.css`: `.love-card`, `.love-panel`, `.love-input`, `.love-chip`
- Uses CSS variables for theming (--rose-*, --ink, --card-*)

### Animation

Framer Motion for:
- Page transitions (`AnimatePresence`)
- Button interactions (scale, position)
- Heart cursor trails
- Confetti via canvas-confetti library
