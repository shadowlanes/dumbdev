---
layout: page
---

<script setup>
import { ref, watch } from 'vue'
import { useData } from 'vitepress'

const searchCode = ref('')
const codeData = ref(null)
const notFound = ref(false)

// Load the HTTP codes data
const loadCodeData = async (code) => {
  if (!code) {
    codeData.value = null
    notFound.value = false
    return
  }
  
  try {
    const response = await fetch(`/http-codes.json`)
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
  color: #ffffff;
  margin: 0;
}

.tagline {
  color: #cccccc;
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
  border: 2px solid #333333;
  border-radius: 12px;
  background-color: #1a1a1a;
  color: #ffffff;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.3s ease;
  text-align: center;
}

.search-input:focus {
  border-color: #ff6b35;
}

.search-input::placeholder {
  color: #666666;
}

.results-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 30px;
  background-color: #1a1a1a;
  border-radius: 12px;
  border: 1px solid #333333;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.code-title {
  font-size: 32px;
  font-weight: 600;
  color: #ff6b35;
  margin-bottom: 25px;
}

.section {
  margin-bottom: 25px;
}

.section h3 {
  margin-bottom: 10px;
  color: #cccccc;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 14px;
}

.section p {
  margin: 0;
  color: #ffffff;
  font-size: 16px;
  line-height: 1.6;
}

.not-found {
  text-align: center;
  color: #999999;
  font-size: 16px;
  padding: 30px;
}

.share-btn {
  margin-top: 25px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
}
</style>

<div class="main-container">
  <div class="header">
    <div class="logo">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#ff6b35" stroke="#ffffff" stroke-width="5"/>
        <text x="50" y="35" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="bold">HTTP</text>
        <text x="50" y="55" text-anchor="middle" fill="#ffffff" font-size="12">404</text>
        <text x="50" y="70" text-anchor="middle" fill="#ffffff" font-size="10">OK</text>
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
    <div class="code-title">{{ codeData.code }} {{ codeData.name }}</div>
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
    <button class="share-btn" @click="shareURL">Share</button>
  </div>

  <div v-if="notFound" class="results-container">
    <div class="not-found">
      No HTTP status code found for "{{ searchCode }}". Try codes like 200, 404, or 500.
    </div>
  </div>
</div>

<script>
export default {
  methods: {
    shareURL() {
      const url = `${window.location.origin}/${this.searchCode}`
      navigator.clipboard.writeText(url).then(() => {
        alert('URL copied to clipboard!')
      }).catch(err => {
        console.error('Failed to copy: ', err)
      })
    }
  }
}
</script>
