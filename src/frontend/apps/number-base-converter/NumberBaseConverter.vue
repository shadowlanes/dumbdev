<template>
  <div class="converter-container">
    <div class="converter-header">
      <h1>Number Base Converter</h1>
      <p>
        Convert numbers between Binary, Octal, Decimal, and Hexadecimal formats
        with real-time validation.
      </p>
    </div>

    <div class="converter-layout">
      <div class="input-grid">
        <!-- Decimal Input -->
        <div class="input-section">
          <div class="input-header">
            <h3>Decimal (Base 10)</h3>
            <span class="base-info">0-9</span>
          </div>
          <div class="input-with-copy">
            <textarea
              v-model="decimalInput"
              class="number-input"
              :class="{ invalid: validationErrors.decimal }"
              placeholder="Enter decimal number (e.g., 255)"
              spellcheck="false"
              @input="(e) => { autoResize(e.target as HTMLTextAreaElement); onDecimalChange(); }"
              ref="decimalInputRef"
              rows="1"
            ></textarea>
            <button
              class="btn-copy"
              @click="copyValue(decimalInput, 'Decimal')"
              :disabled="!decimalInput || !!validationErrors.decimal"
              title="Copy decimal value"
            >
              <CopyIcon />
            </button>
          </div>
          <div v-if="validationErrors.decimal" class="error-message">
            {{ validationErrors.decimal }}
          </div>
          <div v-else class="input-hint">Valid characters: 0-9</div>
        </div>

        <!-- Hexadecimal Input -->
        <div class="input-section">
          <div class="input-header">
            <h3>Hexadecimal (Base 16)</h3>
            <span class="base-info">0-9, A-F</span>
          </div>
          <div class="input-with-copy">
            <textarea
              v-model="hexInput"
              class="number-input"
              :class="{ invalid: validationErrors.hex }"
              placeholder="Enter hex number (e.g., FF, 0xFF, #FF)"
              spellcheck="false"
              @input="(e) => { autoResize(e.target as HTMLTextAreaElement); onHexChange(); }"
              ref="hexInputRef"
              rows="1"
            ></textarea>
            <button
              class="btn-copy"
              @click="copyValue(hexInput, 'Hexadecimal')"
              :disabled="!hexInput || !!validationErrors.hex"
              title="Copy hexadecimal value"
            >
              <CopyIcon />
            </button>
          </div>
          <div v-if="validationErrors.hex" class="error-message">
            {{ validationErrors.hex }}
          </div>
          <div v-else class="input-hint">
            Valid characters: 0-9, A-F (case insensitive). Supports 0x or #
            prefix.
          </div>
        </div>

        <!-- Binary Input -->
        <div class="input-section binary-input-section">
          <div class="input-header">
            <h3>Binary (Base 2)</h3>
            <span class="base-info">0-1</span>
          </div>
          <div class="input-with-copy binary-input-wrapper">
            <div
              class="binary-input-container"
              :class="{ 'has-overlay': bitInspectorEnabled && hasValidBinary }"
            >
              <textarea
                v-model="binaryInput"
                class="number-input"
                :class="{
                  invalid: validationErrors.binary,
                  'with-overlay': bitInspectorEnabled && hasValidBinary,
                }"
                placeholder="Enter binary number (e.g., 1010)"
                spellcheck="false"
                @input="(e) => { autoResize(e.target as HTMLTextAreaElement); onBinaryChange(); }"
                ref="binaryInputRef"
                rows="1"
              ></textarea>
              <div
                v-if="
                  hasValidBinary &&
                  binaryDisplay.length > 0 &&
                  bitInspectorEnabled
                "
                class="binary-overlay"
                :style="{ height: binaryOverlayHeight }"
              >
                <span
                  v-for="(bit, index) in binaryDisplay"
                  :key="index"
                  :class="[
                    'bit-overlay-char',
                    {
                      'bit-highlighted':
                        bitInspectorEnabled &&
                        bitPosition !== null &&
                        index === highlightedBitIndex &&
                        bitPosition < binaryLength,
                      'bit-out-of-range':
                        bitInspectorEnabled &&
                        bitPosition !== null &&
                        bitPosition >= binaryLength,
                    },
                  ]"
                >
                  {{ bit }}
                </span>
              </div>
            </div>
            <button
              class="btn-copy"
              @click="copyValue(binaryInput, 'Binary')"
              :disabled="!binaryInput || !!validationErrors.binary"
              title="Copy binary value"
            >
              <CopyIcon />
            </button>
          </div>
          <div v-if="validationErrors.binary" class="error-message">
            {{ validationErrors.binary }}
          </div>
          <div v-else class="input-hint">Valid characters: 0, 1</div>

          <!-- Bit Inspector Toggle -->
          <div v-if="hasValidBinary" class="bit-inspector-toggle">
            <label class="toggle-label">
              <span class="toggle-text">Enable Bit Inspector</span>
              <input
                type="checkbox"
                v-model="bitInspectorEnabled"
                class="toggle-checkbox"
              />
              <span class="toggle-switch"></span>
            </label>
          </div>

          <!-- Bit Inspector -->
          <div
            v-if="hasValidBinary && bitInspectorEnabled"
            class="bit-inspector-integrated"
          >
            <div class="bit-inspector-content">
              <div class="bit-order-control">
                <label>Bit Order:</label>
                <div class="bit-order-toggle">
                  <button
                    type="button"
                    class="bit-order-button"
                    :class="{ active: bitOrder === 'MSB' }"
                    @click="bitOrder = 'MSB'"
                  >
                    MSB
                  </button>
                  <button
                    type="button"
                    class="bit-order-button"
                    :class="{ active: bitOrder === 'LSB' }"
                    @click="bitOrder = 'LSB'"
                  >
                    LSB
                  </button>
                </div>
              </div>
              <div class="bit-position-control">
                <label for="bit-position"
                  >Inspect Bit Position (0 = {{ bitOrder }}):</label
                >
                <input
                  id="bit-position"
                  v-model.number="bitPosition"
                  type="number"
                  min="0"
                  class="bit-input"
                  placeholder="Enter bit position"
                />
              </div>

              <!-- Bit Information -->
              <div
                v-if="bitPosition !== null && bitPosition >= 0"
                class="bit-info"
              >
                <div v-if="bitPosition < binaryLength" class="bit-info-content">
                  <div class="bit-info-item">
                    <span class="bit-info-label"
                      >Bit {{ bitPosition }} Value:</span
                    >
                    <span class="bit-info-value">{{ bitValue }}</span>
                  </div>
                  <div class="bit-info-item">
                    <span class="bit-info-label">Represents:</span>
                    <span class="bit-info-value"
                      >2<sup>{{ bitPower }}</sup> =
                      {{ bitPower !== null ? Math.pow(2, bitPower) : "" }}</span
                    >
                  </div>
                  <div
                    class="bit-info-item"
                    :class="{ 'bit-set': bitValue === '1' }"
                  >
                    <span class="bit-info-label">{{
                      bitValue === "1" ? "✓ Bit is SET" : "○ Bit is CLEAR"
                    }}</span>
                  </div>
                </div>
                <div v-else class="bit-error">
                  Bit position {{ bitPosition }} is out of range. Valid range: 0
                  to {{ binaryLength - 1 }}
                </div>
              </div>
              <div
                v-else-if="bitPosition !== null && bitPosition < 0"
                class="bit-error"
              >
                Bit position must be 0 or greater
              </div>
            </div>
          </div>
        </div>

        <!-- Octal Input -->
        <div class="input-section">
          <div class="input-header">
            <h3>Octal (Base 8)</h3>
            <span class="base-info">0-7</span>
          </div>
          <div class="input-with-copy">
            <textarea
              v-model="octalInput"
              class="number-input"
              :class="{ invalid: validationErrors.octal }"
              placeholder="Enter octal number (e.g., 755, 0o755, 0755)"
              spellcheck="false"
              @input="(e) => { autoResize(e.target as HTMLTextAreaElement); onOctalChange(); }"
              ref="octalInputRef"
              rows="1"
            ></textarea>
            <button
              class="btn-copy"
              @click="copyValue(octalInput, 'Octal')"
              :disabled="!octalInput || !!validationErrors.octal"
              title="Copy octal value"
            >
              <CopyIcon />
            </button>
          </div>
          <div v-if="validationErrors.octal" class="error-message">
            {{ validationErrors.octal }}
          </div>
          <div v-else class="input-hint">
            Valid characters: 0-7. Supports 0o prefix or leading 0.
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
import { ref, computed, watch, nextTick } from "vue";
import CopyIcon from "../epoch-converter/CopyIcon.vue";

