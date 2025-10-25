---
layout: page
title: Epoch Time Converter
description: Convert epoch timestamps to human-readable dates with support for seconds, milliseconds, and nanoseconds
head:
  - - link
    - rel: canonical
      href: https://dumbdev.me/epoch-converter/
  - - script
    - type: application/ld+json
      children: |
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Epoch Time Converter",
          "description": "Convert epoch timestamps to human-readable dates with support for seconds, milliseconds, and nanoseconds",
          "url": "https://dumbdev.me/epoch-converter/",
          "mainEntity": {
            "@type": "WebApplication",
            "name": "Epoch Time Converter",
            "operatingSystem": "All"
          }
        }
---

<script setup>
import EpochConverter from './EpochConverter.vue'
</script>

<EpochConverter />
