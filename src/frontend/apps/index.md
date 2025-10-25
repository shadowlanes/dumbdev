---
layout: home
title: "DumbDev Desktop"
description: "A fake macOS desktop stuffed with developer micro tools"
head:
  - - link
    - rel: canonical
      href: https://dumbdev.me/
  - - script
    - type: application/ld+json
      children: |
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "DumbDev Desktop",
          "description": "A fake macOS desktop stuffed with developer micro tools",
          "url": "https://dumbdev.me"
        }
---

<div class="mac-viewport">
  <div class="menu-bar" role="menubar">
    <div class="menu-left">
      <span class="menu-logo" aria-hidden="true"></span>
      <span class="menu-title">DumbDev</span>
      <div class="menu-dropdown">
        <button class="menu-button" type="button" aria-haspopup="true">Debug</button>
        <div class="menu-panel" role="menu">
          <a role="menuitem" href="/http-codes/">HTTP Codes Explainer</a>
          <a role="menuitem" href="/sql-formatter/">SQL Formatter</a>
          <a role="menuitem" href="/json-formatter/">JSON Formatter</a>
          <a role="menuitem" href="/cron-validator/">Cron Validator</a>
        </div>
      </div>
      <div class="menu-dropdown">
        <button class="menu-button" type="button" aria-haspopup="true">Design</button>
        <div class="menu-panel" role="menu">
          <a role="menuitem" href="/color-palette-extractor/">Color Palette Extractor</a>
          <a role="menuitem" href="/color-palette-generator/">Color Palette Generator</a>
        </div>
      </div>
      <div class="menu-dropdown">
        <button class="menu-button" type="button" aria-haspopup="true">Assets</button>
        <div class="menu-panel" role="menu">
          <a role="menuitem" href="/favicon-builder/">Favicon Builder</a>
        </div>
      </div>
    </div>
    <div class="menu-right">
      <a class="menu-link" href="https://github.com/shadowlanes/dumbdev" target="_blank" rel="noopener">GitHub</a>
      <a class="menu-link" href="https://github.com/shadowlanes/dumbdev/issues" target="_blank" rel="noopener">Request Tool</a>
      <span class="menu-clock" aria-hidden="true">☀︎</span>
    </div>
  </div>

  <div class="desktop" role="navigation" aria-label="Desktop shortcuts">
    <div class="desktop-icons">
      <a class="desktop-icon" href="/http-codes/">
        <span class="icon-emoji" aria-hidden="true">🛠️</span>
        <span class="icon-label">HTTP Codes</span>
      </a>
      <a class="desktop-icon" href="/sql-formatter/">
        <span class="icon-emoji" aria-hidden="true">📄</span>
        <span class="icon-label">SQL Formatter</span>
      </a>
      <a class="desktop-icon" href="/json-formatter/">
        <span class="icon-emoji" aria-hidden="true">🔣</span>
        <span class="icon-label">JSON Formatter</span>
      </a>
      <a class="desktop-icon" href="/cron-validator/">
        <span class="icon-emoji" aria-hidden="true">⏰</span>
        <span class="icon-label">Cron Validator</span>
      </a>
      <a class="desktop-icon" href="/color-palette-extractor/">
        <span class="icon-emoji" aria-hidden="true">🎨</span>
        <span class="icon-label">Palette Extractor</span>
      </a>
      <a class="desktop-icon" href="/color-palette-generator/">
        <span class="icon-emoji" aria-hidden="true">🌈</span>
        <span class="icon-label">Palette Generator</span>
      </a>
      <a class="desktop-icon" href="/favicon-builder/">
        <span class="icon-emoji" aria-hidden="true">🖼️</span>
        <span class="icon-label">Favicon Builder</span>
      </a>
    </div>
  </div>

  <div class="dock" role="navigation" aria-label="Dock shortcuts">
    <div class="dock-glass">
      <a class="dock-icon" href="/http-codes/">
        <span aria-hidden="true">🛠️</span>
        <span>HTTP Codes</span>
      </a>
      <a class="dock-icon" href="/color-palette-extractor/">
        <span aria-hidden="true">🎨</span>
        <span>Extractor</span>
      </a>
      <a class="dock-icon" href="/favicon-builder/">
        <span aria-hidden="true">🖼️</span>
        <span>Favicons</span>
      </a>
      <a class="dock-icon" href="/sql-formatter/">
        <span aria-hidden="true">📄</span>
        <span>SQL</span>
      </a>
      <a class="dock-icon" href="/json-formatter/">
        <span aria-hidden="true">🔣</span>
        <span>JSON</span>
      </a>
      <a class="dock-icon" href="/cron-validator/">
        <span aria-hidden="true">⏰</span>
        <span>Cron</span>
      </a>
      <a class="dock-icon" href="/color-palette-generator/">
        <span aria-hidden="true">🌈</span>
        <span>Generator</span>
      </a>
    </div>
  </div>
