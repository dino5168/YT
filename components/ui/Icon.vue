<template>
    <component :is="iconComponent" v-bind="attrs" :class="iconClass" />
</template>

<script setup lang="ts">
import { computed, defineComponent, useAttrs } from 'vue'
import * as icons from 'lucide-vue-next'

interface Props {
    name: string
    class?: string
}

const props = defineProps<Props>()
const attrs = useAttrs()

// 動態取得 icon 組件
const iconComponent = computed(() => {
    let iconName = props.name.trim()

    // 移除常見前綴
    iconName = iconName.replace(/^(fa-|fas-|far-|fal-|fab-)/i, '')

    // 特殊命名對應表
    const iconMap: Record<string, string> = {
        'trophy': 'Trophy',
        'clock': 'Clock',
        'tachometer-alt': 'Gauge',
        'bullseye': 'Target',
        'times-circle': 'XCircle',
        'play': 'Play',
        'redo': 'RotateCcw',
        'check': 'Check',
        'times': 'X'
    }

    // 使用映射名稱或原始名稱
    const resolvedName = iconMap[iconName] || iconName

    // 轉 PascalCase，例如 "user-check" → "UserCheck"
    const pascalName = resolvedName
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')

    // 找到對應 icon，若找不到則使用 HelpCircle 作為預設
    const component = icons[pascalName as keyof typeof icons]
    return (component ?? icons.HelpCircle) as ReturnType<typeof defineComponent>
})

// 設定圖示的 class（可被外部覆寫）
const iconClass = computed(() => props.class || 'w-5 h-5')
</script>
