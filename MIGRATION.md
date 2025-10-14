# VitePress Migration Guide

This document explains the migration from individual apps to a unified VitePress site.

## What Changed

### Before Migration

```
webdev/
├── apps/
│   ├── http-codes/          # Standalone VitePress app
│   ├── color-palette-extractor/  # Standalone HTML app
│   └── color-palette-generator/  # Not implemented
```

### After Migration

```
webdev/
├── docs/                     # Unified VitePress site
│   ├── .vitepress/
│   │   ├── config.ts        # Main configuration
│   │   └── theme/           # Custom Tailwind-inspired theme
│   ├── http-codes/          # HTTP codes tool
│   ├── color-palette-extractor/  # Color extractor tool
│   └── color-palette-generator/  # Placeholder page
├── scripts/                  # Build scripts
└── apps/                     # Original source code (preserved)
```

## Key Improvements

### 1. Unified Experience

- **Single navigation**: All tools accessible from one main navigation menu
- **Consistent design**: Shared Tailwind-inspired theme across all tools
- **Better discoverability**: Landing page showcases all available tools

### 2. Modern Theme

- **HSL-based color system**: Easy to customize like shadcn/ui
- **Light/dark mode**: Automatic theme switching
- **Responsive design**: Works perfectly on all devices
- **Smooth animations**: Enhanced user experience with transitions

### 3. Improved Development

- **Single dev server**: Run all tools with one command
- **Shared dependencies**: No duplicate packages
- **Type safety**: Full TypeScript support
- **Better performance**: Static site generation with Vite

## Migration Details

### HTTP Codes App

**Before:**
- Location: `apps/http-codes/docs/`
- Independent VitePress instance
- Custom theme with orange accents

**After:**
- Location: `docs/http-codes/`
- Integrated into main VitePress site
- Updated theme matching site-wide design
- Preserved all functionality:
  - Real-time search
  - Individual code pages
  - Share functionality
  - Sidebar navigation

**Changes:**
- Updated color scheme to use CSS custom properties
- Moved `http-codes.json` to `docs/public/`
- Updated generation script to output to new location
- Updated all internal links to use `/http-codes/` prefix

### Color Palette Extractor

**Before:**
- Location: `apps/color-palette-extractor/`
- Standalone HTML/CSS/JS app
- Independent styling

**After:**
- Location: `docs/color-palette-extractor/`
- Embedded in VitePress page using Vue `<script setup>`
- Updated theme matching site-wide design
- Preserved all functionality:
  - Image upload (drag & drop)
  - Color extraction with Vibrant.js
  - Adjustable settings
  - Export to JSON
  - Copy to clipboard

**Changes:**
- Converted to VitePress page with embedded JavaScript
- Updated CSS to use theme variables
- Moved `vibrant.min.js` to `docs/public/`
- Enhanced animations and transitions
- Improved dark mode support

### Color Palette Generator

**Status:** Placeholder page created
**Location:** `docs/color-palette-generator/`

A Coming Soon page has been created with:
- Planned features list
- Links to other tools
- Contributing information

## Running the Migrated Site

### Development

```bash
# Start development server
npm run docs:dev
# or
pnpm docs:dev

# Visit http://localhost:5173
```

### Build

```bash
# Build for production
npm run docs:build
# or
pnpm docs:build

# Output: docs/.vitepress/dist/
```

### Preview Build

```bash
# Preview production build
npm run docs:preview
# or
pnpm docs:preview
```

## Theme Customization

### Changing Colors

Edit `docs/.vitepress/theme/styles/vars.css`:

```css
:root {
  /* Primary brand color */
  --primary: 217 91% 60%;  /* Blue - change these HSL values */
  
  /* Other colors */
  --secondary: 210 40% 96.1%;
  --muted: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --border: 214.3 31.8% 91.4%;
  /* ... */
}

.dark {
  /* Dark mode colors */
  --primary: 217 91% 65%;
  /* ... */
}
```

### Adding Custom Utilities

Add new utility classes to `docs/.vitepress/theme/styles/tailwind.css`:

```css
.my-custom-class {
  /* Your styles */
}
```

### Customizing Components

Override default theme components in `docs/.vitepress/theme/index.ts`:

```typescript
import DefaultTheme from 'vitepress/theme'

export default {
  extends: DefaultTheme,
  // Your customizations
}
```

## Deployment

The site can be deployed to any static hosting provider:

### Cloudflare Pages
- Build command: `npm run docs:build`
- Output directory: `docs/.vitepress/dist`

### Vercel
- Framework: VitePress
- Build command: `npm run docs:build`
- Output directory: `docs/.vitepress/dist`

### Netlify
- Build command: `npm run docs:build`
- Publish directory: `docs/.vitepress/dist`

## Preserved Functionality

All existing features have been preserved:

✅ HTTP Codes search and navigation  
✅ Individual HTTP code pages  
✅ Share links functionality  
✅ Image upload for color extraction  
✅ Color palette extraction with Vibrant.js  
✅ Export to JSON  
✅ Copy to clipboard  
✅ Adjustable extraction settings  
✅ Responsive design  
✅ SEO optimization  

## What's New

🎉 Unified navigation across all tools  
🎉 Modern Tailwind-inspired theme  
🎉 Consistent design language  
🎉 Enhanced animations and transitions  
🎉 Better dark mode support  
🎉 Improved accessibility  
🎉 Faster page loads with static generation  
🎉 Better developer experience  

## Troubleshooting

### Issue: Dependencies not found

**Solution:**
```bash
npm install
# or
pnpm install
```

### Issue: HTTP codes pages not generated

**Solution:**
```bash
npm run generate:http-codes
```

### Issue: Vibrant.js not loading

**Solution:**
Ensure `vibrant.min.js` is in `docs/public/` directory.

### Issue: Theme styles not applying

**Solution:**
1. Check that all CSS files are imported in `docs/.vitepress/theme/index.ts`
2. Clear VitePress cache: `rm -rf docs/.vitepress/cache`
3. Restart dev server

## Need Help?

- Check the [README.md](README.md) for setup instructions
- Visit [VitePress documentation](https://vitepress.dev/)
- Open an issue on GitHub

---

**Migration completed**: All apps successfully migrated to unified VitePress site with enhanced theme and preserved functionality.

