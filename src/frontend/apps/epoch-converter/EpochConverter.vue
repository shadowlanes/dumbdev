<template>
  <div class="converter-container">
    <div class="converter-header">
      <h1>Epoch Time Converter</h1>
      <p>Convert epoch timestamps to human-readable dates. Supports seconds, milliseconds, and nanoseconds.</p>
    </div>

    <div class="converter-layout">
      <div class="input-section">
        <div class="input-header">
          <h3>Epoch Timestamp</h3>
          <button 
            v-if="epochInput" 
            class="btn-share" 
            @click="shareEpochTime"
            title="Share this timestamp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            Share
          </button>
        </div>
        <input
          v-model="epochInput"
          type="text"
          class="epoch-input"
          placeholder=""
          spellcheck="false"
        />
        <div class="format-hint">
          Enter timestamp in seconds, milliseconds, or nanoseconds
        </div>
      </div>

      <div v-if="epochInput && convertedDate" class="result-section">
        <div class="two-pane-layout">
          <div class="result-box">
            <h3>📅 Converted Time</h3>
            <div class="result-grid">
              <div class="result-item highlighted">
                <span class="result-label">Human Readable (UTC)</span>
                <div class="value-with-copy">
                  <span class="result-value">{{ convertedDate.readable }}</span>
                  <button 
                    class="btn-copy" 
                    @click="copyToClipboard(convertedDate.readable)"
                    title="Copy to clipboard"
                  >
                    <CopyIcon />
                  </button>
                </div>
              </div>
              <div class="result-item">
                <span class="result-label">ISO-8601 (UTC)</span>
                <div class="value-with-copy">
                  <span class="result-value">{{ convertedDate.iso }}</span>
                  <button 
                    class="btn-copy" 
                    @click="copyToClipboard(convertedDate.iso)"
                    title="Copy to clipboard"
                  >
                    <CopyIcon />
                  </button>
                </div>
              </div>
              <div class="result-item">
                <span class="result-label">Local Time</span>
                <div class="value-with-copy">
                  <span class="result-value">{{ convertedDate.local }}</span>
                  <button 
                    class="btn-copy" 
                    @click="copyToClipboard(convertedDate.local)"
                    title="Copy to clipboard"
                  >
                    <CopyIcon />
                  </button>
                </div>
              </div>
              <div class="result-item">
                <span class="result-label">Detected Format</span>
                <div class="value-with-copy">
                  <span class="result-value">{{ detectedFormat }}</span>
                  <button 
                    class="btn-copy" 
                    @click="copyToClipboard(detectedFormat)"
                    title="Copy to clipboard"
                  >
                    <CopyIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="current-time-box">
            <h3>⏰ Current Time</h3>
            <div class="time-display">
              <div class="time-item">
                <span class="time-label">UTC</span>
                <div class="value-with-copy">
                  <span class="time-value">{{ currentEpoch.utc }}</span>
                  <button 
                    class="btn-copy" 
                    @click="copyToClipboard(currentEpoch.utc)"
                    title="Copy to clipboard"
                  >
                    <CopyIcon />
                  </button>
                </div>
              </div>
              <div class="time-item">
                <span class="time-label">Epoch (seconds)</span>
                <div class="value-with-copy">
                  <span class="time-value">{{ currentEpoch.seconds }}</span>
                  <button 
                    class="btn-copy" 
                    @click="copyToClipboard(currentEpoch.seconds.toString())"
                    title="Copy to clipboard"
                  >
                    <CopyIcon />
                  </button>
                </div>
              </div>
              <div class="time-item">
                <span class="time-label">Epoch (milliseconds)</span>
                <div class="value-with-copy">
                  <span class="time-value">{{ currentEpoch.milliseconds }}</span>
                  <button 
                    class="btn-copy" 
                    @click="copyToClipboard(currentEpoch.milliseconds.toString())"
                    title="Copy to clipboard"
                  >
                    <CopyIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="relative-time-box">
          <h3>🕐 Relative Time</h3>
          <p class="relative-time-text">{{ relativeTime }}</p>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>Enter an epoch timestamp above to see the conversion.</p>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import CopyIcon from './CopyIcon.vue'

const epochInput = ref('')
const toastMessage = ref('')
const currentTime = ref(new Date())
let intervalId: number | null = null

// Auto-fill current epoch time on mount
onMounted(() => {
  // Check for query parameter first
  const urlParams = new URLSearchParams(window.location.search)
  const epochParam = urlParams.get('epoch')
  
  if (epochParam) {
    epochInput.value = epochParam
  } else {
    epochInput.value = Math.floor(Date.now() / 1000).toString()
  }
  
  intervalId = window.setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})

const currentEpoch = computed(() => {
  const now = currentTime.value
  return {
    seconds: Math.floor(now.getTime() / 1000),
    milliseconds: now.getTime(),
    utc: now.toISOString()
  }
})

const detectedFormat = computed(() => {
  if (!epochInput.value) return ''
  
  const value = epochInput.value.trim()
  const num = parseInt(value)
  
  if (isNaN(num)) return 'Invalid'
  
  const length = value.length
  
  if (length <= 10) {
    return 'Seconds'
  } else if (length <= 13) {
    return 'Milliseconds'
  } else {
    return 'Nanoseconds'
  }
})

