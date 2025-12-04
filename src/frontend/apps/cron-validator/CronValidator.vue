<template>
  <div class="validator-container">
    <div class="validator-header">
      <h1>Cron Validator</h1>
      <p>
        Validate and understand cron expressions with real-time explanations and
        next run times.
      </p>
    </div>

    <div class="validator-layout">
      <div class="input-section">
        <div class="input-header">
          <h3>Cron Expression</h3>
          <div class="header-actions">
            <span
              v-if="cronInput && isValid"
              class="status-indicator valid"
              title="Valid cron expression"
              >✓</span
            >
            <span
              v-else-if="cronInput && !isValid"
              class="status-indicator invalid"
              title="Invalid cron expression"
              >✗</span
            >
          </div>
        </div>

        <!-- Cron Expression Input with Copy Button -->
        <div class="input-with-button">
          <input
            v-model="cronInput"
            type="text"
            class="cron-input"
            placeholder="e.g., */5 * * * * or 0 9 * * 1-5"
            spellcheck="false"
          />
          <button
            v-if="cronInput && isValid"
            class="btn-copy-inline"
            @click="copyExpression"
            title="Copy expression"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
              <path
                d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
              ></path>
            </svg>
          </button>
          <button
            v-if="cronInput && isValid"
            class="btn-share-inline"
            @click="shareExpression"
            title="Copy shareable link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            Share
          </button>
        </div>
        <div class="format-hint">Format: minute hour day month day-of-week</div>

        <div class="explanation-box">
          <h3>📋 Explanation</h3>
          <p v-if="isValid" class="explanation-text">{{ explanation }}</p>
          <p v-else class="invalid-expression">Invalid cron expression</p>
        </div>

        <!-- Visual Builder -->
        <div class="cron-builder">
          <h3 class="section-title">🔧 Builder</h3>
          <div class="builder-grid">
            <!-- Minute Field -->
            <div class="builder-field">
              <label class="builder-label">⏱️ Minute</label>
              <div class="field-controls">
                <select
                  v-model="builder.minute.type"
                  @change="updateCronFromBuilder"
                  class="field-select"
                >
                  <option value="every">Every minute</option>
                  <option value="interval">Every N minute(s)</option>
                  <option value="specific">Specific minute(s)</option>
                  <option value="range">Range</option>
                </select>

                <div
                  v-if="builder.minute.type === 'interval'"
                  class="field-inputs"
                >
                  <span class="input-label">Every</span>
                  <input
                    type="number"
                    v-model.number="builder.minute.interval"
                    @input="updateCronFromBuilder"
                    class="inline-input"
                    min="1"
                    max="59"
                  />
                  <span class="input-label">minute(s)</span>
                </div>

                <div
                  v-if="builder.minute.type === 'specific'"
                  class="field-inputs"
                >
                  <span class="input-label">Pattern</span>
                  <input
                    type="text"
                    v-model="builder.minute.specific"
                    @input="updateCronFromBuilder"
                    class="inline-input wide"
                    placeholder="e.g., 0,15,30 or 1-5,10,*/3"
                  />
                </div>

                <div
                  v-if="builder.minute.type === 'range'"
                  class="field-inputs"
                >
                  <span class="input-label">From</span>
                  <input
                    type="number"
                    v-model.number="builder.minute.rangeStart"
                    @input="updateCronFromBuilder"
                    class="inline-input"
                    min="0"
                    max="59"
                  />
                  <span class="input-label">to</span>
                  <input
                    type="number"
                    v-model.number="builder.minute.rangeEnd"
                    @input="updateCronFromBuilder"
                    class="inline-input"
                    min="0"
                    max="59"
                  />
                </div>
              </div>
            </div>

            <!-- Hour Field -->
            <div class="builder-field">
              <label class="builder-label">🕐 Hour</label>
              <div class="field-controls">
                <select
                  v-model="builder.hour.type"
                  @change="updateCronFromBuilder"
                  class="field-select"
                >
                  <option value="every">Every hour</option>
                  <option value="interval">Every N hour(s)</option>
                  <option value="specific">Specific hour(s)</option>
                  <option value="range">Range</option>
                </select>

                <div
                  v-if="builder.hour.type === 'interval'"
                  class="field-inputs"
                >
                  <span class="input-label">Every</span>
                  <input
                    type="number"
                    v-model.number="builder.hour.interval"
                    @input="updateCronFromBuilder"
                    class="inline-input"
                    min="1"
                    max="23"
                  />
                  <span class="input-label">hour(s)</span>
                </div>

                <div
                  v-if="builder.hour.type === 'specific'"
                  class="field-inputs"
                >
                  <span class="input-label">Pattern</span>
                  <input
                    type="text"
                    v-model="builder.hour.specific"
                    @input="updateCronFromBuilder"
                    class="inline-input wide"
                    placeholder="e.g., 0,6,12 or 9-17,22,*/3"
                  />
                </div>

                <div v-if="builder.hour.type === 'range'" class="field-inputs">
                  <span class="input-label">From</span>
                  <input
                    type="number"
                    v-model.number="builder.hour.rangeStart"
                    @input="updateCronFromBuilder"
                    class="inline-input"
                    min="0"
                    max="23"
                  />
                  <span class="input-label">to</span>
                  <input
                    type="number"
                    v-model.number="builder.hour.rangeEnd"
                    @input="updateCronFromBuilder"
                    class="inline-input"
                    min="0"
                    max="23"
                  />
                </div>
              </div>
            </div>

            <!-- Day of Month Field -->
            <div class="builder-field">
              <label class="builder-label">📅 Day of Month</label>
              <div class="field-controls">
                <select
                  v-model="builder.dayOfMonth.type"
                  @change="updateCronFromBuilder"
                  class="field-select"
                >
                  <option value="every">Every day</option>
                  <option value="interval">Every N day(s)</option>
                  <option value="specific">Specific day(s)</option>
                  <option value="range">Range</option>
                </select>

                <div
                  v-if="builder.dayOfMonth.type === 'interval'"
                  class="field-inputs"
                >
                  <span class="input-label">Every</span>
                  <input
                    type="number"
                    v-model.number="builder.dayOfMonth.interval"
                    @input="updateCronFromBuilder"
                    class="inline-input"
                    min="1"
                    max="31"
                  />
                  <span class="input-label">day(s)</span>
                </div>

                <div
                  v-if="builder.dayOfMonth.type === 'specific'"
                  class="field-inputs"
                >
                  <span class="input-label">Pattern</span>
                  <input
                    type="text"
                    v-model="builder.dayOfMonth.specific"
                    @input="updateCronFromBuilder"
                    class="inline-input wide"
                    placeholder="e.g., 1,15,30 or 1-7,15,*/3"
                  />
                </div>

                <div
                  v-if="builder.dayOfMonth.type === 'range'"
                  class="field-inputs"
                >
                  <span class="input-label">From</span>
                  <input
                    type="number"
                    v-model.number="builder.dayOfMonth.rangeStart"
                    @input="updateCronFromBuilder"
                    class="inline-input"
                    min="1"
                    max="31"
                  />
                  <span class="input-label">to</span>
                  <input
                    type="number"
                    v-model.number="builder.dayOfMonth.rangeEnd"
                    @input="updateCronFromBuilder"
                    class="inline-input"
                    min="1"
                    max="31"
                  />
                </div>
              </div>
            </div>

          <!-- Month Field -->
          <div class="builder-field">
            <label class="builder-label">🗓️ Month</label>
            <div class="field-controls">
              <select
                v-model="builder.month.type"
                @change="updateCronFromBuilder"
                class="field-select"
              >
                <option value="every">Every month</option>
                <option value="interval">Every N month(s)</option>
                <option value="specific">Specific month(s)</option>
                <option value="range">Range</option>
                <option value="mixed">Mixed (e.g., 1-3,5)</option>
              </select>

              <div v-if="builder.month.type === 'interval'" class="field-inputs">
                <span class="input-label">Every</span>
                <input
                  type="number"
                  v-model.number="builder.month.interval"
                  @input="updateCronFromBuilder"
                  class="inline-input"
                  min="1"
                  max="12"
                />
                <span class="input-label">month(s)</span>
              </div>

              <div v-if="builder.month.type === 'range'" class="field-inputs">
                <span class="input-label">From</span>
                <input
                  type="number"
                  v-model.number="builder.month.rangeStart"
                  @input="updateCronFromBuilder"
                  class="inline-input"
                  min="1"
                  max="12"
                />
                <span class="input-label">to</span>
                <input
                  type="number"
                  v-model.number="builder.month.rangeEnd"
                  @input="updateCronFromBuilder"
                  class="inline-input"
                  min="1"
                  max="12"
                />
              </div>

              <div v-if="builder.month.type === 'mixed'" class="field-inputs">
                <span class="input-label">Pattern</span>
                <input
                  type="text"
                  v-model="builder.month.mixed"
                  @input="updateCronFromBuilder"
                  class="inline-input wide"
                  placeholder="e.g., 1-3,5,7-9"
                />
              </div>
            </div>
            <div class="month-picker">
              <button
                v-for="(month, index) in months"
                :key="index"
                type="button"
                :class="[
                  'month-circle',
                  {
                    selected: builder.month.selected.includes(index + 1),
                    january: index === 0,
                  },
                ]"
                @click="toggleMonth(index + 1)"
                :title="month"
              >
                {{ month.substring(0, 3) }}
              </button>
            </div>
          </div>

          <!-- Day of Week Field -->
          <div class="builder-field">
            <label class="builder-label">📆 Day of Week</label>
            <div class="field-controls">
              <select
                v-model="builder.dayOfWeek.type"
                @change="updateCronFromBuilder"
                class="field-select"
              >
                <option value="every">Every day</option>
                <option value="interval">Every N day(s)</option>
                <option value="specific">Specific day(s)</option>
                <option value="range">Range</option>
                <option value="mixed">Mixed (e.g., 1-3,5)</option>
              </select>

              <div v-if="builder.dayOfWeek.type === 'interval'" class="field-inputs">
                <span class="input-label">Every</span>
                <input
                  type="number"
                  v-model.number="builder.dayOfWeek.interval"
                  @input="updateCronFromBuilder"
                  class="inline-input"
                  min="1"
                  max="7"
                />
                <span class="input-label">day(s)</span>
              </div>

              <div v-if="builder.dayOfWeek.type === 'range'" class="field-inputs">
                <span class="input-label">From</span>
                <input
                  type="number"
                  v-model.number="builder.dayOfWeek.rangeStart"
                  @input="updateCronFromBuilder"
                  class="inline-input"
                  min="0"
                  max="6"
                />
                <span class="input-label">to</span>
                <input
                  type="number"
                  v-model.number="builder.dayOfWeek.rangeEnd"
                  @input="updateCronFromBuilder"
                  class="inline-input"
                  min="0"
                  max="6"
                />
              </div>

              <div v-if="builder.dayOfWeek.type === 'mixed'" class="field-inputs">
                <span class="input-label">Pattern</span>
                <input
                  type="text"
                  v-model="builder.dayOfWeek.mixed"
                  @input="updateCronFromBuilder"
                  class="inline-input wide"
                  placeholder="e.g., 1-5,0"
                />
              </div>
            </div>
            <div class="day-picker">
              <button
                v-for="(day, index) in daysOfWeek"
                :key="index"
                type="button"
                :class="[
                  'day-circle',
                  {
                    selected: builder.dayOfWeek.selected.includes(index),
                    sunday: index === 0,
                  },
                ]"
                @click="toggleDay(index)"
                :title="day"
              >
                {{ day.charAt(0) }}
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>

      <div v-if="cronInput" class="result-section">
        <div v-if="isValid" class="valid-result">
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
                <li>
                  <code>0 0 1 * *</code> - At midnight on the 1st of every month
                </li>
                <li><code>30 14 * * 0</code> - At 2:30 PM every Sunday</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>
          Enter a cron expression above to see the explanation and next run
          times.
        </p>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { isValidCron } from "cron-validator";