const binaryInput = ref("");
const octalInput = ref("");
const decimalInput = ref("");
const hexInput = ref("");
const toastMessage = ref("");
const isUpdating = ref(false);
const bitInspectorEnabled = ref(false);
const bitOrder = ref<"MSB" | "LSB">("MSB");
const bitPosition = ref<number | null>(null);
const binaryInputRef = ref<HTMLTextAreaElement | null>(null);
const octalInputRef = ref<HTMLTextAreaElement | null>(null);
const decimalInputRef = ref<HTMLTextAreaElement | null>(null);
const hexInputRef = ref<HTMLTextAreaElement | null>(null);

interface ValidationErrors {
  binary: string;
  octal: string;
  decimal: string;
  hex: string;
}

const validationErrors = ref<ValidationErrors>({
  binary: "",
  octal: "",
  decimal: "",
  hex: "",
});

const hasValidBinary = computed(() => {
  return !!(binaryInput.value && !validationErrors.value.binary);
});

const binaryLength = computed(() => {
  if (!hasValidBinary.value) return 0;
  const cleaned = binaryInput.value.replace(/^0b/i, "").trim();
  return cleaned.length;
});

const binaryDisplay = computed(() => {
  if (!hasValidBinary.value) return [];
  const cleaned = binaryInput.value.replace(/^0b/i, "").trim();
  return cleaned.split("");
});

