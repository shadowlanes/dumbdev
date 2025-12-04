<template>
  <div class="encoder-container">
    <div class="encoder-header">
      <h1>Encoder / Decoder</h1>
      <p>Encode and decode strings with multiple formats including Base64, URL, HTML entities, and JWT.</p>
    </div>

    <div class="encoder-layout">
      <!-- Type Selector -->
      <div class="type-selector">
        <button 
          v-for="type in encoderTypes" 
          :key="type.id"
          :class="['type-button', { active: selectedType === type.id }]"
          @click="selectType(type.id)"
        >
          <span class="type-icon">{{ type.icon }}</span>
          <span class="type-label">{{ type.label }}</span>
        </button>
      </div>

      <div class="panels-wrapper">
        <!-- Decoded Text Panel -->
        <div class="panel input-panel">
          <div class="panel-header">
            <h3>{{ decodedLabel }}</h3>
            <div class="header-controls">
              <button class="btn-secondary" @click="clearDecoded" :disabled="selectedType === 'jwt' ? !encodedText.trim() : !decodedText.trim()">
                Clear
              </button>
              <button 
                class="btn-secondary" 
                @click="copyDecoded" 
                :disabled="selectedType === 'jwt' ? !encodedText.trim() : !decodedText.trim()"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                  <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                </svg>
                Copy
              </button>
            </div>
          </div>
          <div class="panel-body">
            <textarea
              v-if="selectedType === 'jwt'"
              v-model="encodedText"
              class="text-input"
              :placeholder="decodedPlaceholder"
              spellcheck="false"
              @input="onEncodedChange"
            ></textarea>
            <textarea
              v-else
              v-model="decodedText"
              class="text-input"
              :placeholder="decodedPlaceholder"
              spellcheck="false"
              @input="onDecodedChange"
            ></textarea>
          </div>
        </div>

        <!-- Encoded Text Panel -->
        <div class="panel output-panel">
          <div class="panel-header">
            <h3>{{ encodedLabel }}</h3>
            <div class="header-controls">
              <button 
                v-if="hasError"
                class="btn-error"
                disabled
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Error
              </button>
              <button class="btn-secondary" @click="clearEncoded" :disabled="!encodedText.trim() && !jwtDecoded">
                Clear
              </button>
              <button 
                class="btn-secondary" 
                @click="copyEncoded" 
                :disabled="(!encodedText.trim() && !jwtDecoded) || hasError"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                  <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                </svg>
                Copy
              </button>
            </div>
          </div>
          <div class="panel-body">
            <div v-if="selectedType === 'jwt' && jwtDecoded" class="jwt-output">
              <div class="jwt-section">
                <h4>Header</h4>
                <pre class="json-output">{{ JSON.stringify(jwtDecoded.header, null, 2) }}</pre>
              </div>
              <div class="jwt-section">
                <h4>Payload</h4>
                <pre class="json-output">{{ JSON.stringify(jwtDecoded.payload, null, 2) }}</pre>
              </div>
              <div v-if="jwtDecoded.signature" class="jwt-section">
                <h4>Signature</h4>
                <pre class="signature-output">{{ jwtDecoded.signature }}</pre>
              </div>
            </div>
            <textarea
              v-else-if="selectedType !== 'jwt'"
              v-model="encodedText"
              class="text-input"
              :class="{ 'has-error': hasError }"
              :placeholder="encodedPlaceholder"
              spellcheck="false"
              @input="onEncodedChange"
            ></textarea>
            <div v-else-if="hasError" class="error-output">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>{{ errorMessage }}</p>
            </div>
            <div v-else class="empty-output">
              <p>{{ emptyMessage }}</p>
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
import { ref, computed } from 'vue'

interface EncoderType {
  id: string
  label: string
  icon: string
  canEncode: boolean
  canDecode: boolean
}

interface JWTDecoded {
  header: Record<string, any>
  payload: Record<string, any>
  signature: string
}

const encoderTypes: EncoderType[] = [
  { id: 'base64', label: 'Base64', icon: '🔤', canEncode: true, canDecode: true },
  { id: 'url', label: 'URL', icon: '🔗', canEncode: true, canDecode: true },
  { id: 'html', label: 'HTML Entity', icon: '🏷️', canEncode: true, canDecode: true },
  { id: 'jwt', label: 'JWT', icon: '🔐', canEncode: false, canDecode: true }
]

