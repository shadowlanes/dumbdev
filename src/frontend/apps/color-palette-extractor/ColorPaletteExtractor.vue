<template>
  <div class="extractor-container">
    <div class="extractor-header">
      <h1>Color Palette Extractor</h1>
      <p>Extract beautiful color palettes from your images</p>
    </div>

    <div class="upload-controls-wrapper" :class="{ centered: !currentImage }">
      <div class="upload-section">
        <div v-if="!currentImage" class="card upload-card">
          <div 
            class="upload-area" 
            :class="{ dragover: isDragging }"
            @click="handleUploadClick"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <svg class="upload-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <h3 class="upload-title">Drop your image here</h3>
            <p class="upload-text">or click to browse</p>
            <input ref="fileInput" type="file" accept="image/*" hidden @change="handleFileChange" />
          </div>
        </div>

        <div v-else class="card preview-card">
          <div class="preview-header">
            <h3 class="preview-title">Image Preview</h3>
            <button class="btn-secondary" @click="removeImage">Remove</button>
          </div>
          <div class="preview-container">
            <img ref="previewImage" :src="currentImage" alt="Preview" />
          </div>
        </div>
      </div>

      <div v-show="currentImage" class="controls" :class="{ show: currentImage }">
        <div class="card control-card">
          <h3 class="control-title">Settings</h3>
          <div class="control-group">
            <label class="control-label">
              <span>Scale Down Factor</span>
              <span class="control-value">{{ quality }}</span>
            </label>
            <input v-model.number="quality" type="range" min="1" max="5" class="slider" />
          </div>

          <div class="control-group">
            <label class="control-label">
              <span>Sample Size</span>
              <span class="control-value">{{ colorCount }}</span>
            </label>
            <input v-model.number="colorCount" type="range" min="16" max="256" step="16" class="slider" />
          </div>

          <button class="btn-primary" @click="extractColors" :disabled="isExtracting">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
            {{ isExtracting ? 'Extracting...' : 'Extract Colors' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="isExtracting" class="loading">
      <div class="spinner"></div>
      <p>Extracting colors...</p>
    </div>

    <div v-if="extractedColors.length > 0 && !isExtracting" class="results">
      <div class="card results-card">
        <div class="results-header">
          <h3 class="results-title">Extracted Palette</h3>
          <button class="btn-secondary" @click="exportPalette">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export
          </button>
        </div>
        <div class="palette-grid">
          <div 
            v-for="(color, index) in extractedColors" 
            :key="index" 
            class="color-item"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div 
              class="color-swatch" 
              :style="{ backgroundColor: color.hex }"
              @click="copyToClipboard(color.hex)"
            >
              <div class="color-name">{{ color.name }}</div>
            </div>
            <div class="color-info">
              <div class="color-code" @click="copyToClipboard(color.hex)">{{ color.hex }}</div>
              <div class="color-rgb" @click="copyToClipboard(color.rgb)">{{ color.rgb }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface ExtractedColor {
  name: string
  hex: string
  rgb: string
  population: number
}

const fileInput = ref<HTMLInputElement | null>(null)
const previewImage = ref<HTMLImageElement | null>(null)
const currentImage = ref<string>('')
const isDragging = ref(false)
const quality = ref(3)
const colorCount = ref(64)
const isExtracting = ref(false)
const extractedColors = ref<ExtractedColor[]>([])
const toastMessage = ref('')

let Vibrant: any = null

onMounted(async () => {
  // Load Vibrant.js
  if (typeof window !== 'undefined' && !(window as any).Vibrant) {
    await loadScript('/vibrant.min.js')
    Vibrant = (window as any).Vibrant
  } else if ((window as any).Vibrant) {
    Vibrant = (window as any).Vibrant
  }
})

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(script)
  })
}

function handleUploadClick() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processFile(file)
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  } else {
    showToast('Please drop a valid image file')
  }
}

