<template>
  <div class="validator-container">
    <div class="validator-header">
      <h1>Cron Validator</h1>
      <p>Validate and understand cron expressions with real-time explanations and next run times.</p>
    </div>

    <div class="validator-layout">
      <div class="input-section">
        <div class="input-header">
          <h3>Cron Expression</h3>
          <div class="header-actions">
            <span v-if="cronInput && isValid" class="status-indicator valid" title="Valid cron expression">✓</span>
            <span v-else-if="cronInput && !isValid" class="status-indicator invalid" title="Invalid cron expression">✗</span>
            <button 
              v-if="cronInput && isValid" 
              class="btn-copy" 
              @click="copyCronExpression"
              title="Copy cron expression"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
              Copy
            </button>
          </div>
        </div>
        <input
          v-model="cronInput"
          type="text"
          class="cron-input"
          placeholder="e.g., */5 * * * * or 0 9 * * 1-5"
          spellcheck="false"
        />
        <div class="format-hint">
          Format: minute hour day month day-of-week
        </div>
      </div>

      <div v-if="cronInput" class="result-section">
        <div v-if="isValid" class="valid-result">
          <div class="explanation-box">
            <h3>📋 Explanation</h3>
            <p class="explanation-text">{{ explanation }}</p>
          </div>

          <div class="breakdown-box">
            <h3>🔍 Breakdown</h3>
            <div class="breakdown-grid">
              <div class="breakdown-item">
                <span class="field-label">Minute</span>
                <span class="field-value">{{ breakdown.minute }}</span>
              </div>
              <div class="breakdown-item">
                <span class="field-label">Hour</span>
                <span class="field-value">{{ breakdown.hour }}</span>
              </div>
              <div class="breakdown-item">
                <span class="field-label">Day of Month</span>
                <span class="field-value">{{ breakdown.dayOfMonth }}</span>
              </div>
              <div class="breakdown-item">
                <span class="field-label">Month</span>
                <span class="field-value">{{ breakdown.month }}</span>
              </div>
              <div class="breakdown-item">
                <span class="field-label">Day of Week</span>
                <span class="field-value">{{ breakdown.dayOfWeek }}</span>
              </div>
            </div>
          </div>

          <div class="next-runs-box">
            <h3>⏰ Next Scheduled Runs</h3>
            <ul class="next-runs-list">
              <li v-for="(run, index) in nextRuns" :key="index">
                {{ run }}
              </li>
            </ul>
          </div>
        </div>

        <div v-else class="invalid-result">
          <div class="error-box">
            <h3>❌ Invalid Cron Expression</h3>
            <p class="error-text">{{ errorMessage }}</p>
            <div class="error-details">
              <p><strong>Expected format:</strong></p>
              <code>minute hour day-of-month month day-of-week</code>
              <p class="mt-2"><strong>Examples:</strong></p>
              <ul>
                <li><code>*/5 * * * *</code> - Every 5 minutes</li>
                <li><code>0 9 * * 1-5</code> - At 9 AM on weekdays</li>
                <li><code>0 0 1 * *</code> - At midnight on the 1st of every month</li>
                <li><code>30 14 * * 0</code> - At 2:30 PM every Sunday</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>Enter a cron expression above to see the explanation and next run times.</p>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { isValidCron } from 'cron-validator'

const cronInput = ref('')
const isValid = ref(false)
const errorMessage = ref('')
const explanation = ref('')
const breakdown = ref({
  minute: '',
  hour: '',
  dayOfMonth: '',
  month: '',
  dayOfWeek: ''
})
const nextRuns = ref<string[]>([])
const toastMessage = ref('')

// Parse and validate cron expression
watch(cronInput, (newValue) => {
  if (!newValue.trim()) {
    isValid.value = false
    errorMessage.value = ''
    return
  }

  try {
    // Validate using cron-validator package
    const validationResult = isValidCron(newValue.trim(), { alias: true, allowBlankDay: true })
    
    if (!validationResult) {
      throw new Error('Invalid cron expression. Please check the format and ensure all fields are valid.')
    }

    const parts = newValue.trim().split(/\s+/)
    
    if (parts.length !== 5) {
      throw new Error(`Expected 5 fields, got ${parts.length}. A cron expression should have: minute, hour, day-of-month, month, and day-of-week.`)
    }

    isValid.value = true
    errorMessage.value = ''
    
    // Generate explanation
    explanation.value = generateExplanation(parts)
    
    // Generate breakdown
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts
    breakdown.value = {
      minute: explainField(minute, 'minute'),
      hour: explainField(hour, 'hour'),
      dayOfMonth: explainField(dayOfMonth, 'day-of-month'),
      month: explainField(month, 'month'),
      dayOfWeek: explainField(dayOfWeek, 'day-of-week')
    }
    
    // Calculate next runs
    nextRuns.value = calculateNextRuns(parts)
    
  } catch (error: any) {
    isValid.value = false
    errorMessage.value = error.message || 'Invalid cron expression'
  }
})