const binaryOverlayHeight = computed(() => {
  if (binaryInputRef.value) {
    return `${binaryInputRef.value.scrollHeight}px`;
  }
  return "auto";
});

const highlightedBitIndex = computed(() => {
  if (
    bitPosition.value === null ||
    bitPosition.value < 0 ||
    bitPosition.value >= binaryLength.value
  ) {
    return -1;
  }
  // Convert bit position to array index
  if (bitOrder.value === "MSB") {
    // MSB mode: bit 0 = leftmost (index 0)
    return bitPosition.value;
  } else {
    // LSB mode: bit 0 = rightmost (index length-1)
    return binaryLength.value - 1 - bitPosition.value;
  }
});

const bitValue = computed(() => {
  if (
    !hasValidBinary.value ||
    bitPosition.value === null ||
    bitPosition.value < 0
  ) {
    return "";
  }

  // Check if bit position is within range
  if (bitPosition.value >= binaryLength.value) {
    return ""; // Out of range
  }

  // Get the bit value based on bit order
  let bitIndex: number;
  if (bitOrder.value === "MSB") {
    // MSB mode: bit 0 = leftmost (index 0)
    bitIndex = bitPosition.value;
  } else {
    // LSB mode: bit 0 = rightmost (index length-1)
    bitIndex = binaryLength.value - 1 - bitPosition.value;
  }

  return binaryDisplay.value[bitIndex] || "0";
});

const bitPower = computed(() => {
  if (
    bitPosition.value === null ||
    bitPosition.value < 0 ||
    bitPosition.value >= binaryLength.value
  ) {
    return null;
  }

  if (bitOrder.value === "MSB") {
    // MSB mode: bit 0 represents 2^(length-1), bit 1 represents 2^(length-2), etc.
    return binaryLength.value - 1 - bitPosition.value;
  } else {
    // LSB mode: bit 0 represents 2^0, bit 1 represents 2^1, etc.
    return bitPosition.value;
  }
});

