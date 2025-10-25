---
layout: page
title: Cron Validator
description: Validate and understand cron expressions with real-time explanations and next run times
head:
  - - link
    - rel: canonical
      href: https://dumbdev.me/cron-validator/
  - - script
    - type: application/ld+json
      children: |
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Cron Validator",
          "description": "Validate and understand cron expressions with real-time explanations and next run times",
          "url": "https://dumbdev.me/cron-validator/",
          "mainEntity": {
            "@type": "WebApplication",
            "name": "Cron Validator",
            "operatingSystem": "All"
          }
        }
---

<script setup>
import CronValidator from './CronValidator.vue'
</script>

<CronValidator />
