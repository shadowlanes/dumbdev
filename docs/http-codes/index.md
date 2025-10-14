---
layout: page
title: HTTP Codes Explainer
description: Lookup and understand HTTP status codes instantly
---

<script setup>
import { ref, watch } from 'vue'

const searchCode = ref('')
const codeData = ref(null)
const notFound = ref(false)
const shareCopied = ref(false)

// Load the HTTP codes data
const loadCodeData = async (code) => {
  if (!code) {
    codeData.value = null
    notFound.value = false
    return
  }
  
  try {
    const response = await fetch('/http-codes.json')
    const codes = await response.json()
    const found = codes.find(c => c.code.toString() === code)
    
    if (found) {
      codeData.value = found
      notFound.value = false
    } else {
      codeData.value = null
      notFound.value = true
    }
  } catch (error) {
    console.error('Error loading code data:', error)
    notFound.value = true
  }
}

// Watch for changes in search input
watch(searchCode, (newValue) => {
  loadCodeData(newValue)
})

// Share functionality
const shareURL = () => {
  const url = `${window.location.origin}/http-codes/${searchCode.value}`
  navigator.clipboard.writeText(url).then(() => {
    shareCopied.value = true
    setTimeout(() => {
      shareCopied.value = false
    }, 2000)
  }).catch(err => {
    console.error('Failed to copy: ', err)
  })
}
</script>

<style scoped>
.main-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 20px;
  min-height: 80vh;
}

.header {
  text-align: center;
  margin-bottom: 50px;
}

.logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.logo svg {
  width: 60px;
  height: 60px;
  margin-right: 15px;
}

.title {
  font-size: 2.5em;
  font-weight: 300;
  color: var(--vp-c-text-1);
  margin: 0;
}

.tagline {
  color: var(--vp-c-text-2);
  font-size: 1.1em;
  margin-top: 10px;
  font-weight: 300;
}

.search-container {
  max-width: 600px;
  margin: 0 auto 40px;
}

.search-input {
  width: 100%;
  padding: 20px 25px;
  font-size: 24px;
  border: 2px solid hsl(var(--border));
  border-radius: var(--radius);
  background-color: hsl(var(--card));
  color: var(--vp-c-text-1);
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.search-input:focus {
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 3px hsla(var(--primary), 0.1);
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.results-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 30px;
  background-color: hsl(var(--card));
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  box-shadow: var(--vp-shadow-2);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.code-title {
  font-size: 32px;
  font-weight: 600;
  color: hsl(var(--primary));
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.share-icon {
  width: 32px;
  height: 32px;
  padding: 8px;
  cursor: pointer;
  border-radius: var(--radius);
  background-color: hsl(var(--muted));
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-icon:hover {
  background-color: hsl(var(--primary));
  transform: scale(1.1);
}

.share-icon.copied {
  background-color: hsl(142, 71%, 45%);
}

.share-icon svg {
  width: 20px;
  height: 20px;
  fill: var(--vp-c-text-1);
}

.section {
  margin-bottom: 25px;
}

.section h3 {
  margin-bottom: 10px;
  color: var(--vp-c-text-2);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 14px;
}

.section p {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 16px;
  line-height: 1.6;
}

.not-found {
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 16px;
  padding: 30px;
}
</style>

<div class="main-container">
  <div class="header">
    <div class="logo">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="hsl(var(--primary))" stroke="currentColor" stroke-width="2"/>
        <text x="50" y="35" text-anchor="middle" fill="white" font-size="16" font-weight="bold">HTTP</text>
        <text x="50" y="55" text-anchor="middle" fill="white" font-size="12">404</text>
        <text x="50" y="70" text-anchor="middle" fill="white" font-size="10">OK</text>
      </svg>
    </div>
    <h1 class="title">HTTP Codes Explainer</h1>
    <p class="tagline">Lookup and understand HTTP status codes instantly</p>
  </div>

  <div class="search-container">
    <input 
      v-model="searchCode" 
      class="search-input" 
      type="text" 
      placeholder="Type HTTP code (e.g., 404)"
      autofocus
    />
  </div>

  <div v-if="codeData" class="results-container">
    <div class="code-title">
      <span>{{ codeData.code }} {{ codeData.name }}</span>
      <div class="share-icon" :class="{ copied: shareCopied }" @click="shareURL" title="Share this code">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
        </svg>
      </div>
    </div>
    <div class="section">
      <h3>Meaning</h3>
      <p>{{ codeData.meaning }}</p>
    </div>
    <div class="section">
      <h3>When to Use</h3>
      <p>{{ codeData.whenToUse }}</p>
    </div>
    <div class="section">
      <h3>Example</h3>
      <p>{{ codeData.example }}</p>
    </div>
    <div class="section">
      <h3>When Not to Use</h3>
      <p>{{ codeData.whenNotToUse }}</p>
    </div>
    <div v-if="codeData.source" class="section">
      <h3>Source</h3>
      <p>{{ codeData.source }}</p>
    </div>
  </div>

  <div v-if="notFound" class="results-container">
    <div class="not-found">
      No HTTP status code found for "{{ searchCode }}". Try codes like 200, 404, or 500.
    </div>
  </div>
</div>