const cronInput = ref("");
const isValid = ref(false);
const errorMessage = ref("");
const explanation = ref("");
const breakdown = ref({
  minute: "",
  hour: "",
  dayOfMonth: "",
  month: "",
  dayOfWeek: "",
});
const nextRuns = ref<string[]>([]);
const toastMessage = ref("");
let isUpdatingFromBuilder = false;

// Builder state
const builder = ref({
  minute: {
    type: "every",
    interval: 5,
    specific: "",
    rangeStart: 0,
    rangeEnd: 59,
  },
  hour: {
    type: "every",
    interval: 1,
    specific: "",
    rangeStart: 0,
    rangeEnd: 23,
  },
  dayOfMonth: {
    type: "every",
    interval: 1,
    specific: "",
    rangeStart: 1,
    rangeEnd: 31,
  },
  month: {
    type: "every",
    interval: 1,
    rangeStart: 1,
    rangeEnd: 12,
    selected: [] as number[],
    mixed: "",
  },
  dayOfWeek: {
    type: "every",
    interval: 1,
    rangeStart: 0,
    rangeEnd: 6,
    selected: [] as number[],
    mixed: "",
  },
});

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Update cron expression from builder
function updateCronFromBuilder() {
  isUpdatingFromBuilder = true;
  const minute = buildFieldValue("minute");
  const hour = buildFieldValue("hour");
  const dayOfMonth = buildFieldValue("dayOfMonth");
  const month = buildFieldValue("month");
  const dayOfWeek = buildFieldValue("dayOfWeek");

  // Update selected arrays for visual pill feedback
  updateSelectedArrays();

  cronInput.value = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  setTimeout(() => {
    isUpdatingFromBuilder = false;
  }, 0);
}