function copyCronExpression() {
  if (!cronInput.value || !isValid.value) return

  navigator.clipboard.writeText(cronInput.value).then(() => {
    showToast('Cron expression copied to clipboard!')
  }).catch(() => {
    showToast('Failed to copy to clipboard')
  })
}

function showToast(message: string) {
  toastMessage.value = message
  setTimeout(() => {
    toastMessage.value = ''
  }, 2000)
}

function explainField(field: string, type: string): string {
  if (field === '*') return 'Every ' + type
  if (field === '?') return 'Any ' + type
  
  if (field.includes('/')) {
    const [range, step] = field.split('/')
    if (range === '*') {
      return `Every ${step} ${type}(s)`
    }
    return `Every ${step} ${type}(s) starting from ${range}`
  }
  
  if (field.includes('-')) {
    const [start, end] = field.split('-')
    if (type === 'day-of-week') {
      return `${getDayName(parseInt(start))} through ${getDayName(parseInt(end))}`
    }
    if (type === 'month') {
      return `${getMonthName(parseInt(start))} through ${getMonthName(parseInt(end))}`
    }
    return `${start} through ${end}`
  }
  
  if (field.includes(',')) {
    const values = field.split(',')
    if (type === 'day-of-week') {
      return values.map(v => getDayName(parseInt(v))).join(', ')
    }
    if (type === 'month') {
      return values.map(v => getMonthName(parseInt(v))).join(', ')
    }
    return values.join(', ')
  }
  
  if (type === 'day-of-week') {
    return getDayName(parseInt(field))
  }
  if (type === 'month') {
    return getMonthName(parseInt(field))
  }
  if (type === 'hour') {
    return `${field}:00`
  }
  
  return field
}

function generateExplanation(parts: string[]): string {
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts
  
  let explanation = 'This cron job runs '
  
  // Frequency
  if (minute.includes('/')) {
    const step = minute.split('/')[1]
    explanation += `every ${step} minute(s)`
  } else if (minute === '*') {
    explanation += 'every minute'
  } else {
    explanation += `at minute ${minute}`
  }
  
  // Hour
  if (hour !== '*') {
    if (hour.includes('/')) {
      const step = hour.split('/')[1]
      explanation += ` of every ${step} hour(s)`
    } else if (hour.includes('-')) {
      const [start, end] = hour.split('-')
      explanation += ` between ${start}:00 and ${end}:00`
    } else {
      explanation += ` at ${hour}:00`
    }
  }
  
  // Day of week
  if (dayOfWeek !== '*') {
    if (dayOfWeek.includes('/')) {
      const step = dayOfWeek.split('/')[1]
      explanation += ` on every ${step} day(s) of the week`
    } else if (dayOfWeek.includes('-')) {
      const [start, end] = dayOfWeek.split('-')
      explanation += ` on ${getDayName(parseInt(start))} through ${getDayName(parseInt(end))}`
    } else if (dayOfWeek.includes(',')) {
      const days = dayOfWeek.split(',').map(d => getDayName(parseInt(d))).join(', ')
      explanation += ` on ${days}`
    } else {
      explanation += ` on ${getDayName(parseInt(dayOfWeek))}`
    }
  }
  
  // Day of month
  if (dayOfMonth !== '*' && dayOfWeek === '*') {
    if (dayOfMonth.includes('/')) {
      const step = dayOfMonth.split('/')[1]
      explanation += ` on every ${step} day(s) of the month`
    } else if (dayOfMonth.includes(',')) {
      explanation += ` on day(s) ${dayOfMonth} of the month`
    } else {
      explanation += ` on day ${dayOfMonth} of the month`
    }
  }
  
  // Month
  if (month !== '*') {
    if (month.includes('/')) {
      const step = month.split('/')[1]
      explanation += ` every ${step} month(s)`
    } else if (month.includes('-')) {
      const [start, end] = month.split('-')
      explanation += ` in ${getMonthName(parseInt(start))} through ${getMonthName(parseInt(end))}`
    } else if (month.includes(',')) {
      const months = month.split(',').map(m => getMonthName(parseInt(m))).join(', ')
      explanation += ` in ${months}`
    } else {
      explanation += ` in ${getMonthName(parseInt(month))}`
    }
  }
  
  return explanation + '.'
}

function getDayName(day: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[day] || `Day ${day}`
}

function getMonthName(month: number): string {
  const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December']
  return months[month] || `Month ${month}`
}

