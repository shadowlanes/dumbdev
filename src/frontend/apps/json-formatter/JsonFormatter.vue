<template>
  <div class="formatter-container">
    <div class="formatter-header">
      <h1>JSON Formatter</h1>
      <p>Format JSON strings for better readability with Monaco Editor. Invalid JSON will be indicated by linting errors.</p>
    </div>

    <div class="formatter-layout">
      <div class="panel input-panel">
        <div class="panel-header">
          <h3>Input JSON</h3>
          <div class="header-controls">
            <span v-if="hasErrors" class="error-indicator" :title="errorMessage"></span>
            <button class="btn-secondary" @click="clearInput" :disabled="!inputJson.trim()">
              Clear
            </button>
          </div>
        </div>
        <div class="panel-body">
          <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading editor...</p>
          </div>
          <div v-else ref="inputEditorContainer" class="monaco-editor-container"></div>
        </div>
      </div>

      <div class="panel output-panel">
        <div class="panel-header">
          <h3>Formatted JSON</h3>
          <button class="btn-secondary" @click="copyOutput" :disabled="!formattedJson.trim()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
              <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
            Copy
          </button>
        </div>
        <div class="panel-body">
          <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading editor...</p>
          </div>
          <div v-else ref="outputEditorContainer" class="monaco-editor-container"></div>
        </div>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

// Monaco Editor types
type MonacoEditor = typeof import('monaco-editor')
type IStandaloneCodeEditor = import('monaco-editor').editor.IStandaloneCodeEditor

// Monaco Environment type declaration
declare global {
  interface Window {
    MonacoEnvironment?: {
      getWorker: (moduleId: string, label: string) => Worker
    }
  }
}

const inputJson = ref('')
const formattedJson = ref('')
const hasErrors = ref(false)
const errorMessage = ref('')
const toastMessage = ref('')
const isLoading = ref(true)

const inputEditorContainer = ref<HTMLElement | null>(null)
const outputEditorContainer = ref<HTMLElement | null>(null)
let inputEditor: IStandaloneCodeEditor | null = null
let outputEditor: IStandaloneCodeEditor | null = null
let monaco: MonacoEditor | null = null

const getIndentString = (): string => {
  return '  ' // 2 spaces
}

const formatJson = () => {
  const content = inputJson.value.trim()
  
  if (!content) {
    formattedJson.value = ''
    hasErrors.value = false
    errorMessage.value = ''
    if (outputEditor) {
      outputEditor.setValue('')
    }
    return
  }

  try {
    const parsed = JSON.parse(content)
    const indentStr = getIndentString()
    formattedJson.value = JSON.stringify(parsed, null, indentStr)
    hasErrors.value = false
    errorMessage.value = ''
    
    if (outputEditor) {
      outputEditor.setValue(formattedJson.value)
    }
  } catch (error) {
    hasErrors.value = true
    errorMessage.value = error instanceof Error ? error.message : 'Invalid JSON'
    // Keep the last valid formatted output
  }
}

watch(inputJson, formatJson, { immediate: true })

const clearInput = () => {
  inputJson.value = ''
  formattedJson.value = ''
  hasErrors.value = false
  errorMessage.value = ''
  if (inputEditor) {
    inputEditor.setValue('')
  }
  if (outputEditor) {
    outputEditor.setValue('')
  }
}

const copyOutput = async () => {
  if (!formattedJson.value.trim()) return

  try {
    await navigator.clipboard.writeText(formattedJson.value)
    toastMessage.value = 'Copied to clipboard!'
  } catch (err) {
    toastMessage.value = 'Failed to copy.'
  } finally {
    setTimeout(() => {
      toastMessage.value = ''
    }, 2000)
  }
}

