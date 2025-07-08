<template>
    <div ref="container" class="mermaid" />
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import mermaid from 'mermaid'
  
  const props = defineProps<{
    chart: string
  }>()
  
  const container = ref<HTMLElement>()
  
  onMounted(async () => {
    mermaid.initialize({ startOnLoad: false })
    renderChart()
  })
  
  watch(() => props.chart, () => {
    renderChart()
  })
  
  function renderChart() {
    if (container.value) {
      container.value.innerHTML = props.chart
      mermaid.contentLoaded()
    }
  }
  </script>
  
  <style scoped>
  .mermaid {
    overflow-x: auto;
  }
  </style>
  