<template>
    <div class="w-full max-w-xl mx-auto">
        <div class="mt-2 flex justify-between items-center">
            <span v-if="showCharCount" class="text-xs text-gray-500">
                {{ modelValue.length }}{{ maxLength ? `/${maxLength}` : '' }} 字
            </span>
            <div class="flex gap-2">
                <button @click="clearContent" v-if="modelValue.length > 0" class="flex items-center gap-1 px-3 py-1 text-sm bg-gray-500 text-white rounded-md 
                   hover:bg-gray-600 active:scale-95 transition-all duration-200" :disabled="disabled">
                    🗑️ 清空
                </button>
                <button @click="copyToClipboard" class="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md 
                   hover:bg-blue-700 active:scale-95 transition-all duration-200"
                    :disabled="!modelValue.trim() || disabled">
                    📋 複製內容
                </button>

            </div>
        </div>

        <transition name="fade">
            <p v-if="copied" class="text-green-600 text-sm mt-2">
                ✅ 已複製到剪貼簿！
            </p>
        </transition>

        <p v-if="error" class="text-red-600 text-sm mt-1">
            ⚠️ {{ error }}
        </p>
        <div class="py-2">
            <textarea :id="id" :rows="rows" :value="modelValue" @input="handleInput" class="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none
               transition-all duration-200" placeholder="請輸入內容..." :disabled="disabled">
      </textarea>
        </div>


    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'

interface Props {
    modelValue: string
    rows?: number
    id?: string
    disabled?: boolean
    maxLength?: number
    showCharCount?: boolean
    validateFn?: (value: string) => string | null
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    rows: 10,
    id: () => `textarea-${Math.random().toString(36).substr(2, 9)}`,
    disabled: false,
    maxLength: undefined,
    showCharCount: false,
    validateFn: undefined
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
    'copy': [value: string]
    'clear': []
}>()

const copied = ref(false)
const error = ref<string | null>(null)

// 處理輸入事件
const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    let value = target.value

    // 字數限制檢查
    if (props.maxLength && value.length > props.maxLength) {
        value = value.substring(0, props.maxLength)
    }

    // 自定義驗證
    if (props.validateFn) {
        const validationError = props.validateFn(value)
        error.value = validationError
    } else {
        error.value = null
    }

    emit('update:modelValue', value)
}

// 複製到剪貼簿
const copyToClipboard = async () => {
    if (!props.modelValue.trim()) return

    try {
        await navigator.clipboard.writeText(props.modelValue)
        copied.value = true
        emit('copy', props.modelValue)
        setTimeout(() => (copied.value = false), 2000)
    } catch (err) {
        console.error('複製失敗:', err)
        // 降級方案：使用舊版 API
        try {
            const textArea = document.createElement('textarea')
            textArea.value = props.modelValue
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            copied.value = true
            emit('copy', props.modelValue)
            setTimeout(() => (copied.value = false), 2000)
        } catch (fallbackErr) {
            error.value = '複製失敗，請手動複製'
        }
    }
}

// 清空內容
const clearContent = () => {
    emit('update:modelValue', '')
    emit('clear')
    error.value = null
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>