<template>
    <div class="prose max-w-5xl mx-auto py-10 px-4">
      <h1 class="text-3xl font-bold">ERD 實體關聯圖詳解</h1>
  
      <section>
        <h2 class="text-2xl font-semibold mt-6">什麼是 ERD？</h2>
        <p>
          <strong>ERD (Entity-Relationship Diagram)</strong> 是實體關聯圖，是一種用來描述資料庫設計的圖形化工具。它顯示了：
        </p>
        <ul class="list-disc list-inside">
          <li><strong>實體 (Entity)</strong>：資料庫中的表格</li>
          <li><strong>屬性 (Attribute)</strong>：表格中的欄位</li>
          <li><strong>關聯 (Relationship)</strong>：表格之間的關係</li>
        </ul>
      </section>
  
      <section>
        <h2 class="text-2xl font-semibold mt-6">Mermaid erDiagram 語法說明</h2>
  
        <h3 class="text-xl font-bold mt-4">1. 基本語法結構</h3>
        <pre><code>erDiagram
      TABLE_NAME {
          datatype column_name constraints
          datatype column_name constraints
      }</code></pre>
  
        <h3 class="text-xl font-bold mt-4">2. 資料類型 (Data Types)</h3>
        <ul class="list-disc list-inside">
          <li><code>int</code> - 整數</li>
          <li><code>varchar</code> - 變長字串</li>
          <li><code>text</code> - 長文本</li>
          <li><code>boolean</code> - 布林值</li>
          <li><code>timestamp</code> - 時間戳記</li>
        </ul>
  
        <h3 class="text-xl font-bold mt-4">3. 約束條件 (Constraints)</h3>
        <ul class="list-disc list-inside">
          <li><code>PK</code> - Primary Key (主鍵)</li>
          <li><code>FK</code> - Foreign Key (外鍵)</li>
          <li><code>UK</code> - Unique Key (唯一鍵)</li>
          <li><code>NN</code> - Not Null (不可為空)</li>
        </ul>
  
        <h3 class="text-xl font-bold mt-4">4. 關聯符號說明</h3>
        <pre><code>||--||  一對一 (One-to-One)
  ||--o{  一對多 (One-to-Many)
  }o--||  多對一 (Many-to-One)
  }o--o{  多對多 (Many-to-Many)</code></pre>
  
        <h3 class="text-xl font-bold mt-4">5. 實際關聯範例</h3>
        <pre><code>CATEGORIES ||--o{ PRODUCTS : "has many"
  EMPLOYEES ||--o{ EMPLOYEES : "manages"</code></pre>
      </section>
  
      <section>
        <h2 class="text-2xl font-semibold mt-6">我們代碼表的關聯分析</h2>
        <pre><code>CODE_CATEGORIES ||--o{ CODES : "category_id"
  CODES ||--o{ CODE_TRANSLATIONS : "code_id"
  CODES ||--o{ CODE_ATTRIBUTES : "code_id"
  CODES ||--o{ CODES : "parent_code_id"</code></pre>
      </section>
  
      <section>
        <h2 class="text-2xl font-semibold mt-6">ERD 的優點</h2>
        <ul class="list-disc list-inside">
          <li>視覺化清晰：一目了然地看出表格結構</li>
          <li>設計溝通：幫助團隊共同理解資料結構</li>
          <li>資料庫設計：幫助發現潛在問題</li>
          <li>文檔記錄：便於維護與擴展</li>
        </ul>
      </section>
  
      <section>
        <h2 class="text-2xl font-semibold mt-6">閱讀 ERD 的技巧</h2>
        <ul class="list-disc list-inside">
          <li>從主要實體開始：找出核心業務實體</li>
          <li>追蹤關聯關係：理解資料流向</li>
          <li>注意約束條件：確保完整性與一致性</li>
          <li>理解基數：掌握資料關係模型</li>
        </ul>
      </section>
  
      <section>
        <h2 class="text-2xl font-semibold mt-6">常見 ERD 模式</h2>
        <pre><code>MASTER ||--o{ DETAIL : "has details"
  CATEGORY ||--o{ ITEM : "categorizes"
  NODE ||--o{ NODE : "parent-child"
  ENTITY ||--o{ TRANSLATION : "translates"</code></pre>
      </section>
  
      <section>
        <h2 class="text-2xl font-semibold mt-6">總結</h2>
        <p>
          ERD 是資料庫設計的重要工具，透過圖形化方式幫助我們：
        </p>
        <ul class="list-disc list-inside">
          <li>清楚展示資料結構</li>
          <li>明確表達關聯關係</li>
          <li>便於團隊溝通</li>
          <li>提高設計品質</li>
        </ul>
        <p>
          在我們的代碼表設計中，ERD 幫助我們理解各表之間的關係，確保設計的完整性與可維護性。
        </p>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  // 無需額外邏輯
  </script>
  
  <style scoped>
  /* 使用 TailwindCSS 已有良好預設樣式，可補充主題顏色或段落邊界 */
  </style>
  