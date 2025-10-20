---
layout: page
title: SQL Formatter
description: Format SQL queries for MySQL, PostgreSQL, and SQL Server with automatic formatting as you type
head:
  - - link
    - rel: canonical
      href: https://dumdev.shadowlanes.com/sql-formatter/
  - - script
    - type: application/ld+json
      children: |
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "SQL Formatter",
          "description": "Format SQL queries for MySQL, PostgreSQL, and SQL Server with automatic formatting as you type",
          "url": "https://dumdev.shadowlanes.com/sql-formatter/",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Web Browser"
        }
---

<script setup>
import SqlFormatter from './SqlFormatter.vue'
</script>

<SqlFormatter />