// Update selected arrays based on current builder state for pill visual feedback
function updateSelectedArrays() {
  // Update month selected array
  if (builder.value.month.type === "range") {
    builder.value.month.selected = [];
    const start = builder.value.month.rangeStart;
    const end = builder.value.month.rangeEnd;
    for (let i = start; i <= end; i++) {
      builder.value.month.selected.push(i);
    }
  } else if (builder.value.month.type === "mixed") {
    builder.value.month.selected = expandPattern(builder.value.month.mixed, 1, 12);
  } else if (builder.value.month.type === "interval") {
    // Show visual feedback for interval patterns like */3
    const interval = builder.value.month.interval || 1;
    builder.value.month.selected = [];
    for (let i = 1; i <= 12; i += interval) {
      builder.value.month.selected.push(i);
    }
  } else if (builder.value.month.type === "every") {
    builder.value.month.selected = [];
  }
  // For "specific" type, selected is already managed by toggleMonth

  // Update day of week selected array
  if (builder.value.dayOfWeek.type === "range") {
    builder.value.dayOfWeek.selected = [];
    const start = builder.value.dayOfWeek.rangeStart;
    const end = builder.value.dayOfWeek.rangeEnd;
    for (let i = start; i <= end; i++) {
      builder.value.dayOfWeek.selected.push(i);
    }
  } else if (builder.value.dayOfWeek.type === "mixed") {
    builder.value.dayOfWeek.selected = expandPattern(builder.value.dayOfWeek.mixed, 0, 6);
  } else if (builder.value.dayOfWeek.type === "interval") {
    // Show visual feedback for interval patterns like */2
    const interval = builder.value.dayOfWeek.interval || 1;
    builder.value.dayOfWeek.selected = [];
    for (let i = 0; i <= 6; i += interval) {
      builder.value.dayOfWeek.selected.push(i);
    }
  } else if (builder.value.dayOfWeek.type === "every") {
    builder.value.dayOfWeek.selected = [];
  }
  // For "specific" type, selected is already managed by toggleDay
}