function calculateNextRuns(parts: string[]): string[] {
  const [minuteStr, hourStr, dayOfMonthStr, monthStr, dayOfWeekStr] = parts
  const runs: string[] = []
  const now = new Date()
  let current = new Date(now)
  current.setSeconds(0, 0)
  
  // Simple calculation for next 5 runs
  let attempts = 0
  const maxAttempts = 100000 // Prevent infinite loops
  
  while (runs.length < 5 && attempts < maxAttempts) {
    attempts++
    current = new Date(current.getTime() + 60000) // Add 1 minute
    
    if (matchesCron(current, parts)) {
      runs.push(current.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }))
    }
  }
  
  return runs.length > 0 ? runs : ['Unable to calculate next runs for this expression']
}

function matchesCron(date: Date, parts: string[]): boolean {
  const [minuteStr, hourStr, dayOfMonthStr, monthStr, dayOfWeekStr] = parts
  
  const minute = date.getMinutes()
  const hour = date.getHours()
  const dayOfMonth = date.getDate()
  const month = date.getMonth() + 1
  const dayOfWeek = date.getDay()
  
  // Check minute, hour, and month
  const minuteMatch = matchesField(minute, minuteStr, 0, 59)
  const hourMatch = matchesField(hour, hourStr, 0, 23)
  const monthMatch = matchesField(month, monthStr, 1, 12)
  
  // For day of month and day of week, if both are specified (not *), 
  // the cron should run if EITHER matches (OR logic), not both (AND logic)
  const dayOfMonthMatch = matchesField(dayOfMonth, dayOfMonthStr, 1, 31)
  const dayOfWeekMatch = matchesField(dayOfWeek, dayOfWeekStr, 0, 6)
  
  // If both day fields are wildcards, match both
  if ((dayOfMonthStr === '*' || dayOfMonthStr === '?') && (dayOfWeekStr === '*' || dayOfWeekStr === '?')) {
    return minuteMatch && hourMatch && monthMatch
  }
  
  // If only one day field is specified, match that one
  if (dayOfMonthStr === '*' || dayOfMonthStr === '?') {
    return minuteMatch && hourMatch && monthMatch && dayOfWeekMatch
  }
  
  if (dayOfWeekStr === '*' || dayOfWeekStr === '?') {
    return minuteMatch && hourMatch && monthMatch && dayOfMonthMatch
  }
  
  // If both are specified, match if EITHER day condition is true (OR logic)
  return minuteMatch && hourMatch && monthMatch && (dayOfMonthMatch || dayOfWeekMatch)
}

function matchesField(value: number, field: string, min: number, max: number): boolean {
  if (field === '*' || field === '?') return true
  
  if (field.includes('/')) {
    const [range, step] = field.split('/')
    const stepNum = parseInt(step)
    if (range === '*') {
      return value % stepNum === 0
    }
    const rangeNum = parseInt(range)
    return value >= rangeNum && (value - rangeNum) % stepNum === 0
  }
  
  if (field.includes('-')) {
    const [start, end] = field.split('-').map(Number)
    return value >= start && value <= end
  }
  
  if (field.includes(',')) {
    const values = field.split(',').map(Number)
    return values.includes(value)
  }
  
  return value === parseInt(field)
}
</script>

<style scoped>
/* Using VitePress native CSS variables */
.validator-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 100vh;
}

.validator-header {
  text-align: center;
  margin-bottom: 3rem;
}

.validator-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.validator-header p {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
}

.validator-layout {
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.875rem;
}

.status-indicator.valid {
  background-color: #48bb78;
  color: white;
}

.status-indicator.invalid {
  background-color: #e53e3e;
  color: white;
}

.btn-copy {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.btn-copy:hover {
  background: var(--vp-c-bg-soft);
}

.btn-copy svg {
  flex-shrink: 0;
}

.cron-input {
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

.cron-input:focus {
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

.valid-result,
.invalid-result {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.explanation-box,
.breakdown-box,
.next-runs-box,
.error-box {
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  box-shadow: var(--vp-shadow-1);
}

.explanation-box h3,
.breakdown-box h3,
.next-runs-box h3,
.error-box h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.explanation-text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

.breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.breakdown-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
}

.field-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2);
}

.field-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.next-runs-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.next-runs-list li {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
}

.error-box {
  border-color: #e53e3e;
  background: color-mix(in srgb, #e53e3e 5%, var(--vp-c-bg-soft));
}

.error-text {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #e53e3e;
  font-weight: 500;
}

.error-details {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
}

.error-details p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.error-details code {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
}

.error-details ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.error-details li {
  margin: 0.5rem 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
}

.mt-2 {
  margin-top: 0.5rem;
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
  .breakdown-grid {
    grid-template-columns: 1fr;
  }
}
</style>
