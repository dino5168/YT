<template>
    <div class="mb-4">
        <label class="text-sm font-medium text-gray-700 mb-1 block">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>
        <input v-model="modelValueProxy" :placeholder="placeholder" type="email" :required="required" maxlength="30"
            class="px-3 py-2 text-sm border rounded-md w-full focus:outline-none focus:ring-2 transition-colors duration-200"
            :class="{
                'border-red-500 ring-red-300 focus:ring-red-500': hasError,
                'border-gray-300 focus:ring-blue-500': !hasError
            }" @blur="validateEmail" @input="onInput" />
        <p v-if="hasError" class="text-xs text-red-500 mt-1">
            {{ errorMessage }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
    modelValue: string
    label: string
    placeholder?: string
    required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: '',
    required: false
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

// 更嚴格的 Email 正則表達式
//const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

const hasError = ref(false)
const errorMessage = ref('')

const modelValueProxy = computed({
    get: () => props.modelValue,
    set: (val: string) => {
        emit('update:modelValue', val)
    }
})

function validateEmail() {
    const value = props.modelValue.trim()

    if (props.required && value === '') {
        hasError.value = true
        errorMessage.value = '此欄位為必填'
        return false
    }

    if (value !== '' && !emailRegex.test(value)) {
        hasError.value = true
        errorMessage.value = '請輸入有效的 Email 格式'
        return false
    }

    hasError.value = false
    errorMessage.value = ''
    return true
}

function onInput() {
    // 在輸入時清除錯誤狀態（如果有內容且格式正確）
    if (hasError.value && props.modelValue.trim() !== '') {
        validateEmail()
    }
}

// 暴露驗證方法給父元件使用
defineExpose({
    validateEmail
})
</script>