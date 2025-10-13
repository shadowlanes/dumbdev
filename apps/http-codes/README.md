# HTTP Codes Explainer

A comprehensive VitePress-powered web app for developers to lookup and understand HTTP response codes.

## Description

This tool helps web developers quickly find information about HTTP status codes. It provides detailed explanations, categories, real-time search functionality, and individual pages for all standard HTTP response codes.

## Features

- 🔍 **Real-time Search** - Type an HTTP code and get instant results on the homepage
- 📄 **Individual Pages** - Each code has its own SEO-optimized page (`/404`, `/200`, etc.)
- 🎨 **Modern UI** - Professional dark theme with orange accents
- 🚀 **Fast** - Static site generation for lightning-fast loads
- 📱 **Responsive** - Works seamlessly on all devices
- 🔗 **Share Links** - Copy direct links to any HTTP code
- 🗂️ **Organized** - Sidebar navigation by category (1xx, 2xx, 3xx, 4xx, 5xx)
- 🔎 **SEO Optimized** - Sitemap, meta tags, structured data, and canonical URLs

## Installation

```bash
npm install
```

## Development

### Run dev server:
```bash
npm run docs:dev
```

Then open `http://localhost:5173` in your browser.

### Generate/Update pages:
```bash
npm run generate
```

Run this whenever you update `http-codes.json` to regenerate all individual code pages.

### Build for production:
```bash
npm run docs:build
```

Output will be in `docs/.vitepress/dist/`

### Preview production build:
```bash
npm run docs:preview
```

## Project Structure

```
http-codes/
├── docs/                      # VitePress docs
│   ├── .vitepress/
│   │   ├── config.js         # VitePress configuration
│   │   └── theme/            # Custom theme
│   ├── public/               # Static assets
│   │   ├── http-codes.json   # HTTP codes data
│   │   └── robots.txt        # SEO robots file
│   ├── index.md              # Homepage with search
│   ├── codes.md              # All codes list
│   └── [code].md             # Individual code pages (generated)
├── generate-pages.js          # Script to generate pages from JSON
├── http-codes.json            # Master data file
└── package.json
```

## Deployment

### Cloudflare Pages

1. Push code to GitHub
2. Connect repository to Cloudflare Pages
3. Configure build settings:
   - **Build command:** `npm run docs:build`
   - **Build output directory:** `docs/.vitepress/dist`
   - **Root directory:** `apps/http-codes` (if in monorepo)
   - **Node version:** 18.x or 20.x

### Other Platforms

Build the site and deploy the `docs/.vitepress/dist` folder to any static hosting provider.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
