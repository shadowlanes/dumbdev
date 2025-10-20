# dumdev

A monorepo containing a collection of independent micro apps for web developers.

## Structure

This repository is organized as a monorepo where each project is a separate independent app located in the `apps/` directory. Each app:

- Has its own README, LICENSE, and documentation
- Can be deployed independently
- Focuses on a specific tool or utility for web developers
- Is self-contained with its own dependencies and configuration

## Apps

Browse the `apps/` directory to see all available micro apps. Each app has its own README with detailed information about its purpose, installation, and usage.


## 🛠️ Tech Stack

- **Framework**: [VitePress](https://vitepress.dev/) - Static site generator powered by Vite and Vue
- **Theme**: Custom Tailwind-inspired theme with HSL color system
- **Styling**: Modern CSS with custom properties, supporting light/dark modes
- **Libraries**: Vibrant.js for color extraction

## 📖 Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dumdev.git
cd dumdev

# Install dependencies
pnpm install
```

### Development

```bash
# Navigate to frontend directory
cd src/frontend

# Start the development server
pnpm run dev

# The site will be available at http://localhost:5173
```

### Build for Production

```bash
# Navigate to frontend directory
cd src/frontend

# Build the site
pnpm run build

# Preview the production build
pnpm run preview
```

### Generate HTTP Codes Pages

If you've updated the HTTP codes data, regenerate the pages:

```bash
cd src/frontend
pnpm run generate:http-codes
```

## 📁 Project Structure

```
dumdev/
├── src/
│   ├── frontend/                 # VitePress frontend application
│   │   ├── apps/                 # VitePress documentation root
│   │   │   ├── .vitepress/
│   │   │   │   ├── config.ts     # VitePress configuration
│   │   │   │   ├── theme/        # Custom theme
│   │   │   │   └── public/       # Static assets
│   │   │   ├── index.md          # Landing page
│   │   │   ├── http-codes/       # HTTP codes app
│   │   │   ├── color-palette-extractor/  # Color extractor app
│   │   │   └── color-palette-generator/  # Color generator app
│   │   ├── scripts/              # Build and generation scripts
│   │   └── package.json          # Frontend dependencies
│   └── backend/                  # Backend application (future)
├── CONTRIBUTING.md
├── LICENSE
├── MIGRATION.md
└── README.md
```

## 🎨 Theme Customization

The theme is built with customization in mind. All colors, spacing, and typography are defined as CSS custom properties in `apps/.vitepress/theme/styles/vars.css`.

### Color System

The theme uses an HSL-based color system similar to shadcn/ui:

- `--primary`: Main brand color
- `--secondary`: Secondary color
- `--muted`: Muted backgrounds and text
- `--accent`: Accent color for highlights
- `--border`: Border color
- And more...

Both light and dark modes are fully supported.

### Customizing Colors

Edit `apps/.vitepress/theme/styles/vars.css` to change the color scheme:

```css
:root {
  --primary: 217 91% 60%;  /* HSL values */
  /* ... other colors */
}
```

## 🚀 Deployment

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - **Build command**: `cd src/frontend && pnpm run build`
   - **Build output directory**: `src/frontend/apps/.vitepress/dist`
   - **Node version**: 18.x or 20.x


## Contributing

Each app can be developed independently. Navigate to the specific app directory to work on it. See the individual app README for development instructions.

## License

This monorepo is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. Individual apps may have their own licenses as specified in their respective directories. 