// Validation functions
function validateBinary(value: string): string {
  if (!value) return "";
  const cleaned = value.replace(/^0b/i, "").trim();
  if (!/^[01]+$/.test(cleaned)) {
    return "Invalid binary number. Only 0 and 1 are allowed.";
  }
  return "";
}

function validateOctal(value: string): string {
  if (!value) return "";
  // Support 0o prefix, 0 prefix (leading zero), or no prefix
  let cleaned = value.trim();
  if (cleaned.startsWith("0o") || cleaned.startsWith("0O")) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith("0") && cleaned.length > 1) {
    // Leading zero indicates octal
    cleaned = cleaned.substring(1);
  }
  if (!/^[0-7]+$/.test(cleaned)) {
    return "Invalid octal number. Only digits 0-7 are allowed. Supports 0o prefix or leading 0.";
  }
  return "";
}

function validateDecimal(value: string): string {
  if (!value) return "";
  const cleaned = value.trim();
  if (!/^\d+$/.test(cleaned)) {
    return "Invalid decimal number. Only digits 0-9 are allowed.";
  }
  return "";
}

function validateHex(value: string): string {
  if (!value) return "";
  // Support 0x prefix, # prefix, or no prefix
  let cleaned = value.trim();
  if (cleaned.startsWith("0x") || cleaned.startsWith("0X")) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith("#")) {
    cleaned = cleaned.substring(1);
  }
  if (!/^[0-9a-fA-F]+$/.test(cleaned)) {
    return "Invalid hexadecimal number. Only 0-9 and A-F are allowed. Supports 0x or # prefix.";
  }
  return "";
}

// Update functions - convert from one base to all others
function updateFromDecimal(decValue: number) {
  if (isNaN(decValue) || decValue < 0) return;

  isUpdating.value = true;
  binaryInput.value = decValue.toString(2);
  octalInput.value = decValue.toString(8);
  hexInput.value = decValue.toString(16).toUpperCase();
  isUpdating.value = false;
}

// Input change handlers
function onBinaryChange() {
  if (isUpdating.value) return;

  validationErrors.value.binary = validateBinary(binaryInput.value);

  if (!binaryInput.value) {
    clearOtherFields("binary");
    return;
  }

  if (validationErrors.value.binary) {
    clearOtherFields("binary");
    return;
  }

  const cleaned = binaryInput.value.replace(/^0b/i, "").trim();
  const decValue = parseInt(cleaned, 2);

  isUpdating.value = true;
  decimalInput.value = decValue.toString();
  octalInput.value = decValue.toString(8);
  hexInput.value = decValue.toString(16).toUpperCase();

  validationErrors.value.octal = "";
  validationErrors.value.decimal = "";
  validationErrors.value.hex = "";
  isUpdating.value = false;
}

function onOctalChange() {
  if (isUpdating.value) return;

  validationErrors.value.octal = validateOctal(octalInput.value);

  if (!octalInput.value) {
    clearOtherFields("octal");
    return;
  }

  if (validationErrors.value.octal) {
    clearOtherFields("octal");
    return;
  }

  // Parse octal: support 0o prefix, 0 prefix (leading zero), or no prefix
  let cleaned = octalInput.value.trim();
  if (cleaned.startsWith("0o") || cleaned.startsWith("0O")) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith("0") && cleaned.length > 1) {
    // Leading zero indicates octal
    cleaned = cleaned.substring(1);
  }
  const decValue = parseInt(cleaned, 8);

  isUpdating.value = true;
  decimalInput.value = decValue.toString();
  binaryInput.value = decValue.toString(2);
  hexInput.value = decValue.toString(16).toUpperCase();

  validationErrors.value.binary = "";
  validationErrors.value.decimal = "";
  validationErrors.value.hex = "";
  isUpdating.value = false;
}