function buildFieldValue(field: string): string {
  const fieldData = builder.value[field as keyof typeof builder.value] as any;

  if (fieldData.type === "every") return "*";

  if (fieldData.type === "interval") {
    const interval = fieldData.interval || 1;
    return `*/${interval}`;
  }

  if (fieldData.type === "range") {
    const start = fieldData.rangeStart;
    const end = fieldData.rangeEnd;
    if (start !== undefined && end !== undefined) {
      return `${start}-${end}`;
    }
  }

  if (fieldData.type === "mixed") {
    return fieldData.mixed || "*";
  }

  if (fieldData.type === "specific") {
    // For month and dayOfWeek with selected arrays
    if (fieldData.selected && fieldData.selected.length > 0) {
      return fieldData.selected.sort((a: number, b: number) => a - b).join(",");
    }
    // For other fields with specific values
    return fieldData.specific || "*";
  }

  return "*";
}

// Toggle day selection
function toggleDay(dayIndex: number) {
  // Auto-switch to specific mode when clicking day pills
  if (builder.value.dayOfWeek.type !== "specific") {
    builder.value.dayOfWeek.type = "specific";
    builder.value.dayOfWeek.selected = [];
  }
  
  const index = builder.value.dayOfWeek.selected.indexOf(dayIndex);
  if (index > -1) {
    builder.value.dayOfWeek.selected.splice(index, 1);
  } else {
    builder.value.dayOfWeek.selected.push(dayIndex);
  }
  updateCronFromBuilder();
}

// Toggle month selection
function toggleMonth(monthNumber: number) {
  // Auto-switch to specific mode when clicking month pills
  if (builder.value.month.type !== "specific") {
    builder.value.month.type = "specific";
    builder.value.month.selected = [];
  }
  
  const index = builder.value.month.selected.indexOf(monthNumber);
  if (index > -1) {
    builder.value.month.selected.splice(index, 1);
  } else {
    builder.value.month.selected.push(monthNumber);
  }
  updateCronFromBuilder();
}

