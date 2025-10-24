---
layout: page
title: JSON Formatter
description: Format JSON strings for better readability with automatic formatting as you type
head:
  - - link
    - rel: canonical
      href: https://dumbdev.me/json-formatter/
  - - script
    - type: application/ld+json
      children: |
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "JSON Formatter",
          "description": "Format JSON strings for better readability with automatic formatting as you type",
          "url": "https://dumbdev.me/json-formatter/",
          "mainEntity": {
            "@type": "WebApplication",
            "name": "JSON Formatter",
            "operatingSystem": "All"
          }
        }
---

<script setup>
import JsonFormatter from './JsonFormatter.vue'
</script>

<JsonFormatter />
