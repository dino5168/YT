<script setup lang="ts">
const props = defineProps<{
    roles: { id: number; name: string }[]
    modelValue: number[]
}>()

const emit = defineEmits(["update:modelValue"])

// 建立可寫的 local 值
const localValue = ref<number[]>([...props.modelValue])

watch(localValue, (val) => {
    emit("update:modelValue", val)
})

watch(() => props.modelValue, (val) => {
    localValue.value = [...val]
})
</script>

<template>
    <div class="grid grid-cols-2 gap-2">
        <label v-for="role in roles" :key="role.id" class="flex items-center space-x-2">
            <input type="checkbox" :value="role.id" v-model="localValue" class="form-checkbox text-blue-500" />
            <span>{{ role.name }}</span>
        </label>
    </div>
</template>