// Parse cron expression to builder (basic implementation)
function parseToBuilder(parts: string[]) {
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  // Parse minute
  if (minute === "*") {
    builder.value.minute.type = "every";
  } else if (minute.startsWith("*/") && !minute.includes(",")) {
    // Simple interval like "*/5"
    builder.value.minute.type = "interval";
    builder.value.minute.interval = parseInt(minute.split("/")[1]);
  } else if (!minute.includes(",") && minute.includes("-") && !minute.includes("/")) {
    // Simple range like "0-30" without commas or steps
    builder.value.minute.type = "range";
    const [start, end] = minute.split("-");
    builder.value.minute.rangeStart = parseInt(start);
    builder.value.minute.rangeEnd = parseInt(end);
  } else {
    // Everything else: "1,2,3" or "1-3,5" or "1-3,5,*/3" - use text input
    builder.value.minute.type = "specific";
    builder.value.minute.specific = minute;
  }

  // Parse hour
  if (hour === "*") {
    builder.value.hour.type = "every";
  } else if (hour.startsWith("*/") && !hour.includes(",")) {
    // Simple interval like "*/2"
    builder.value.hour.type = "interval";
    builder.value.hour.interval = parseInt(hour.split("/")[1]);
  } else if (!hour.includes(",") && hour.includes("-") && !hour.includes("/")) {
    // Simple range like "9-17" without commas or steps
    builder.value.hour.type = "range";
    const [start, end] = hour.split("-");
    builder.value.hour.rangeStart = parseInt(start);
    builder.value.hour.rangeEnd = parseInt(end);
  } else {
    // Everything else: "1,2,3" or "1-3,5" or "9-17,22,*/3" - use text input
    builder.value.hour.type = "specific";
    builder.value.hour.specific = hour;
  }

  // Parse day of month
  if (dayOfMonth === "*") {
    builder.value.dayOfMonth.type = "every";
  } else if (dayOfMonth.startsWith("*/") && !dayOfMonth.includes(",")) {
    // Simple interval like "*/3"
    builder.value.dayOfMonth.type = "interval";
    builder.value.dayOfMonth.interval = parseInt(dayOfMonth.split("/")[1]);
  } else if (!dayOfMonth.includes(",") && dayOfMonth.includes("-") && !dayOfMonth.includes("/")) {
    // Simple range like "1-15" without commas or steps
    builder.value.dayOfMonth.type = "range";
    const [start, end] = dayOfMonth.split("-");
    builder.value.dayOfMonth.rangeStart = parseInt(start);
    builder.value.dayOfMonth.rangeEnd = parseInt(end);
  } else {
    // Everything else: "1,2,3" or "1-7,15" or "1-7,15,*/3" - use text input
    builder.value.dayOfMonth.type = "specific";
    builder.value.dayOfMonth.specific = dayOfMonth;
  }

  // Parse month
  if (month === "*") {
    builder.value.month.type = "every";
    builder.value.month.selected = [];
  } else if (month.startsWith("*/") && !month.includes(",")) {
    // Simple interval like "*/3"
    builder.value.month.type = "interval";
    const interval = parseInt(month.split("/")[1]);
    builder.value.month.interval = interval;
    // Populate selected for visual feedback (start from 1, step by interval)
    builder.value.month.selected = [];
    for (let i = 1; i <= 12; i += interval) {
      builder.value.month.selected.push(i);
    }
  } else if (!month.includes(",") && month.includes("-") && !month.includes("/")) {
    // Simple range like "1-6" without commas or steps
    builder.value.month.type = "range";
    const [start, end] = month.split("-");
    builder.value.month.rangeStart = parseInt(start);
    builder.value.month.rangeEnd = parseInt(end);
    // Populate selected for visual feedback
    builder.value.month.selected = [];
    for (let i = parseInt(start); i <= parseInt(end); i++) {
      builder.value.month.selected.push(i);
    }
  } else if (month.includes(",") && (month.includes("-") || month.includes("/"))) {
    // Complex mixed pattern like "1-3,5" or "1,3,*/2" - use mixed text input
    builder.value.month.type = "mixed";
    builder.value.month.mixed = month;
    // Expand pattern for visual feedback
    builder.value.month.selected = expandPattern(month, 1, 12);
  } else if (month.includes(",")) {
    // Simple list like "1,2,3" - use checkboxes
    builder.value.month.type = "specific";
    builder.value.month.selected = month.split(",").map((m) => parseInt(m));
  } else {
    builder.value.month.type = "specific";
    builder.value.month.selected = [parseInt(month)];
  }

  // Parse day of week
  if (dayOfWeek === "*") {
    builder.value.dayOfWeek.type = "every";
    builder.value.dayOfWeek.selected = [];
  } else if (dayOfWeek.startsWith("*/") && !dayOfWeek.includes(",")) {
    // Simple interval like "*/2"
    builder.value.dayOfWeek.type = "interval";
    const interval = parseInt(dayOfWeek.split("/")[1]);
    builder.value.dayOfWeek.interval = interval;
    // Populate selected for visual feedback (start from 0, step by interval)
    builder.value.dayOfWeek.selected = [];
    for (let i = 0; i <= 6; i += interval) {
      builder.value.dayOfWeek.selected.push(i);
    }
  } else if (!dayOfWeek.includes(",") && dayOfWeek.includes("-") && !dayOfWeek.includes("/")) {
    // Simple range like "1-5" without commas or steps
    builder.value.dayOfWeek.type = "range";
    const [start, end] = dayOfWeek.split("-");
    builder.value.dayOfWeek.rangeStart = parseInt(start);
    builder.value.dayOfWeek.rangeEnd = parseInt(end);
    // Populate selected for visual feedback
    builder.value.dayOfWeek.selected = [];
    for (let i = parseInt(start); i <= parseInt(end); i++) {
      builder.value.dayOfWeek.selected.push(i);
    }
  } else if (dayOfWeek.includes(",") && (dayOfWeek.includes("-") || dayOfWeek.includes("/"))) {
    // Complex mixed pattern like "1-3,5" or "1-5,0,*/2" - use mixed text input
    builder.value.dayOfWeek.type = "mixed";
    builder.value.dayOfWeek.mixed = dayOfWeek;
    // Expand pattern for visual feedback
    builder.value.dayOfWeek.selected = expandPattern(dayOfWeek, 0, 6);
  } else if (dayOfWeek.includes(",")) {
    // Simple list like "1,2,3" - use circular checkboxes
    builder.value.dayOfWeek.type = "specific";
    builder.value.dayOfWeek.selected = dayOfWeek
      .split(",")
      .map((d) => parseInt(d));
  } else {
    builder.value.dayOfWeek.type = "specific";
    builder.value.dayOfWeek.selected = [parseInt(dayOfWeek)];
  }
}

// Helper function to expand complex patterns into individual values
function expandPattern(pattern: string, min: number, max: number): number[] {
  const values: number[] = [];
  const parts = pattern.split(",");
  
  parts.forEach((part) => {
    part = part.trim();
    if (part.includes("/")) {
      // Handle step patterns like "*/3" or "5-10/2"
      const [rangePart, stepStr] = part.split("/");
      const step = parseInt(stepStr.trim());
      
      if (rangePart === "*") {
        // For */n, start from min and step by n (standard cron behavior)
        for (let i = min; i <= max; i += step) {
          if (!values.includes(i)) {
            values.push(i);
          }
        }
      } else if (rangePart.includes("-")) {
        // Range with step like "5-10/2"
        const [start, end] = rangePart.split("-").map((n) => parseInt(n.trim()));
        for (let i = start; i <= end; i += step) {
          if (i >= min && i <= max && !values.includes(i)) {
            values.push(i);
          }
        }
      } else {
        // Single value with step like "5/3" - start from that value and step
        const rangeStart = parseInt(rangePart.trim());
        for (let i = rangeStart; i <= max; i += step) {
          if (i >= min && !values.includes(i)) {
            values.push(i);
          }
        }
      }
    } else if (part.includes("-")) {
      // Range like "1-5"
      const [start, end] = part.split("-").map((n) => parseInt(n.trim()));
      for (let i = start; i <= end; i++) {
        if (i >= min && i <= max && !values.includes(i)) {
          values.push(i);
        }
      }
    } else {
      // Single value
      const val = parseInt(part);
      if (val >= min && val <= max && !values.includes(val)) {
        values.push(val);
      }
    }
  });
  
  return values;
}

// Initialize builder with default expression
updateCronFromBuilder();

