<!-- components/atoms/XButton.vue -->
<template>
    <button
      :class="[
        'px-3 py-1 rounded transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses,
        sizeClasses,
        $attrs.class
      ]"
      :disabled="disabled"
      v-bind="$attrs"
    >
      <slot />
    </button>
  </template>
  
  <script setup lang="ts">
  interface Props {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
  }
  
  const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    disabled: false
  })
  
  const variantClasses = computed(() => {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-400 text-white hover:bg-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      success: 'bg-green-600 text-white hover:bg-green-700',
      warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
      ghost: 'border border-gray-300 bg-transparent hover:bg-gray-50'
    }
    return variants[props.variant]
  })
  
  const sizeClasses = computed(() => {
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-base'
    }
    return sizes[props.size]
  })
  </script>