const selectedType = ref('base64')
const decodedText = ref('')
const encodedText = ref('')
const hasError = ref(false)
const errorMessage = ref('')
const toastMessage = ref('')
const jwtDecoded = ref<JWTDecoded | null>(null)
const isUpdating = ref(false) // Prevent infinite loop

const currentType = computed(() => 
  encoderTypes.find(t => t.id === selectedType.value) || encoderTypes[0]
)

const decodedLabel = computed(() => {
  if (selectedType.value === 'jwt') return 'Encoded JWT Token'
  return 'Decoded Text'
})

const encodedLabel = computed(() => {
  if (selectedType.value === 'jwt') return 'Decoded JWT'
  return 'Encoded Text'
})

const decodedPlaceholder = computed(() => {
  switch (selectedType.value) {
    case 'base64':
      return 'Enter plain text here, will encode automatically...'
    case 'url':
      return 'Enter plain text here, will URL encode automatically...'
    case 'html':
      return 'Enter plain text here, will encode HTML entities automatically...'
    case 'jwt':
      return 'Paste JWT token here to decode...'
    default:
      return 'Enter plain text...'
  }
})

const encodedPlaceholder = computed(() => {
  switch (selectedType.value) {
    case 'base64':
      return 'Enter Base64 encoded text here, will decode automatically...'
    case 'url':
      return 'Enter URL encoded text here, will decode automatically...'
    case 'html':
      return 'Enter HTML entities here, will decode automatically...'
    default:
      return 'Encoded text will appear here...'
  }
})

const emptyMessage = computed(() => {
  if (selectedType.value === 'jwt') {
    return 'Decoded JWT will appear here...'
  }
  return 'Encoded text will appear here...'
})

const selectType = (typeId: string) => {
  selectedType.value = typeId
  clearAll()
}

const clearDecoded = () => {
  decodedText.value = ''
  encodedText.value = ''
  hasError.value = false
  errorMessage.value = ''
  jwtDecoded.value = null
}

const clearEncoded = () => {
  encodedText.value = ''
  decodedText.value = ''
  hasError.value = false
  errorMessage.value = ''
  jwtDecoded.value = null
}

const clearAll = () => {
  decodedText.value = ''
  encodedText.value = ''
  hasError.value = false
  errorMessage.value = ''
  jwtDecoded.value = null
}

// When decoded text changes, encode it
const onDecodedChange = () => {
  if (isUpdating.value) return
  
  hasError.value = false
  errorMessage.value = ''
  jwtDecoded.value = null
  
  if (!decodedText.value) {
    encodedText.value = ''
    return
  }
  
  isUpdating.value = true
  
  try {
    switch (selectedType.value) {
      case 'base64':
        encodedText.value = btoa(decodedText.value)
        break
      case 'url':
        encodedText.value = encodeURIComponent(decodedText.value)
        break
      case 'html':
        encodedText.value = encodeHTMLEntities(decodedText.value)
        break
      default:
        encodedText.value = ''
    }
  } catch (error) {
    hasError.value = true
    errorMessage.value = `Encoding failed: ${(error as Error).message}`
    encodedText.value = ''
  } finally {
    isUpdating.value = false
  }
}

// When encoded text changes, decode it
const onEncodedChange = () => {
  if (isUpdating.value) return
  
  hasError.value = false
  errorMessage.value = ''
  jwtDecoded.value = null
  
  if (!encodedText.value) {
    if (selectedType.value !== 'jwt') {
      decodedText.value = ''
    }
    return
  }
  
  isUpdating.value = true
  
  try {
    switch (selectedType.value) {
      case 'base64':
        decodedText.value = atob(encodedText.value.trim())
        break
      case 'url':
        decodedText.value = decodeURIComponent(encodedText.value)
        break
      case 'html':
        decodedText.value = decodeHTMLEntities(encodedText.value)
        break
      case 'jwt':
        decodeJWT(encodedText.value.trim())
        break
      default:
        decodedText.value = ''
    }
  } catch (error) {
    hasError.value = true
    errorMessage.value = `Decoding failed: ${(error as Error).message}`
    if (selectedType.value !== 'jwt') {
      decodedText.value = ''
    }
  } finally {
    isUpdating.value = false
  }
}

const encodeHTMLEntities = (text: string): string => {
  const element = document.createElement('div')
  element.innerText = text
  return element.innerHTML
}

const decodeHTMLEntities = (html: string): string => {
  const element = document.createElement('div')
  element.innerHTML = html
  return element.innerText
}