</div>

<section class="desktop-notes" id="about">
  <h2>About this fake desktop</h2>
  <p>
    DumbDev Desktop is what happens when you mix a love for macOS aesthetics with a deep disdain for repetitive dev chores.
    Every icon opens a tiny tool that saves you from a tedious Google rabbit hole.
  </p>
  <p>
    Missing a niche tool that should be here? Smash that <a href="https://github.com/shadowlanes/dumbdev/issues">issue tracker</a> and we'll drop it on the desktop.
  </p>
</section>

<style scoped>
.mac-viewport {
  position: relative;
  min-height: 80vh;
  border-radius: 36px;
  overflow: hidden;
  box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.65);
  background: radial-gradient(circle at top, rgba(255,255,255,0.35) 0%, rgba(0,0,0,0.2) 60%),
              linear-gradient(135deg, hsl(221 73% 58%), hsl(268 62% 52%), hsl(12 74% 55%));
  backdrop-filter: blur(10px);
  color: #f8fbff;
}

.menu-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 1.25rem;
  background: rgba(20, 24, 34, 0.4);
  backdrop-filter: blur(25px);
  font-size: 0.95rem;
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.menu-logo {
  font-size: 1.3rem;
}

.menu-title {
  font-weight: 600;
  letter-spacing: 0.02em;
}

.menu-dropdown {
  position: relative;
}

.menu-button {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font: inherit;
  font-weight: 500;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.menu-button:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.65);
  outline-offset: 2px;
}

.menu-dropdown:hover .menu-button,
.menu-dropdown:focus-within .menu-button {
  background: rgba(255, 255, 255, 0.2);
}

.menu-panel {
  position: absolute;
  top: 1.8rem;
  left: 0;
  display: flex;
  flex-direction: column;
  min-width: 190px;
  padding: 0.4rem 0;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(16, 20, 30, 0.85);
  box-shadow: 0 18px 28px -18px rgba(0, 0, 0, 0.6);
  opacity: 0;
  transform: translateY(6px);
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;
  z-index: 10;
}

.menu-dropdown:hover .menu-panel,
.menu-dropdown:focus-within .menu-panel {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.menu-panel a {
  padding: 0.45rem 1rem;
  color: inherit;
  text-decoration: none;
  transition: background 0.12s ease;
}

.menu-panel a:hover {
  background: rgba(255, 255, 255, 0.15);
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 500;
}

.menu-link {
  color: inherit;
  text-decoration: none;
  opacity: 0.85;
  transition: opacity 0.12s ease;
}

.menu-link:hover {
  opacity: 1;
}

.menu-clock {
  font-size: 1.1rem;
}

.desktop {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem 6rem;
}

.desktop-icons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 2.5rem;
  max-width: 640px;
}

.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: inherit;
  filter: drop-shadow(0 10px 18px rgba(0,0,0,0.45));
}

.desktop-icon:hover .icon-emoji {
  transform: translateY(-4px) scale(1.04);
}

.icon-emoji {
  display: grid;
  place-items: center;
  width: 92px;
  height: 92px;
  font-size: 2.8rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(14px);
  transition: transform 0.18s ease;
}

.icon-label {
  font-size: 0.95rem;
  text-align: center;
  text-shadow: 0 2px 6px rgba(0,0,0,0.5);
}

.dock {
  position: absolute;
  bottom: 1.75rem;
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.dock-glass {
  display: flex;
  gap: 0.9rem;
  padding: 0.9rem 1.4rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(28px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  pointer-events: auto;
}

.dock-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.8rem;
  text-decoration: none;
  color: inherit;
}

.dock-icon span:last-child {
  font-size: 0.75rem;
}

.dock-icon:hover {
  transform: translateY(-6px) scale(1.05);
}

.desktop-notes {
  margin: 3rem auto 0;
  max-width: 720px;
  text-align: center;
}

.desktop-notes h2 {
  font-size: 1.9rem;
}

.desktop-notes p {
  font-size: 1.02rem;
  line-height: 1.7;
}

.desktop-notes a {
  color: var(--vp-c-brand-1);
}

@media (max-width: 768px) {
  .mac-viewport {
    border-radius: 24px;
  }

  .menu-bar {
    flex-direction: column;
    gap: 0.6rem;
    align-items: flex-start;
  }

  .desktop {
    padding: 3rem 1.5rem 6rem;
  }

  .desktop-icons {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 2rem;
  }

  .dock {
    bottom: 1.2rem;
  }

  .dock-glass {
    gap: 0.6rem;
    padding: 0.8rem 1rem;
  }
}
</style>

