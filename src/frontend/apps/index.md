---
layout: home
title: "Web Developer Tools"
description: "A collection of independent micro apps for web developers"
head:
  - - link
    - rel: canonical
      href: https://webdev.shadowlanes.com/
  - - script
    - type: application/ld+json
      children: |
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Web Developer Tools",
          "description": "A collection of independent micro apps for web developers",
          "url": "https://webdev.shadowlanes.com"
        }
hero:
  name: "Web Developer Tools"
  text: "Powerful micro apps for developers"
  tagline: "A collection of independent tools designed to simplify your web development workflow"
  image:
    src: /logo.svg
    alt: Web Developer Tools
  actions:
    - theme: brand
      text: Get Started
      link: /http-codes/
    - theme: alt
      text: View on GitHub
      link: https://github.com/shadowlanes/webdev

features:
  - icon: 🔍
    title: HTTP Codes Explainer
    details: Quickly lookup and understand HTTP status codes with real-time search and detailed explanations for all standard codes.
    link: /http-codes/
    linkText: Explore HTTP Codes

  - icon: 🎨
    title: Color Palette Extractor
    details: Extract beautiful color palettes from images using Vibrant.js. Upload, extract, and export colors with ease.
    link: /color-palette-extractor/
    linkText: Try Color Extractor

  - icon: 🖼️
    title: Favicon Builder
    details: Generate complete favicon sets from PNG or JPEG images entirely in your browser. No server required.
    link: /favicon-builder/
    linkText: Build Favicons

  - icon: 🌈
    title: Color Palette Generator
    details: Generate harmonious color palettes based on color theory principles. Perfect for design projects.
    link: /color-palette-generator/
    linkText: Coming Soon →
---

## Why Choose These Tools?

<div class="vp-features-wrapper">
  <div class="vp-feature">
    <div class="vp-feature-icon">⚡</div>
    <h3 class="vp-feature-title">Fast & Lightweight</h3>
    <p class="vp-feature-details">Built with performance in mind. No unnecessary dependencies or bloat.</p>
  </div>

  <div class="vp-feature">
    <div class="vp-feature-icon">🎯</div>
    <h3 class="vp-feature-title">Purpose-Built</h3>
    <p class="vp-feature-details">Each app focuses on doing one thing exceptionally well.</p>
  </div>

  <div class="vp-feature">
    <div class="vp-feature-icon">🚀</div>
    <h3 class="vp-feature-title">Easy to Use</h3>
    <p class="vp-feature-details">Intuitive interfaces that require no documentation to get started.</p>
  </div>
</div>

<style scoped>
.vp-features-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem auto;
  max-width: 1200px;
  padding: 0 1.5rem;
}

.vp-feature {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
  text-align: center;
}

.vp-feature:hover {
  border-color: var(--vp-c-brand-1);
}

.vp-feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  line-height: 1;
}

.vp-feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.75rem 0;
}

.vp-feature-details {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}

@media (max-width: 768px) {
  .vp-features-wrapper {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>