<template>
    <div class="max-w-5xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">ERD 圖形視覺化</h1>
      <Mermaid :chart="erCode" />
    </div>
  </template>
  
  <script setup lang="ts">
  import Mermaid from '~/components/doc/Mermaid.vue'
  
  const erCode = `
  erDiagram
    CODE_CATEGORIES {
      int id PK
      varchar name NN
    }
    CODES {
      int id PK
      varchar value NN
      int category_id FK
      int parent_code_id FK
    }
    CODE_TRANSLATIONS {
      int id PK
      int code_id FK
      varchar language NN
      varchar text NN
    }
    CODE_ATTRIBUTES {
      int id PK
      int code_id FK
      varchar key NN
      varchar value
    }
  
    CODE_CATEGORIES ||--o{ CODES : category_id
    CODES ||--o{ CODE_TRANSLATIONS : code_id
    CODES ||--o{ CODE_ATTRIBUTES : code_id
    CODES ||--o{ CODES : parent_code_id
  `
  </script>
  