const decodeJWT = (token: string) => {
  try {
    const parts = token.split('.')
    
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format. JWT must have 3 parts separated by dots.')
    }
    
    const [headerB64, payloadB64, signatureB64] = parts
    
    // Decode header
    const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')))
    
    // Decode payload
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')))
    
    jwtDecoded.value = {
      header,
      payload,
      signature: signatureB64
    }
  } catch (error) {
    throw new Error(`Invalid JWT token: ${(error as Error).message}`)
  }
}

const copyDecoded = async () => {
  const textToCopy = selectedType.value === 'jwt' ? encodedText.value : decodedText.value
  if (!textToCopy.trim()) return

  try {
    await navigator.clipboard.writeText(textToCopy)
    toastMessage.value = 'Copied to clipboard!'
  } catch (err) {
    toastMessage.value = 'Failed to copy.'
  } finally {
    setTimeout(() => {
      toastMessage.value = ''
    }, 2000)
  }
}

const copyEncoded = async () => {
  if (hasError.value) return

  try {
    let textToCopy = encodedText.value
    
    if (selectedType.value === 'jwt' && jwtDecoded.value) {
      textToCopy = JSON.stringify({
        header: jwtDecoded.value.header,
        payload: jwtDecoded.value.payload,
        signature: jwtDecoded.value.signature
      }, null, 2)
    }
    
    if (!textToCopy.trim() && !jwtDecoded.value) return
    
    await navigator.clipboard.writeText(textToCopy)
    toastMessage.value = 'Copied to clipboard!'
  } catch (err) {
    toastMessage.value = 'Failed to copy.'
  } finally {
    setTimeout(() => {
      toastMessage.value = ''
    }, 2000)
  }
}
</script>

<style scoped>
/* Using VitePress native CSS variables */
.encoder-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 100vh;
}

.encoder-header {
  text-align: center;
  margin-bottom: 3rem;
}

.encoder-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.encoder-header p {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
}

.encoder-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.type-selector {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.type-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 92%, rgba(255, 255, 255, 0.05));
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

.type-button::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(circle at top left, color-mix(in srgb, var(--vp-c-brand-1) 65%, transparent) 0%, transparent 65%);
  transition: opacity 0.3s ease;
}

.type-button:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 30%, var(--vp-c-divider));
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.type-button.active {
  border-color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 15%, var(--vp-c-bg-soft));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.type-button.active::after {
  opacity: 0;
}

.type-button:focus-visible {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 25%, transparent);
}

.type-icon {
  font-size: 1.25rem;
}

.type-label {
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
}

.panels-wrapper {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
  align-items: stretch;
}

@media (max-width: 1024px) {
  .panels-wrapper {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.panel {
  display: flex;
  flex-direction: column;
  min-height: 500px;
  gap: 1rem;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.panel-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-body {
  flex: 1;
  display: flex;
}

.text-input,
.text-output,
.json-output,
.signature-output,
.empty-output,
.error-output {
  flex: 1;
  padding: 1rem 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  box-shadow: var(--vp-shadow-1);
}

.text-input {
  width: 100%;
  resize: vertical;
  min-height: 100%;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.text-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
}

.text-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--vp-c-bg-alt);
}

.text-input.has-error {
  border-color: #e53e3e;
}

.text-output,
.json-output,
.signature-output {
  margin: 0;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.jwt-output {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  overflow-y: auto;
}

.jwt-section {
  padding: 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
}

.jwt-section h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-brand-1);
}

.empty-output {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-alt);
}

.empty-output p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.error-output {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: color-mix(in srgb, #e53e3e 10%, var(--vp-c-bg-alt));
  border-color: #e53e3e;
}

.error-output svg {
  stroke: #e53e3e;
}

.error-output p {
  margin: 0;
  color: #e53e3e;
  font-weight: 600;
  text-align: center;
}

.panel-header button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 40px;
}

.panel-header button svg {
  flex-shrink: 0;
}

.btn-primary,
.btn-secondary,
.btn-error {
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

.btn-primary:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}

.btn-secondary {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--vp-c-bg-soft);
}

.btn-error {
  background: color-mix(in srgb, #e53e3e 15%, var(--vp-c-bg-alt));
  color: #e53e3e;
  border: 1px solid #e53e3e;
}

.btn-primary:disabled,
.btn-secondary:disabled,
.btn-error:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  z-index: 1000;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
</style>

