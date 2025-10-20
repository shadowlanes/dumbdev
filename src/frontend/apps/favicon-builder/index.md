---
layout: page
title: Favicon Builder
description: Generate complete favicon sets from PNG or JPEG images entirely in your browser
head:
  - - link
    - rel: canonical
      href: https://dumdev.shadowlanes.com/favicon-builder/
  - - script
    - type: application/ld+json
      children: |
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Favicon Builder",
          "description": "Generate complete favicon sets from PNG or JPEG images entirely in your browser",
          "url": "https://dumdev.shadowlanes.com/favicon-builder/",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Web Browser"
        }
---

<script setup>
import FaviconBuilder from './FaviconBuilder.vue'
</script>

<FaviconBuilder />