function onDecimalChange() {
  if (isUpdating.value) return;

  validationErrors.value.decimal = validateDecimal(decimalInput.value);

  if (!decimalInput.value) {
    clearOtherFields("decimal");
    return;
  }

  if (validationErrors.value.decimal) {
    clearOtherFields("decimal");
    return;
  }

  const decValue = parseInt(decimalInput.value, 10);

  isUpdating.value = true;
  binaryInput.value = decValue.toString(2);
  octalInput.value = decValue.toString(8);
  hexInput.value = decValue.toString(16).toUpperCase();

  validationErrors.value.binary = "";
  validationErrors.value.octal = "";
  validationErrors.value.hex = "";
  isUpdating.value = false;
}

function onHexChange() {
  if (isUpdating.value) return;

  validationErrors.value.hex = validateHex(hexInput.value);

  if (!hexInput.value) {
    clearOtherFields("hex");
    return;
  }

  if (validationErrors.value.hex) {
    clearOtherFields("hex");
    return;
  }

  // Parse hex: support 0x prefix, # prefix, or no prefix
  let cleaned = hexInput.value.trim();
  if (cleaned.startsWith("0x") || cleaned.startsWith("0X")) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith("#")) {
    cleaned = cleaned.substring(1);
  }
  const decValue = parseInt(cleaned, 16);

  isUpdating.value = true;
  decimalInput.value = decValue.toString();
  binaryInput.value = decValue.toString(2);
  octalInput.value = decValue.toString(8);

  validationErrors.value.binary = "";
  validationErrors.value.octal = "";
  validationErrors.value.decimal = "";
  isUpdating.value = false;
}

function clearOtherFields(except: string) {
  isUpdating.value = true;

  if (except !== "binary") {
    binaryInput.value = "";
    validationErrors.value.binary = "";
  }
  if (except !== "octal") {
    octalInput.value = "";
    validationErrors.value.octal = "";
  }
  if (except !== "decimal") {
    decimalInput.value = "";
    validationErrors.value.decimal = "";
  }
  if (except !== "hex") {
    hexInput.value = "";
    validationErrors.value.hex = "";
  }

  isUpdating.value = false;
}