function processFile(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => {
    currentImage.value = e.target?.result as string
    extractedColors.value = []
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  currentImage.value = ''
  extractedColors.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function extractColors() {
  if (!currentImage.value || !Vibrant || !previewImage.value) {
    showToast('Please upload an image first')
    return
  }

  isExtracting.value = true

  try {
    const vibrant = new Vibrant(previewImage.value, {
      colorCount: colorCount.value,
      quality: quality.value
    })

    const palette = await vibrant.getPalette()
    const swatchOrder = ['Vibrant', 'DarkVibrant', 'LightVibrant', 'Muted', 'DarkMuted', 'LightMuted']
    
    const colors: ExtractedColor[] = []
    for (const swatchName of swatchOrder) {
      if (palette[swatchName]) {
        const swatch = palette[swatchName]
        colors.push({
          name: swatchName,
          hex: swatch.getHex(),
          rgb: `rgb(${Math.round(swatch.getRgb()[0])}, ${Math.round(swatch.getRgb()[1])}, ${Math.round(swatch.getRgb()[2])})`,
          population: swatch.getPopulation()
        })
      }
    }

    extractedColors.value = colors
    isExtracting.value = false

    // Scroll to results
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      })
    }, 100)

    showToast('Colors extracted successfully!')
  } catch (error) {
    console.error('Error extracting colors:', error)
    isExtracting.value = false
    showToast('Error extracting colors. Please try again.')
  }
}

function exportPalette() {
  const data = {
    palette: extractedColors.value.map(c => c.hex),
    timestamp: new Date().toISOString()
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `color-palette-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  showToast('Palette exported successfully!')
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${text} to clipboard!`)
  }).catch(() => {
    showToast('Failed to copy to clipboard')
  })
}

function showToast(message: string) {
  toastMessage.value = message
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}
</script>

<style scoped>
/* Using VitePress native CSS variables */
.extractor-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 100vh;
}

.extractor-header {
  text-align: center;
  margin-bottom: 3rem;
}

.extractor-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.extractor-header p {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
}

.card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.upload-controls-wrapper {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 2fr 1fr;
  transition: all 0.5s ease;
}

.upload-controls-wrapper.centered {
  grid-template-columns: 1fr;
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-controls-wrapper.centered .upload-section {
  max-width: 100%;
  width: 100%;
}

@media (max-width: 768px) {
  .upload-controls-wrapper {
    grid-template-columns: 1fr;
  }
}

.upload-section {
  display: grid;
  gap: 1.5rem;
}

.upload-area {
  border: 2px dashed var(--vp-c-divider);
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--vp-c-bg-soft);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-alt);
}

.upload-area.dragover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-alt);
  transform: scale(1.02);
}

.upload-icon {
  color: var(--vp-c-text-2);
  margin: 0 auto 1rem auto;
  display: block;
}

.upload-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.upload-text {
  color: var(--vp-c-text-2);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.preview-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.preview-container {
  width: 100%;
  max-height: 400px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-container img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
}

.controls {
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.5s ease;
}

.controls.show {
  opacity: 1;
  transform: translateX(0);
}

.control-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: fit-content;
}

.control-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.control-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.control-value {
  background: var(--vp-c-bg-alt);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--vp-c-default-soft);
  border: 1px solid var(--vp-c-divider);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  border: 2px solid var(--vp-c-bg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  background: var(--vp-c-brand-2);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  border: 2px solid var(--vp-c-bg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  background: var(--vp-c-brand-2);
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.btn-primary {
  background: var(--vp-c-brand-1);
  color: var(--vp-button-brand-text);
  width: 100%;
}

.btn-primary:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
  background: var(--vp-c-brand-3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.btn-secondary:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;
  animation: fadeIn 0.3s ease;
  color: var(--vp-c-text-1);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.results {
  animation: slideIn 0.3s ease;
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.results-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.5rem;
}

.color-item {
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease;
  animation-fill-mode: both;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid var(--vp-c-divider);
}

.color-item:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.color-swatch {
  height: 170px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.color-name {
  position: absolute;
  top: 0.75rem;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  padding: 0.25rem 0.5rem;
}

.color-swatch::after {
  content: 'Click to copy HEX';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.color-swatch:hover::after {
  opacity: 1;
}

.color-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
}

.color-code,
.color-rgb {
  font-family: var(--vp-font-family-mono);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  width: fit-content;
}

.color-code {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.color-code:hover {
  background: var(--vp-c-bg-alt);
  transform: translateX(2px);
  color: var(--vp-c-brand-1);
}

.color-rgb {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}

.color-rgb:hover {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  transform: translateX(2px);
}

.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--vp-c-brand-1);
  color: var(--vp-button-brand-text);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  font-weight: 500;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateY(100px);
  opacity: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

