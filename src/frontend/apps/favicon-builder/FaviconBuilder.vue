<template>
  <div class="builder-container">
    <div class="builder-header">
      <h1>Favicon Builder</h1>
      <p>Upload a PNG or JPEG image and generate a complete favicon set entirely in your browser</p>
    </div>

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
          <input ref="fileInput" type="file" accept="image/png,image/jpeg,image/jpg" hidden @change="handleFileChange" />
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

    <div v-if="isGenerating" class="loading">
      <div class="spinner"></div>
      <p>Generating favicons...</p>
    </div>

    <div v-if="generatedIcons.length > 0 && !isGenerating" class="results">
      <div class="card results-card">
        <div class="results-header">
          <h3 class="results-title">Generated Favicon Set</h3>
          <button class="btn-secondary" @click="downloadAll">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download All as ZIP
          </button>
        </div>
        <div class="icon-grid">
          <div 
            v-for="(icon, index) in generatedIcons" 
            :key="index" 
            class="icon-item"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="icon-preview">
              <img :src="icon.url" :alt="`${icon.size}x${icon.size} favicon`" />
            </div>
            <div class="icon-info">
              <div class="icon-size">{{ icon.size }}x{{ icon.size }}</div>
              <button class="btn-tertiary" @click="downloadIcon(icon)">Download</button>
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
import { ref, computed, nextTick } from 'vue'

interface GeneratedIcon {
  size: number
  url: string
  blob: Blob
}

const fileInput = ref<HTMLInputElement | null>(null)
const previewImage = ref<HTMLImageElement | null>(null)
const currentImage = ref<string>('')
const isDragging = ref(false)
const isGenerating = ref(false)
const generatedIcons = ref<GeneratedIcon[]>([])
const toastMessage = ref('')

const iconSizes = [16, 32, 48, 64, 128, 180, 192, 256, 384, 512]

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
  reader.onload = async (e) => {
    currentImage.value = e.target?.result as string
    await nextTick()
    generateFavicons()
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  currentImage.value = ''
  generatedIcons.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function generateFavicons() {
  if (!currentImage.value) {
    showToast('Please upload an image first')
    return
  }

  isGenerating.value = true

  try {
    // Wait for the preview image to load
    const img = previewImage.value
    if (!img) {
      throw new Error('Image element not found')
    }

    if (!img.complete) {
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = () => reject(new Error('Failed to load image'))
      })
    }

    const icons: GeneratedIcon[] = []

    for (const size of iconSizes) {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')!

      // Draw the image scaled to the canvas
      ctx.drawImage(img, 0, 0, size, size)

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      })

      const url = URL.createObjectURL(blob)
      icons.push({ size, url, blob })
    }

    generatedIcons.value = icons
    isGenerating.value = false
    showToast('Favicons generated successfully!')
  } catch (error) {
    console.error('Error generating favicons:', error)
    isGenerating.value = false
    showToast('Error generating favicons. Please try again.')
  }
}

function downloadIcon(icon: GeneratedIcon) {
  const a = document.createElement('a')
  a.href = icon.url
  a.download = `favicon-${icon.size}x${icon.size}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function downloadAll() {
  // For simplicity, download each individually or implement ZIP later
  generatedIcons.value.forEach(icon => downloadIcon(icon))
  showToast('All favicons downloaded!')
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
.builder-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 100vh;
}

.builder-header {
  text-align: center;
  margin-bottom: 3rem;
}

.builder-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.builder-header p {
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

.upload-section {
  margin-bottom: 2rem;
}

.upload-area {
  border: 2px dashed var(--vp-c-divider);
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--vp-c-bg-soft);
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
  margin-bottom: 1rem;
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
  display: flex;
  justify-content: center;
}

.preview-container img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
}

.loading {
  text-align: center;
  margin: 2rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--vp-c-divider);
  border-top: 4px solid var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.results {
  margin-top: 2rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.results-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.icon-item {
  text-align: center;
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
  animation: fadeIn 0.5s ease forwards;
  opacity: 0;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

.icon-preview img {
  width: 64px;
  height: 64px;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.icon-size {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.btn-primary, .btn-secondary, .btn-tertiary {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: var(--vp-c-brand-1);
  color: white;
}

.btn-primary:hover {
  background: var(--vp-c-brand-2);
}

.btn-secondary {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.btn-secondary:hover {
  background: var(--vp-c-bg-soft);
}

.btn-tertiary {
  background: transparent;
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.btn-tertiary:hover {
  background: var(--vp-c-brand-1);
  color: white;
}

.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: var(--vp-shadow-2);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.toast-enter-active, .toast-leave-active {
  transition: opacity 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
}
</style>