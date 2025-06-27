<template>
    <div class="border p-3 mb-2 rounded bg-gray-50">
        <div class="flex gap-2 mb-2">
            <input v-model="dropdown.label" placeholder="子選單名稱" class="form-input w-1/2" />
            <input v-model="dropdown.href" placeholder="連結" class="form-input w-1/2" />
        </div>
        <div class="mb-2">
            <RoleSelector v-model="dropdown.role_ids" :roles="roles" />
        </div>
        <div class="text-right">
            <button class="text-red-500 text-sm hover:underline" @click="$emit('remove')">刪除</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import RoleSelector from './RoleSelector.vue'

defineProps<{
    dropdown: {
        label: string
        href: string
        role_ids: number[]
    }
    roles: { id: number; name: string }[]
}>()

defineEmits(['remove'])
</script>
