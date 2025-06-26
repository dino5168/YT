<template>
    <div :class="containerClass">
        <component :is="iconComponent" v-bind="$attrs" :class="iconClass" />
        <div :class="valueClass">{{ value }}</div>
        <div :class="labelClass">{{ label }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, useAttrs } from 'vue'
import * as icons from 'lucide-vue-next'

interface Props {
    icon: string
    label: string
    value: string | number
    color?: 'blue' | 'green' | 'yellow' | 'red'
}

// 預設 color 為 blue
const props = withDefaults(defineProps<Props>(), {
    color: 'blue'
})

// 傳遞其餘屬性，如 stroke-width、aria-label
const attrs = useAttrs()

// 圖標組件邏輯處理（包含前綴移除 + PascalCase 轉換 + fallback）
const iconComponent = computed(() => {
    let iconName = props.icon.trim().replace(/^(fa-|fas-|far-|fal-|fab-)/i, '')

    const iconMap: Record<string, string> = {
        'clock': 'Clock',
        'tachometer-alt': 'Gauge',
        'bullseye': 'Target',
        'times-circle': 'XCircle'
    }

    const resolvedName = iconMap[iconName] || iconName

    const pascalName = resolvedName
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')

    const component = icons[pascalName as keyof typeof icons]
    return (component ?? icons.HelpCircle) as ReturnType<typeof defineComponent>
})

// 色彩樣式定義
const colorStyles = {
    blue: {
        container: 'bg-blue-50',
        icon: 'text-blue-500',
        value: 'text-blue-600',
        label: 'text-blue-500'
    },
    green: {
        container: 'bg-green-50',
        icon: 'text-green-500',
        value: 'text-green-600',
        label: 'text-green-500'
    },
    yellow: {
        container: 'bg-yellow-50',
        icon: 'text-yellow-500',
        value: 'text-yellow-600',
        label: 'text-yellow-500'
    },
    red: {
        container: 'bg-red-50',
        icon: 'text-red-500',
        value: 'text-red-600',
        label: 'text-red-500'
    }
}

// 样式计算
const containerClass = computed(() =>
    `${colorStyles[props.color].container} p-4 rounded-lg text-center`
)

const iconClass = computed(() =>
    `w-6 h-6 mb-2 mx-auto ${colorStyles[props.color].icon}`
)

const valueClass = computed(() =>
    `text-2xl font-bold ${colorStyles[props.color].value}`
)

const labelClass = computed(() =>
    `text-sm ${colorStyles[props.color].label}`
)
</script>
