<template>
    <div class="p-4">
        <h1 class="text-gray-950 text-2xl">菜單管理</h1>
    </div>
    <div>
        <NavItemForm v-if="editingItem" :navItem="editingItem" @submitted="refresh" />
        <NavItemForm v-else @submitted="refresh" />

        <NavItemList :items="items" @edit="editingItem = $event" @delete="deleteItem" />

    </div>
</template>

<script setup>
import NavItemForm from '~/components/DbItems/NavItemForm.vue'      // ✅ 正確
import NavItemList from '~/components/DbItems/NavItemList.vue'

const baseUrl = useBaseUrl();

const items = ref([])
const editingItem = ref(null)

const refresh = async () => {
    const url = `${baseUrl}/nav/links`;
    items.value = await useApi(url, {
        method: "GET"
    })


    console.log(items.value)
    editingItem.value = null
}

const deleteItem = async (id) => {
    await $fetch(`http://localhost:8000/nav/items/${id}`, { method: "DELETE" })
    refresh()
}

onMounted(refresh)
</script>