// Read cron expression from URL query params on mount
onMounted(() => {
  if (typeof window === 'undefined') return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const cronFromUrl = urlParams.get("cron");
  
  if (cronFromUrl) {
    cronInput.value = decodeURIComponent(cronFromUrl);
    // Parse to builder if valid
    const parts = cronInput.value.trim().split(/\s+/);
    if (parts.length === 5) {
      parseToBuilder(parts);
    }
  }
});

// Update URL when cron expression changes
function updateUrlWithCron(cron: string) {
  if (typeof window === 'undefined') return;
  
  if (!cron || !isValid.value) {
    // Remove query param if invalid or empty
    const url = new URL(window.location.href);
    url.searchParams.delete("cron");
    window.history.replaceState({}, "", url.toString());
    return;
  }
  
  const url = new URL(window.location.href);
  url.searchParams.set("cron", encodeURIComponent(cron));
  window.history.replaceState({}, "", url.toString());
}

// Parse and validate cron expression
watch(cronInput, (newValue) => {
  if (!newValue.trim()) {
    isValid.value = false;
    errorMessage.value = "";
    builder.value.month.selected = [];
    builder.value.dayOfWeek.selected = [];
    return;
  }

  try {
    // Validate using cron-validator package
    const validationResult = isValidCron(newValue.trim(), {
      alias: true,
      allowBlankDay: true,
    });

    if (!validationResult) {
      throw new Error(
        "Invalid cron expression. Please check the format and ensure all fields are valid."
      );
    }

    const parts = newValue.trim().split(/\s+/);

    if (parts.length !== 5) {
      throw new Error(
        `Expected 5 fields, got ${parts.length}. A cron expression should have: minute, hour, day-of-month, month, and day-of-week.`
      );
    }

    isValid.value = true;
    errorMessage.value = "";

    // Update builder from parsed expression (for pill visual feedback)
    if (!isUpdatingFromBuilder) {
      parseToBuilder(parts);
    }

    // Generate explanation
    explanation.value = generateExplanation(parts);

    // Generate breakdown
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    breakdown.value = {
      minute: explainField(minute, "minute"),
      hour: explainField(hour, "hour"),
      dayOfMonth: explainField(dayOfMonth, "day-of-month"),
      month: explainField(month, "month"),
      dayOfWeek: explainField(dayOfWeek, "day-of-week"),
    };

    // Calculate next runs
    nextRuns.value = calculateNextRuns(parts);
    
    // Update URL with valid cron expression
    updateUrlWithCron(newValue.trim());
  } catch (error: any) {
    isValid.value = false;
    errorMessage.value = error.message || "Invalid cron expression";
    // Clear URL param on invalid expression
    updateUrlWithCron("");
    builder.value.month.selected = [];
    builder.value.dayOfWeek.selected = [];
  }
}, {immediate: true});

function copyExpression() {
  if (!cronInput.value || !isValid.value) return;

  navigator.clipboard
    .writeText(cronInput.value)
    .then(() => {
      showToast("Cron expression copied to clipboard!");
    })
    .catch(() => {
      showToast("Failed to copy to clipboard");
    });
}

function shareExpression() {
  if (!cronInput.value || !isValid.value || typeof window === 'undefined') return;

  // Copy the full URL with the cron expression as query param
  const url = new URL(window.location.href);
  url.searchParams.set("cron", encodeURIComponent(cronInput.value));
  
  navigator.clipboard
    .writeText(url.toString())
    .then(() => {
      showToast("Shareable link copied to clipboard!");
    })
    .catch(() => {
      showToast("Failed to copy to clipboard");
    });
}

function showToast(message: string) {
  toastMessage.value = message;
  setTimeout(() => {
    toastMessage.value = "";
  }, 2000);
}

function explainField(field: string, type: string): string {
  if (field === "*") return "Every " + type;
  if (field === "?") return "Any " + type;

  // Handle complex mixed patterns with commas
  if (field.includes(",")) {
    const parts = field.split(",");
    const descriptions: string[] = [];
    
    parts.forEach(part => {
      if (part.includes("/")) {
        const [range, step] = part.split("/");
        if (range === "*") {
          descriptions.push(`every ${step} ${type}(s)`);
        } else {
          descriptions.push(`every ${step} ${type}(s) from ${range}`);
        }
      } else if (part.includes("-")) {
        const [start, end] = part.split("-");
        if (type === "day-of-week") {
          descriptions.push(`${getDayName(parseInt(start))}-${getDayName(parseInt(end))}`);
        } else if (type === "month") {
          descriptions.push(`${getMonthName(parseInt(start))}-${getMonthName(parseInt(end))}`);
        } else {
          descriptions.push(`${start}-${end}`);
        }
      } else {
        if (type === "day-of-week") {
          descriptions.push(getDayName(parseInt(part)));
        } else if (type === "month") {
          descriptions.push(getMonthName(parseInt(part)));
        } else {
          descriptions.push(part);
        }
      }
    });
    
    return descriptions.join(", ");
  }

  // Simple interval
  if (field.includes("/")) {
    const [range, step] = field.split("/");
    if (range === "*") {
      return `Every ${step} ${type}(s)`;
    }
    return `Every ${step} ${type}(s) starting from ${range}`;
  }

  // Simple range
  if (field.includes("-")) {
    const [start, end] = field.split("-");
    if (type === "day-of-week") {
      return `${getDayName(parseInt(start))} through ${getDayName(
        parseInt(end)
      )}`;
    }
    if (type === "month") {
      return `${getMonthName(parseInt(start))} through ${getMonthName(
        parseInt(end)
      )}`;
    }
    return `${start} through ${end}`;
  }

  // Single value
  if (type === "day-of-week") {
    return getDayName(parseInt(field));
  }
  if (type === "month") {
    return getMonthName(parseInt(field));
  }
  if (type === "hour") {
    return `${field}:00`;
  }

  return field;
}