const initializeEditors = async () => {
  try {
    isLoading.value = true
    
    // Dynamically load Monaco Editor
    const monacoModule = await import('monaco-editor')
    monaco = monacoModule
    
    await nextTick()

    if (!inputEditorContainer.value || !outputEditorContainer.value) {
      return
    }

    // Configure Monaco Editor workers for Vite
    if (!window.MonacoEnvironment) {
      window.MonacoEnvironment = {
        getWorker: function (moduleId: string, label: string) {
          // Dynamically import workers when needed
          if (label === 'json') {
            return new Worker(
              new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url),
              { type: 'module' }
            )
          }
          return new Worker(
            new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url),
            { type: 'module' }
          )
        }
      }
    }

    // Configure Monaco Editor theme to match VitePress
    const isDark = document.documentElement.classList.contains('dark') || 
                   window.matchMedia('(prefers-color-scheme: dark)').matches

    monaco.editor.defineTheme('vitepress-theme', {
      base: isDark ? 'vs-dark' : 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': isDark ? '#1e1e1e' : '#ffffff',
        'editor.foreground': isDark ? '#d4d4d4' : '#333333',
      }
    })

    monaco.editor.setTheme('vitepress-theme')

  // Input editor configuration
  inputEditor = monaco.editor.create(inputEditorContainer.value, {
    value: inputJson.value,
    language: 'json',
    theme: 'vitepress-theme',
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    lineNumbers: 'on',
    folding: true,
    foldingStrategy: 'indentation',
    showFoldingControls: 'always',
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: false,
    formatOnPaste: true,
    suggestOnTriggerCharacters: false,
    quickSuggestions: {
      other: false,
      comments: false,
      strings: false
    },
    parameterHints: { enabled: false },
    occurrencesHighlight: 'off',
    selectionHighlight: false,
    renderWhitespace: 'selection',
    fontSize: 14,
    lineHeight: 22,
    padding: { top: 12, bottom: 12 }
  })

  // Output editor configuration (read-only)
  outputEditor = monaco.editor.create(outputEditorContainer.value, {
    value: formattedJson.value,
    language: 'json',
    theme: 'vitepress-theme',
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    lineNumbers: 'on',
    folding: true,
    foldingStrategy: 'indentation',
    showFoldingControls: 'always',
    readOnly: true,
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: false,
    renderWhitespace: 'selection',
    fontSize: 14,
    lineHeight: 22,
    padding: { top: 12, bottom: 12 }
  })

  // Listen to input editor changes
  inputEditor.onDidChangeModelContent(() => {
    const value = inputEditor?.getValue() || ''
    inputJson.value = value
  })

    // Configure JSON language features
    if (monaco.languages.json && 'jsonDefaults' in monaco.languages.json) {
      const jsonDefaults = (monaco.languages.json as any).jsonDefaults
      if (jsonDefaults && typeof jsonDefaults.setDiagnosticsOptions === 'function') {
        jsonDefaults.setDiagnosticsOptions({
          validate: true,
          allowComments: false,
          schemas: [],
          enableSchemaRequest: false
        })
      }
    }

    // Update theme when system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = (e: MediaQueryListEvent) => {
      monaco?.editor.setTheme(e.matches ? 'vs-dark' : 'vs')
    }
    mediaQuery.addEventListener('change', handleThemeChange)
    
    isLoading.value = false
  } catch (error) {
    console.error('Failed to load Monaco Editor:', error)
    isLoading.value = false
    toastMessage.value = 'Failed to load editor. Please refresh the page.'
    setTimeout(() => {
      toastMessage.value = ''
    }, 5000)
  }
}

onMounted(() => {
  initializeEditors()
})

onBeforeUnmount(() => {
  if (inputEditor) {
    inputEditor.dispose()
  }
  if (outputEditor) {
    outputEditor.dispose()
  }
})
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
  margin-bottom: 2rem;
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

.header-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #e53e3e;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.panel-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.monaco-editor-container {
  flex: 1;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--vp-shadow-1);
  min-height: 100%;
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

.loading-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: var(--vp-c-text-2);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

.loading-container p {
  margin: 0;
  font-size: 0.875rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
