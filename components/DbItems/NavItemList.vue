<template>
    <div>
        <div v-for="item in items" :key="item.id" class="border rounded p-4 mb-4 bg-white shadow-sm">
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-semibold text-lg">{{ item.label }}</p>
                    <p class="text-sm text-gray-500">{{ item.href }}</p>
                </div>
                <div class="space-x-2">
                    <button class="text-blue-600 hover:underline" @click="$emit('edit', item)">編輯</button>
                    <button class="text-red-600 hover:underline" @click="$emit('delete', item.id)">刪除</button>
                </div>
            </div>

            <!-- dropdowns -->
            <div v-if="item.dropdowns.length" class="mt-2 pl-4 border-l">
                <div v-for="dropdown in item.dropdowns" :key="dropdown.id" class="text-sm text-gray-700 py-1">
                    <span>▸ {{ dropdown.label }}</span>
                    <span class="ml-2 text-gray-400">({{ dropdown.href }})</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    items: Array<any>;
}>()

defineEmits(['edit', 'delete'])
</script>