function autoResize(textarea: HTMLTextAreaElement) {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

// Auto-resize textareas when values change programmatically
watch([binaryInput, octalInput, decimalInput, hexInput], async () => {
  await nextTick();
  if (binaryInputRef.value) autoResize(binaryInputRef.value);
  if (octalInputRef.value) autoResize(octalInputRef.value);
  if (decimalInputRef.value) autoResize(decimalInputRef.value);
  if (hexInputRef.value) autoResize(hexInputRef.value);
});

// Clear bit position when inspector is disabled
watch(bitInspectorEnabled, (enabled) => {
  if (!enabled) {
    bitPosition.value = null;
  }
});

// Clear bit position when bit order changes
watch(bitOrder, () => {
  bitPosition.value = null;
});

async function copyValue(value: string, baseName: string) {
  if (!value || !value.trim()) return;

  const trimmedValue = value.trim();

  try {
    await navigator.clipboard.writeText(trimmedValue);
    showToast(`Copied ${baseName}: ${trimmedValue}`);
  } catch (err) {
    showToast("Failed to copy");
  }
}

function showToast(message: string) {
  toastMessage.value = message;
  setTimeout(() => {
    toastMessage.value = "";
  }, 2000);
}
</script>

<style scoped>
/* Using VitePress native CSS variables */
.converter-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
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

.input-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

.binary-input-section {
  grid-column: span 2;
}

@media (max-width: 768px) {
  .input-grid {
    grid-template-columns: 1fr;
  }

  .binary-input-section {
    grid-column: span 1;
  }
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
}

.input-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.base-info {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.input-with-copy {
  position: relative;
  display: flex;
  align-items: center;
}

.binary-input-wrapper {
  position: relative;
}

.binary-input-container {
  position: relative;
  flex: 1;
  width: 100%;
}

.number-input {
  width: 100%;
  padding: 1rem 3.5rem 1rem 1.25rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 1.125rem;
  line-height: 1.6;
  box-shadow: var(--vp-shadow-1);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  z-index: 1;
  resize: none;
  overflow: hidden;
  min-height: calc(1.6 * 1.125rem + 2rem);
}

.binary-input-container .number-input.with-overlay {
  background: transparent;
  color: transparent;
  caret-color: var(--vp-c-text-1);
}

.binary-input-container .number-input:not(.with-overlay) {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.binary-input-container .number-input::selection {
  background: color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent);
}

.number-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
}

.number-input.invalid {
  border-color: #e53e3e;
  box-shadow: 0 0 0 3px color-mix(in srgb, #e53e3e 20%, transparent);
}

.btn-copy {
  position: absolute;
  right: 1rem;
  top: 0.9rem;
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
  z-index: 2;
}

.btn-copy:hover:not(:disabled) {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-copy:active:not(:disabled) {
  transform: scale(0.95);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-copy:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-copy svg {
  display: block;
  transition: all 0.2s ease;
}

.btn-copy:hover:not(:disabled) svg {
  stroke: white;
}

.input-hint {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  font-style: italic;
  min-height: 1.25rem;
}

.error-message {
  font-size: 0.875rem;
  color: #e53e3e;
  font-weight: 500;
  min-height: 1.25rem;
}

.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  box-shadow: var(--vp-shadow-2);
  animation: slideIn 0.3s ease;
  z-index: 1000;
  font-weight: 500;
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

.bit-inspector-toggle {
  padding: 0.5rem 0;
}

.toggle-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.bit-inspector-integrated {
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
}

.toggle-checkbox {
  display: none;
}

.toggle-switch {
  margin-left: auto;
  position: relative;
  width: 44px;
  height: 24px;
  background: var(--vp-c-divider);
  border-radius: 12px;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.toggle-switch::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-checkbox:checked + .toggle-switch {
  background: var(--vp-c-brand-1);
}

.toggle-checkbox:checked + .toggle-switch::after {
  transform: translateX(20px);
}

.toggle-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.bit-inspector-content {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bit-order-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.bit-order-control label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.bit-order-toggle {
  display: flex;
  gap: 0.5rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 2px;
}

.bit-order-button {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.bit-order-button:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.bit-order-button.active {
  background: var(--vp-c-brand-1);
  color: white;
  font-weight: 600;
}

.bit-position-control {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.bit-position-control label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.bit-input {
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.bit-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
}

.binary-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  padding: 1rem 1.25rem;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
  z-index: 0;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  min-height: calc(1.6 * 1.125rem + 2rem);
  max-height: 100%;
}

.bit-overlay-char {
  display: inline-block;
  transition: all 0.2s ease;
}

.bit-overlay-char.bit-highlighted {
  background: var(--vp-c-brand-1);
  color: white;
  border-radius: 4px;
  padding: 2px 4px;
  margin: 0 1px;
  box-shadow: 0 0 0 2px var(--vp-c-brand-1),
    0 0 0 4px color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
  font-weight: 700;
  transform: scale(1.05);
}

.bit-overlay-char.bit-out-of-range {
  background: color-mix(in srgb, #e53e3e 20%, transparent);
  border-radius: 4px;
  padding: 2px 4px;
  margin: 0 1px;
}

.bit-info {
  padding-top: 0.75rem;
  border-top: 1px solid var(--vp-c-divider);
}

.bit-info-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bit-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.875rem;
}

.bit-info-item.bit-set {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.bit-info-label {
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.bit-info-value {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
}

.bit-info-value sup {
  font-size: 0.75em;
}

.bit-error {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  background: color-mix(in srgb, #e53e3e 10%, var(--vp-c-bg-alt));
  border: 1px solid #e53e3e;
  color: #e53e3e;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.75rem;
}
</style>
