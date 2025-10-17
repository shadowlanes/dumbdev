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
      <div class="panel input-panel">
        <div class="panel-header">
          <h3>Input SQL</h3>
          <button class="btn-secondary" @click="clearInput" :disabled="!inputSql.trim()">
            Clear
          </button>
        </div>
        <div class="panel-body">
          <textarea
            v-model="inputSql"
            class="sql-input"
            placeholder="Paste or type your SQL query here..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>

      <div class="panel output-panel">
        <div class="panel-header">
          <h3>Formatted SQL</h3>
          <button class="btn-secondary" @click="copyOutput" :disabled="!formattedSql.trim()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
              <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
            Copy
          </button>
        </div>
        <div class="panel-body">
          <pre class="sql-output" v-if="formattedSql">{{ formattedSql }}</pre>
          <div v-else class="empty-output">
            <p>Formatted SQL will appear here...</p>
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
    return inputSql.value
  }
})

watch([inputSql, selectedDialect], () => {
  // reactive dependencies trigger computed formatter
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
  min-width: 160px;
}

.formatter-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
  align-items: stretch;
}

@media (max-width: 1024px) {
  .formatter-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.panel {
  display: flex;
  flex-direction: column;
  min-height: 520px;
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

.panel-body {
  flex: 1;
  display: flex;
}

.sql-input,
.sql-output,
.empty-output {
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

.sql-input {
  width: 100%;
  resize: vertical;
  min-height: 100%;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.sql-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
}

.sql-output {
  margin: 0;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
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
.btn-secondary {
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