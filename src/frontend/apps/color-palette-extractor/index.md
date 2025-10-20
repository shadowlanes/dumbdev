---
layout: page
title: Color Palette Extractor
description: Extract beautiful color palettes from images using Vibrant.js
head:
  - - link
    - rel: canonical
      href: https://dumddev.me/color-palette-extractor/
  - - script
    - type: application/ld+json
      children: |
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Color Palette Extractor",
          "description": "Extract beautiful color palettes from images using Vibrant.js",
          "url": "https://dumddev.me/color-palette-extractor/",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Web Browser"
        }
  - - script
    - src: /vibrant.min.js
      defer: true
---

<script setup>
import ColorPaletteExtractor from './ColorPaletteExtractor.vue'
</script>

<ColorPaletteExtractor />