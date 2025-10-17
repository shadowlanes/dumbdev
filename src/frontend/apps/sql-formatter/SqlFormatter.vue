<template>
  <div class="formatter-container">
    <div class="formatter-header">
      <h1>SQL Formatter</h1>
      <p>Format SQL queries for better readability. Supports MySQL, PostgreSQL, and SQL Server dialects.</p>
    </div>

    <div class="formatter-controls">
      <div class="control-group">
        <label class="control-label">SQL Dialect</label>
        <select v-model="selectedDialect" class="dialect-select">
          <option value="mysql">MySQL</option>
          <option value="postgresql">PostgreSQL</option>
          <option value="sql">SQL Server</option>
        </select>
      </div>
    </div>

    <div class="formatter-layout">
      <div class="input-section">
        <div class="section-header">
          <h3>Input SQL</h3>
          <button class="btn-secondary" @click="clearInput" :disabled="!inputSql.trim()">
            Clear
          </button>
        </div>
        <textarea
          v-model="inputSql"
          class="sql-input"
          placeholder="Paste or type your SQL query here..."
          spellcheck="false"
        ></textarea>
      </div>

      <div class="output-section">
        <div class="section-header">
          <h3>Formatted SQL</h3>
          <button class="btn-secondary" @click="copyOutput" :disabled="!formattedSql.trim()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
              <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
            Copy
          </button>
        </div>
        <pre class="sql-output" v-if="formattedSql">{{ formattedSql }}</pre>
        <div v-else class="empty-output">
          <p>Formatted SQL will appear here...</p>
        </div>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { format } from 'sql-formatter'

type SqlDialect = 'mysql' | 'postgresql' | 'sql'

const selectedDialect = ref<SqlDialect>('mysql')
const inputSql = ref('')
const toastMessage = ref('')

const formattedSql = computed(() => {
  if (!inputSql.value.trim()) return ''

  try {
    return format(inputSql.value, {
      language: selectedDialect.value,
      tabWidth: 2,
      useTabs: false,
      keywordCase: 'upper',
      linesBetweenQueries: 2
    })
  } catch (error) {
    console.error('SQL formatting error:', error)
    return inputSql.value // Return original if formatting fails
  }
})

watch([inputSql, selectedDialect], () => {
  // Auto-format happens via computed property
})

function clearInput() {
  inputSql.value = ''
}

function copyOutput() {
  if (!formattedSql.value) return

  navigator.clipboard.writeText(formattedSql.value).then(() => {
    showToast('Formatted SQL copied to clipboard!')
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
.formatter-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 100vh;
}

.formatter-header {
  text-align: center;
  margin-bottom: 3rem;
}

.formatter-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.formatter-header p {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
}

.formatter-controls {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.dialect-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  min-width: 150px;
}

.formatter-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

@media (max-width: 1024px) {
  .formatter-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.input-section, .output-section {
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.sql-input {
  flex: 1;
  min-height: 400px;
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s ease;
}

.sql-input:focus {
  border-color: var(--vp-c-brand-1);
}

.sql-output {
  flex: 1;
  min-height: 400px;
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
}

.empty-output {
  flex: 1;
  min-height: 400px;
  padding: 2rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-output p {
  color: var(--vp-c-text-2);
  font-style: italic;
  margin: 0;
}

.btn-primary, .btn-secondary {
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

.btn-secondary:disabled {
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