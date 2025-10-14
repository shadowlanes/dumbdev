# Web Developer Micro Apps

This directory contains the original source code for independent micro apps designed to help web developers with various tasks.

## ⚠️ Migration Notice

**These apps have been migrated to a unified VitePress site located in the `/docs` directory.**

The apps in this directory are preserved as reference/source code. The live, integrated versions are now part of the main VitePress documentation site.

### Where to Find the Migrated Apps

- **HTTP Codes Explainer**: `/docs/http-codes/`
- **Color Palette Extractor**: `/docs/color-palette-extractor/`
- **Color Palette Generator**: `/docs/color-palette-generator/` (placeholder)

### Using the Migrated Site

```bash
# Development
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

Visit the [MIGRATION.md](../MIGRATION.md) file for detailed migration information.

## Available Apps (Original Source)

### [HTTP Codes Explainer](./http-codes)
A comprehensive tool for developers to lookup and understand HTTP response codes.

**Migration Status:** ✅ Fully migrated  
**New Location:** `/docs/http-codes/`

**Features:**
- Real-time search functionality
- Individual pages for 85+ HTTP status codes
- Share links for specific codes
- Organized by category (1xx, 2xx, 3xx, 4xx, 5xx)

### [Color Palette Extractor](./color-palette-extractor)
Extract beautiful color palettes from images using Vibrant.js.

**Migration Status:** ✅ Fully migrated  
**New Location:** `/docs/color-palette-extractor/`

**Features:**
- Drag & drop or click to upload images
- Extract 6 color swatches (Vibrant, DarkVibrant, LightVibrant, Muted, DarkMuted, LightMuted)
- Configurable extraction settings
- One-click copy for HEX and RGB values
- Export palettes to JSON

### [Color Palette Generator](./color-palette-generator)
Generate harmonious color palettes for web projects based on color theory principles.

**Migration Status:** 📝 Placeholder page created  
**New Location:** `/docs/color-palette-generator/`

**Status:** Not yet implemented

## Original App Structure

Each app in this directory originally followed this structure:

```
app-name/
├── README.md              # App description and documentation
├── LICENSE               # Licensing information
├── index.html            # Main HTML file (for HTML apps)
├── style.css             # Styles (for HTML apps)
├── script.js             # JavaScript (for HTML apps)
└── docs/                 # VitePress docs (for VitePress apps)
    ├── .vitepress/
    │   └── config.js
    └── *.md
```

## Migration Benefits

The apps have been migrated to provide:

1. **Unified Experience**: All tools accessible from one navigation menu
2. **Consistent Design**: Shared modern Tailwind-inspired theme
3. **Better Performance**: Static site generation with Vite
4. **Easier Maintenance**: Single dependency tree and build process
5. **Enhanced UX**: Smooth animations, dark mode, responsive design

## Development Workflow

### Working with Original Source

If you need to reference or update the original source code:

1. Make changes in this directory (`apps/`)
2. Test the original app if needed
3. Apply changes to the migrated version in `/docs/`
4. Rebuild the main site

### Adding a New App

To add a new app to the unified site:

1. Create the app source in `apps/new-app/`
2. Create the migrated version in `docs/new-app/`
3. Update `/docs/.vitepress/config.ts` with navigation
4. Add feature card to landing page (`/docs/index.md`)
5. Update main README.md

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed instructions.

## Deployment

The unified site (not individual apps) is deployed:

**Build Command:** `npm run docs:build`  
**Output Directory:** `docs/.vitepress/dist`

Supported platforms:
- Cloudflare Pages
- Vercel
- Netlify
- Any static hosting provider

## Questions?

- See [MIGRATION.md](../MIGRATION.md) for migration details
- See [README.md](../README.md) for setup and usage
- See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines
- Open an issue on GitHub

---

**Note:** This directory is maintained for reference and source code. The production site uses the migrated versions in `/docs`.