function generateExplanation(parts: string[]): string {
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  let explanation = "This cron job runs ";

  // Minute
  const minuteExplain = explainField(minute, "minute");
  if (minute === "*") {
    explanation += "every minute";
  } else if (minute.startsWith("*/") && !minute.includes(",")) {
    explanation += minuteExplain.toLowerCase();
  } else {
    explanation += `at ${minuteExplain.toLowerCase()}`;
  }

  // Hour
  if (hour !== "*") {
    const hourExplain = explainField(hour, "hour");
    if (hour.startsWith("*/") && !hour.includes(",")) {
      explanation += ` of ${hourExplain.toLowerCase()}`;
    } else if (hour.includes("-") && !hour.includes(",")) {
      const [start, end] = hour.split("-");
      explanation += ` between ${start}:00 and ${end}:00`;
    } else if (hour.includes(",")) {
      explanation += ` at hours (${hourExplain})`;
    } else {
      explanation += ` at ${hour}:00`;
    }
  }

  // Day of week
  if (dayOfWeek !== "*") {
    const dayExplain = explainField(dayOfWeek, "day-of-week");
    explanation += ` on ${dayExplain}`;
  }

  // Day of month
  if (dayOfMonth !== "*" && dayOfWeek === "*") {
    const domExplain = explainField(dayOfMonth, "day-of-month");
    if (dayOfMonth.startsWith("*/") && !dayOfMonth.includes(",")) {
      explanation += ` on ${domExplain.toLowerCase()}`;
    } else if (dayOfMonth.includes(",")) {
      explanation += ` on days (${domExplain})`;
    } else {
      explanation += ` on day ${domExplain}`;
    }
  }

  // Month
  if (month !== "*") {
    const monthExplain = explainField(month, "month");
    explanation += ` in ${monthExplain}`;
  }

  return explanation + ".";
}

function getDayName(day: number): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day] || `Day ${day}`;
}

function getMonthName(month: number): string {
  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month] || `Month ${month}`;
}

function calculateNextRuns(parts: string[]): string[] {
  const [minuteStr, hourStr, dayOfMonthStr, monthStr, dayOfWeekStr] = parts;
  const runs: string[] = [];
  const now = new Date();
  let current = new Date(now);
  current.setSeconds(0, 0);

  // Simple calculation for next 5 runs
  let attempts = 0;
  const maxAttempts = 100000; // Prevent infinite loops

  while (runs.length < 5 && attempts < maxAttempts) {
    attempts++;
    current = new Date(current.getTime() + 60000); // Add 1 minute

    if (matchesCron(current, parts)) {
      runs.push(
        current.toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    }
  }

  return runs.length > 0
    ? runs
    : ["Unable to calculate next runs for this expression"];
}

function matchesCron(date: Date, parts: string[]): boolean {
  const [minuteStr, hourStr, dayOfMonthStr, monthStr, dayOfWeekStr] = parts;

  const minute = date.getMinutes();
  const hour = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();

  // Check minute, hour, and month
  const minuteMatch = matchesField(minute, minuteStr, 0, 59);
  const hourMatch = matchesField(hour, hourStr, 0, 23);
  const monthMatch = matchesField(month, monthStr, 1, 12);

  // For day of month and day of week, if both are specified (not *),
  // the cron should run if EITHER matches (OR logic), not both (AND logic)
  const dayOfMonthMatch = matchesField(dayOfMonth, dayOfMonthStr, 1, 31);
  const dayOfWeekMatch = matchesField(dayOfWeek, dayOfWeekStr, 0, 6);

  // If both day fields are wildcards, match both
  if (
    (dayOfMonthStr === "*" || dayOfMonthStr === "?") &&
    (dayOfWeekStr === "*" || dayOfWeekStr === "?")
  ) {
    return minuteMatch && hourMatch && monthMatch;
  }

  // If only one day field is specified, match that one
  if (dayOfMonthStr === "*" || dayOfMonthStr === "?") {
    return minuteMatch && hourMatch && monthMatch && dayOfWeekMatch;
  }

  if (dayOfWeekStr === "*" || dayOfWeekStr === "?") {
    return minuteMatch && hourMatch && monthMatch && dayOfMonthMatch;
  }

  // If both are specified, match if EITHER day condition is true (OR logic)
  return (
    minuteMatch &&
    hourMatch &&
    monthMatch &&
    (dayOfMonthMatch || dayOfWeekMatch)
  );
}

function matchesField(
  value: number,
  field: string,
  min: number,
  max: number
): boolean {
  if (field === "*" || field === "?") return true;

  if (field.includes("/")) {
    const [range, step] = field.split("/");
    const stepNum = parseInt(step);
    if (range === "*") {
      return value % stepNum === 0;
    }
    const rangeNum = parseInt(range);
    return value >= rangeNum && (value - rangeNum) % stepNum === 0;
  }

  if (field.includes("-")) {
    const [start, end] = field.split("-").map(Number);
    return value >= start && value <= end;
  }

  if (field.includes(",")) {
    const values = field.split(",").map(Number);
    return values.includes(value);
  }

  return value === parseInt(field);
}
</script>

<style scoped>
/* Using VitePress native CSS variables */
.validator-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  min-height: 100vh;
}