const convertedDate = computed(() => {
  if (!epochInput.value) return null
  
  const value = epochInput.value.trim()
  const num = parseInt(value)
  
  if (isNaN(num)) return null
  
  let timestamp: number
  const length = value.length
  
  // Detect format and convert to milliseconds
  if (length <= 10) {
    // Seconds
    timestamp = num * 1000
  } else if (length <= 13) {
    // Milliseconds
    timestamp = num
  } else {
    // Nanoseconds
    timestamp = num / 1000000
  }
  
  const date = new Date(timestamp)
  
  // Check if date is valid
  if (isNaN(date.getTime())) return null
  
  return {
    iso: date.toISOString(),
    readable: date.toUTCString(),
    local: date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }),
    timestamp: date.getTime()
  }
})

const relativeTime = computed(() => {
  if (!convertedDate.value) return ''
  
  const now = currentTime.value.getTime()
  const then = convertedDate.value.timestamp
  const diffMs = now - then
  const isPast = diffMs > 0
  const absDiff = Math.abs(diffMs)
  
  const seconds = Math.floor(absDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  
  let timeStr = ''
  
  if (years > 0) {
    timeStr = `${years} year${years > 1 ? 's' : ''}`
    const remainingMonths = months % 12
    if (remainingMonths > 0) {
      timeStr += ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`
    }
  } else if (months > 0) {
    timeStr = `${months} month${months > 1 ? 's' : ''}`
    const remainingDays = days % 30
    if (remainingDays > 0) {
      timeStr += ` ${remainingDays} day${remainingDays > 1 ? 's' : ''}`
    }
  } else if (weeks > 0) {
    timeStr = `${weeks} week${weeks > 1 ? 's' : ''}`
    const remainingDays = days % 7
    if (remainingDays > 0) {
      timeStr += ` ${remainingDays} day${remainingDays > 1 ? 's' : ''}`
    }
  } else if (days > 0) {
    timeStr = `${days} day${days > 1 ? 's' : ''}`
    const remainingHours = hours % 24
    if (remainingHours > 0) {
      timeStr += ` ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`
    }
  } else if (hours > 0) {
    timeStr = `${hours} hour${hours > 1 ? 's' : ''}`
    const remainingMinutes = minutes % 60
    if (remainingMinutes > 0) {
      timeStr += ` ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`
    }
  } else if (minutes > 0) {
    timeStr = `${minutes} minute${minutes > 1 ? 's' : ''}`
    const remainingSeconds = seconds % 60
    if (remainingSeconds > 0) {
      timeStr += ` ${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}`
    }
  } else {
    timeStr = `${seconds} second${seconds !== 1 ? 's' : ''}`
  }
  
  return isPast ? `${timeStr} ago` : `${timeStr} in the future`
})

function shareEpochTime() {
  if (!epochInput.value) return

  const url = new URL(window.location.href)
  url.searchParams.set('epoch', epochInput.value)
  const shareUrl = url.toString()

  navigator.clipboard.writeText(shareUrl).then(() => {
    showToast('Share link copied to clipboard!')
  }).catch(() => {
    showToast('Failed to copy share link')
  })
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard!')
  }).catch(() => {
    showToast('Failed to copy')
  })
}

function showToast(message: string) {
  toastMessage.value = message
  setTimeout(() => {
    toastMessage.value = ''
  }, 2000)
}
</script>

<style scoped>
/* Using VitePress native CSS variables */
.converter-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 100vh;
}

.converter-header {
  text-align: center;
  margin-bottom: 3rem;
}

.converter-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.converter-header p {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
}

.converter-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-bottom: 0.5rem;
}

.input-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.btn-share {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1.5px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-share:hover {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-share:active {
  transform: scale(0.98);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-share svg {
  flex-shrink: 0;
  transition: stroke 0.2s ease;
}

.btn-share:hover svg {
  stroke: white;
}

.epoch-input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 1.125rem;
  line-height: 1.6;
  box-shadow: var(--vp-shadow-1);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.epoch-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
}

.format-hint {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.result-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.two-pane-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.current-time-box,
.result-box,
.relative-time-box {
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  box-shadow: var(--vp-shadow-1);
}

.current-time-box h3,
.result-box h3,
.relative-time-box h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.time-display,
.result-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.time-item,
.result-item {
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
}

.time-item.highlighted,
.result-item.highlighted {
  border: 2px solid var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  box-shadow: 0 0 0 3px rgba(var(--vp-c-brand-rgb), 0.1);
}

.time-label,
.result-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2);
}

.time-value,
.result-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  word-break: break-all;
}

.value-with-copy {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.btn-copy,
.btn-copy-large {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1.5px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-copy:hover,
.btn-copy-large:hover {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-copy:active,
.btn-copy-large:active {
  transform: scale(0.95);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-copy-large {
  padding: 0.625rem;
}

.btn-copy svg,
.btn-copy-large svg {
  display: block;
  transition: all 0.2s ease;
}

.btn-copy:hover svg,
.btn-copy-large:hover svg {
  stroke: white;
}

.relative-time-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.relative-time-header h3 {
  margin: 0;
}

.relative-time-text {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-align: center;
}

.empty-state {
  padding: 3rem 2rem;
  text-align: center;
  border: 2px dashed var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-alt);
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
  color: var(--vp-c-text-2);
  font-style: italic;
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

@media (max-width: 768px) {
  .two-pane-layout {
    grid-template-columns: 1fr;
  }

  .result-grid {
    grid-template-columns: 1fr;
  }
}
</style>
