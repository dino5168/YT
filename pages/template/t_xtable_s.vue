<template>
  <div class="mx-auto py-6">
    <XTable_S
      :rows="users"
      :columns="columns"
      :column-descriptions="descriptions"
      :column-widths="columnWidths"
      :gridlines="true"
      :page-size="5"
      @row-click="handleRowClick">
      <!-- 自訂 role 欄顯示 -->
      <template #cell-role="{value}">
        <span
          class="inline-block px-2 py-0.5 rounded text-xs font-medium"
          :class="{
            'bg-blue-100 text-blue-700': value === 'admin',
            'bg-green-100 text-green-700': value === 'user',
            'bg-gray-100 text-gray-700': value === 'guest',
          }">
          {{ value }}
        </span>
      </template>
    </XTable_S>
  </div>
</template>

<script setup lang="ts">
import XTable_S from "~/components/Table/XTable_S.vue";

const columns = ["id", "name", "email", "role"];
const descriptions = ["ID", "姓名", "電子信箱", "角色"];
const columnWidths = {
  name: "150px",
  email: "250px",
  role: "100px",
};

const users = [
  {id: 1, name: "Alice", email: "alice@example.com", role: "admin"},
  {id: 2, name: "Bob", email: "bob@example.com", role: "user"},
  {id: 3, name: "Charlie", email: "charlie@example.com", role: "user"},
  {id: 4, name: "Dino", email: "dino@example.com", role: "admin"},
  {id: 5, name: "Eva", email: "eva@example.com", role: "guest"},
  {id: 6, name: "Frank", email: "frank@example.com", role: "user"},
  {id: 7, name: "Grace", email: "grace@example.com", role: "guest"},
];

function handleRowClick(row: any) {
  console.log("點選列資料：", row);
}
</script>