.validator-header {
  text-align: center;
  margin-bottom: 2rem;
}

.validator-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--vp-c-text-1);
}

.validator-header p {
  font-size: 1rem;
  color: var(--vp-c-text-2);
}

.validator-layout {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-bottom: 0.25rem;
}

.input-header h3 {
  margin: 0;
  font-size: 1rem;
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

.input-with-button {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
}

.cron-input {
  flex: 1;
  padding: 1rem 1.25rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
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

.btn-copy-inline,
.btn-share-inline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.btn-copy-inline:hover,
.btn-share-inline:hover {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-copy-inline:active,
.btn-share-inline:active {
  transform: scale(0.98);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-copy-inline svg,
.btn-share-inline svg {
  flex-shrink: 0;
  transition: stroke 0.2s ease;
}

.btn-copy-inline:hover svg,
.btn-share-inline:hover svg {
  stroke: white;
}

.format-hint {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.result-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.valid-result,
.invalid-result {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.explanation-box,
.breakdown-box,
.next-runs-box,
.error-box {
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  box-shadow: var(--vp-shadow-1);
}

.explanation-box h3,
.breakdown-box h3,
.next-runs-box h3,
.error-box h3 {
  margin: 0 0 0.625rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.explanation-text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

.invalid-expression {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #e53e3e;
  font-weight: 500;
}

.breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.625rem;
}

.breakdown-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.625rem;
  border-radius: 6px;
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
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
}

.next-runs-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.next-runs-list li {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.875rem;
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
  margin-top: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
}

.error-details p {
  margin: 0.375rem 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.error-details code {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.875rem;
}

.error-details ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.error-details li {
  margin: 0.5rem 0;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
}

.mt-2 {
  margin-top: 0.5rem;
}

.empty-state {
  padding: 2rem 1.5rem;
  text-align: center;
  border: 2px dashed var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
}

.empty-state p {
  margin: 0;
  font-size: 0.95rem;
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

/* Section Title */
.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

/* Cron Builder */
.cron-builder {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  box-shadow: var(--vp-shadow-1);
}

.builder-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.builder-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.875rem;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
}

.builder-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0;
}

.field-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.field-select {
  min-width: 180px;
  flex-shrink: 0;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 14px;
  padding-right: 2rem;
}

.field-select:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg);
}

.field-select:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
}

.field-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.input-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.inline-input {
  width: 70px;
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  outline: none;
  transition: border-color 0.2s ease;
}

.inline-input:focus:not(:disabled) {
  border-color: var(--vp-c-brand-1);
}

.inline-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--vp-c-bg-mute);
}

.inline-input.wide {
  width: 160px;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.375rem;
  margin-top: 0.25rem;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.625rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background: var(--vp-c-bg-soft);
  border: 1px solid transparent;
}

.checkbox-option:hover {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
}

.checkbox-option input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: var(--vp-c-brand-1);
}

.checkbox-option span {
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

/* Month Picker (circular buttons) */
.month-picker {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.month-circle {
  min-width: 48px;
  height: 42px;
  padding: 0 0.5rem;
  border-radius: 21px;
  border: 2px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.month-circle:hover {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
  transform: scale(1.05);
}

.month-circle.selected {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
  font-weight: 700;
}

.month-circle.selected:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
  transform: scale(1.05);
}

.month-circle.january.selected:hover {
  background: #2563eb;
  border-color: #2563eb;
}

/* Day Picker (Android-style circular buttons) */
.day-picker {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.day-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.day-circle.sunday {
  color: #ef4444;
  font-weight: 700;
}

.day-circle:hover {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
  transform: scale(1.05);
}

.day-circle.sunday:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.day-circle.selected {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
  font-weight: 700;
}

.day-circle.sunday.selected {
  background: #ef4444;
  border-color: #ef4444;
}

.day-circle.selected:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
  transform: scale(1.05);
}

.day-circle.sunday.selected:hover {
  background: #dc2626;
  border-color: #dc2626;
}

@media (max-width: 768px) {
  .breakdown-grid {
    grid-template-columns: 1fr;
  }

  .builder-grid {
    grid-template-columns: 1fr;
  }

  .checkbox-grid {
    grid-template-columns: 1fr;
  }

  .field-select {
    min-width: 100%;
  }

  .field-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .field-inputs {
    width: 100%;
  }

  .inline-input {
    flex: 1;
    min-width: 80px;
  }

  .inline-input.wide {
    width: 100%;
  }

  .header-actions {
    flex-wrap: wrap;
  }

  .input-with-button {
    flex-wrap: wrap;
  }

  .cron-input {
    width: 100%;
  }

  .btn-copy-inline,
  .btn-share-inline {
    flex: 1;
    min-width: 100px;
  }
  
  .btn-copy-inline {
    padding: 0.5rem 0.75rem;
  }
}
</style>
