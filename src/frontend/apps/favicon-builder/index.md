---
layout: page
title: Favicon Builder
description: Generate complete favicon sets from PNG or JPEG images entirely in your browser
head:
  - - link
    - rel: canonical
      href: https://dumddev.me/favicon-builder/
  - - script
    - type: application/ld+json
      children: |
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Favicon Builder",
          "description": "Generate complete favicon sets from PNG or JPEG images entirely in your browser",
          "url": "https://dumddev.me/favicon-builder/",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Web Browser"
        }
---

<script setup>
import FaviconBuilder from './FaviconBuilder.vue'
</script>

<FaviconBuilder />