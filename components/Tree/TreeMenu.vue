<template>
    <ul class="space-y-1">
        <li v-for="(item, index) in items" :key="index" class="group">
            <!-- 主選單（有 dropdown） -->
            <div v-if="item.dropdown">
                <button @click="toggle(index); emit('select', item)"
                    class="flex items-center text-gray-800 font-semibold w-full text-left hover:text-blue-600">
                    <span class="mr-1">
                        <svg :class="openItems[index] ? 'rotate-90' : ''"
                            class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                    {{ item.label }}
                </button>
                <transition name="fade">
                    <ul v-if="openItems[index]" class="ml-5 mt-1 space-y-1 border-l border-gray-300 pl-3">
                        <li v-for="(sub, subIndex) in item.dropdown" :key="subIndex">
                            <button @click="emit('select', sub)"
                                class="text-gray-600 hover:text-blue-600 transition w-full text-left">
                                {{ sub.label }}
                            </button>
                        </li>
                    </ul>
                </transition>
            </div>

            <!-- 主選單（無 dropdown） -->
            <div v-else>
                <button @click="emit('select', item)"
                    class="text-gray-800 hover:text-blue-600 font-semibold w-full text-left">
                    {{ item.label }}
                </button>
            </div>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const props = defineProps<{
    items: Array<{
        label: string
        href?: string
        id: string
        type: string
        nav_item_id: string,
        order: string,
        dropdown?: Array<{ label: string; href?: string, id: string, type: string, nav_item_id: string, order: string }>
    }>
}>()

const emit = defineEmits<{
    (e: 'select', item: { label: string; href?: string, id: string, type: string, nav_item_id: string, order: string }): void
}>()

const openItems = ref<{ [key: number]: boolean }>({})

const toggle = (index: number) => {
    openItems.value[index] = !openItems.value[index]
}

watchEffect(() => {
    props.items.forEach((_, i) => {
        if (!(i in openItems.value)) openItems.value[i] = false
    })
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
