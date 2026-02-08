# 💌 Valentine's Day Love Letter Web App

A delightful interactive web app for composing, sealing, and sharing personalized Valentine's Day love letters. Users craft heartfelt messages, reveal them in an animated envelope, and ask "Will you be my Valentine?" with a playful experience.

## ✨ Features

- **Letter Composer**: Write multi-part letters with customizable tone (from playful to hopeless romantic)
- **Animated Envelope**: Beautiful CSS-based envelope that opens with a click
- **Typewriter Effect**: Letters reveal with a smooth character-by-character animation
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Share & Download**: Copy, Web Share API, or download letters as text files
- **Persistent Storage**: Letters auto-save to localStorage as you compose
- **URL Sharing**: Send letters via base64-encoded URL parameters
- **Response Tracking**: Senders can track when recipients open and respond to letters
- **Celebration Mode**: Confetti animation when recipient says "Yes!"

## 🛠️ Tech Stack

- **React 18** - UI framework with TypeScript
- **Vite 7** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Supabase** - Backend for letter storage & tracking
- **Canvas Confetti** - Celebration animations
- **Zustand** - State management (included)
- **i18next** - Internationalization support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd valentine

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will run at `http://localhost:5173` with hot module reloading.

### Build for Production

```bash
# Build optimized bundle
pnpm build

# Preview production build locally
pnpm preview
```

## 📁 Project Structure

```
src/
├── assets/              # Images and static files
├── components/          # Reusable React components
│   ├── BlurText.tsx         # Animated text reveal with blur
│   ├── ComposeLetter.tsx    # Main letter composer form
│   ├── Envelope.tsx         # Animated envelope component
│   ├── Letter.tsx           # Letter display with typewriter
│   ├── PageShell.tsx        # Layout wrapper
│   ├── ShareActions.tsx     # Share/download buttons
│   ├── Squares.tsx          # Animated background grid
│   └── StatusPage.tsx       # Status display for tracking
├── pages/               # Page-level components
│   ├── ComposePage.tsx      # Main letter creation flow
│   ├── ViewerPage.tsx       # Letter viewing experience
│   └── StatusPageRoute.tsx  # Sender status tracking
├── lib/                 # Utilities and helpers
│   ├── api.ts              # Supabase API calls
│   ├── confetti.ts         # Confetti animations
│   ├── letter.ts           # Letter formatting logic
│   ├── supabase.ts         # Supabase client setup
│   └── url.ts              # URL encoding/decoding
├── index.css            # Global styles & CSS variables
├── main.tsx             # React app entry point
└── App.tsx              # Router configuration
```

## 📝 Letter Data Structure

Letters contain the following fields:

```typescript
interface LetterData {
  recipient: string;      // "My dearest" or recipient name
  opening: string;        // Opening line/paragraph
  body: string;           // Main message (max 600 chars)
  signature: string;      // How to sign off
  postscript: string;     // P.S. message
  sticker: string;        // Emoji decoration
  tone: number;           // 0-100 "cheesiness" scale
}
```

Tone levels:
- **0-25**: Playful
- **25-50**: Sweet
- **50-75**: Melted
- **75-100**: Hopeless romantic

## 🎨 Styling & Theming

### Custom Colors
- `--ink`: #402133 (deep purple)
- `--soft-ink`: #59404a (muted purple)
- `--burgundy`: Rose/burgundy tones
- `--deep-rose`: Deep rose accent

### Custom Classes
- `.love-card` - Primary card container with gradient
- `.love-panel` - Secondary panel styling
- `.love-input` - Form input styling
- `.love-chip` - Tag/chip styling

### Font
- `font-handwriting` - Dancing Script (letter writing font)

## 🔄 Application Flow

### ComposePage (Main Flow)
```
Step 0: ComposeLetter     → User drafts letter
  ↓ (handleSeal)
Step 1: Envelope          → Animated envelope opens
  ↓ (onOpen)
Step 2: Letter            → Typewriter reveals letter
  ↓ (onNext)
Step 3: ShareActions      → Copy, share, download
```

### Routes
- `/` - Main letter composer
- `/v/:id` - View shared letter (recipient experience)
- `/check/:token` - Sender status tracking page
- `*` - Catch-all redirects to home

## 💾 Storage & Persistence

### LocalStorage
- `valentine-letter` - Current draft letter (auto-saved)

### Supabase Database
Stores letter metadata:
- `id` - Unique letter ID
- `sender_token` - Private token for status tracking
- `recipient`, `opening`, `body`, `signature`, `postscript` - Letter content
- `sticker`, `tone` - Visual customizations
- `response` - "yes", "no", or null
- `responded_at` - Timestamp of response
- `opened_at` - Timestamp when viewed
- `created_at` - Letter creation time

## 🔗 URL Sharing

Letters are shared via base64-encoded URLs:
- **Viewer URL**: `/v/:letterId` - Recipient opens the letter
- **Status URL**: `/check/:senderToken` - Sender checks responses
- **Direct Share**: Encoded letter data in URL parameter for local viewing

## 🎬 Animation Details

### Framer Motion
- Page transitions with `AnimatePresence`
- Button interactions (scale, position)
- Sticker rotation animation
- Envelope open/close sequence

### Canvas Effects
- Confetti celebration
- Animated background grid (Squares component)
- Heart cursor trails

## 🌐 Internationalization

The app includes i18next setup for multi-language support. Configured with:
- Browser language detection
- Fallback to English

## 🛞 Configuration Files

- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind theme & plugins
- `tsconfig.app.json` - TypeScript settings
- `tailwind.config.js` - Tailwind CSS customization

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `framer-motion` | ^11.18.2 | Animations |
| `react-router-dom` | ^6.30.1 | Routing |
| `@supabase/supabase-js` | ^2.95.3 | Backend API |
| `canvas-confetti` | ^1.9.4 | Celebration |
| `react-i18next` | ^14.1.0 | Translations |
| `tailwindcss` | ^3.4.17 | Styling |

## 🔐 Environment Variables

To set up backend tracking, configure Supabase:

```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-key>
```

If not configured, the app works in "offline mode" without letter persistence.

## 🚢 Deployment

### Vite Static Build
```bash
pnpm build
# Outputs to dist/ directory
```

Deploy to any static host:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any CDN

### Environment Setup
Set Supabase credentials in your hosting platform's environment variables.

## 💡 Development Tips

### Hot Module Reloading (HMR)
Changes auto-refresh during `pnpm dev`

### Component Preview
Components use Framer Motion's `AnimatePresence` for smooth transitions during development

### LocalStorage Debugging
Check browser DevTools → Application → Local Storage to inspect draft letters

### Console Logging
API errors are logged to browser console for debugging


Mobile responsive breakpoints:
- Small (sm): 640px
- Medium (md): 768px
- Large (lg): 1024px

## 🎯 Future Enhancements

- Email delivery of letters
- Letter templates
- Recipient reply system
- Analytics dashboard
- Multi-language UI
- Print-friendly letters
- Background music options
- Custom sticker packs

## 📄 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines]

## 💬 Support

For issues or questions, please open an issue on the repository.

---

Made with 💕 for Valentine's Day
