<template>
    <div class="mb-4">
        <label class="text-sm font-medium text-gray-700 mb-1 block">
            {{ label }}
        </label>
        <input v-model="modelValueProxy" :placeholder="props.placeholder"
            class="px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    modelValue: string
    label: string
    placeholder?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const modelValueProxy = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})
</script>
