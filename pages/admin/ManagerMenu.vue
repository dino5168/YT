<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <h1 class="text-2xl font-bold mb-4">網站導覽樹狀結構-<span class="text-red-600">系統管理者使用請小心操作</span></h1>
        <div class="flex space-x-2">
            <button class="bg-blue-900 font-bold px-2 py-1 hover:cursor-pointer rounded-sm text-white"
                @click="dataAppendMain">新增主選單</button>
            <button class="bg-green-900 font-bold px-2 py-1 hover:cursor-pointer rounded-sm text-white"
                @click="dataUpdate">修改</button>
            <button class="bg-red-900 font-bold px-2 py-1 hover:cursor-pointer rounded-sm text-white"
                @click="dataDelete">刪除</button>
            <button class="bg-blue-900 font-bold px-2 py-1 hover:cursor-pointer rounded-sm text-white"
                @click="dataAppendSub">新增子選單</button>

        </div>

        <div class="flex pt-6">
            <!-- Tree Menu -->
            <div class="w-1/3">
                <TreeMenu :items="navItems" @select="handleSelect" />
            </div>

            <!-- 編輯區 -->
            <div id="menuEdit" class="bg-blue-800 w-2/3 h-[20rem] p-4 overflow-auto">
                <template v-if="selectedItem">
                    <h2 class="text-xl font-bold text-white mb-2">編輯選單項目</h2>
                    <div class="mb-2">
                        <label class="text-white font-semibold block">型態(0:主,1:子) : {{ editForm.type }}</label>
                    </div>
                    <div>
                        <label class="text-white font-semibold block">ID:{{ editForm.id }}</label>
                    </div>
                    <div>
                        <label class="text-white font-semibold block">Nav_item_id:{{ editForm.nav_item_id }}
                            <input v-model="editForm.nav_item_id" type="text" class="w-full px-2 py-1 rounded" />
                        </label>
                    </div>

                    <div>
                        <label class="text-white font-semibold block">名稱:</label>
                        <input v-model="editForm.label" type="text" class="w-full px-2 py-1 rounded" />
                    </div>

                    <div>
                        <label class="text-white font-semibold block">連結:</label>
                        <input v-model="editForm.href" type="text" class="w-full px-2 py-1 rounded" />
                    </div>
                </template>

                <template v-else>
                    <p class="text-white italic">請點擊左側項目以編輯</p>
                </template>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import TreeMenu from '~/components/Tree/TreeMenu.vue'

const navItems = ref([])
const selectedItem = ref<{ label: string; href?: string, id: string, type: string, nav_item_id: string } | null>(null)
const editForm = ref({ label: '', href: '', id: '', type: '', nav_item_id: '' })
const baseUrl = useBaseUrl()
const urlNavLinks = `${baseUrl}/nav/links`

const handleSelect = (item: { label: string; href?: string, id: string, type: string, nav_item_id: string }) => {
    selectedItem.value = item
    editForm.value = {
        id: item.id,
        type: item.type,
        label: item.label,
        nav_item_id: item.nav_item_id,
        href: item.href || '',

    }
}

const getPutUrl = () => {

    if (editForm.value.type === "0") {
        return `${baseUrl}/nav/updateNav0/${editForm.value.id}`
    }
    return `${baseUrl}/nav/updateNav1/${editForm.value.id}`
}
const getBody = () => {
    if (editForm.value === null) {
        return {}
    }

    if (editForm.value.type === "0") {
        return {
            label: editForm.value.label,
            href: editForm.value.href,
        }
    } else {
        return {
            label: editForm.value.label,
            href: editForm.value.href,
            nav_item_id: editForm.value.nav_item_id

        }
    }
}

//修改
const dataUpdate = async () => {
    const putUrl = getPutUrl()
    const token = useCookie('auth_token').value
    const { data, error } = await useApi(putUrl, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
        },
        body: getBody(),
    })

    if (error) {
        alert(`更新失敗：${error}`)
    } else {
        //alert(`更新成功：${JSON.stringify(data)}`)
        fetchNavItems()
    }
}
// 新增的 Url
const getPostUrl = () => {
    if (editForm.value.type === "0") {
        return `${baseUrl}/nav/createNav0`
    }
    return `${baseUrl}/nav/createNav1`
}

//資料新增
const dataAppendMain = async () => {

    const postUrl = getPostUrl()

    const token = useCookie('auth_token').value

    const { data, error } = await useApi(postUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
        },
        body: getBody(),
    })

    if (error) {
        alert(`新增失敗：${error}`)
    } else {
        //alert(`新增成功：${JSON.stringify(data)}`)
        fetchNavItems()
    }
}

const dataAppendSub = async () => {
    editForm.value.type = "1"

    const postUrl = getPostUrl()
    alert(postUrl)
    const token = useCookie('auth_token').value

    const { data, error } = await useApi(postUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
        },
        body: getBody(),
    })

    if (error) {
        alert(`新增失敗：${error}`)
    } else {
        //alert(`更新成功：${JSON.stringify(data)}`)
        fetchNavItems()
    }
}

//刪除URL
const getDeleteUrl = () => {

    if (editForm.value.type === "0") {
        return `${baseUrl}/nav/deleteNav0/${editForm.value.id}`
    }
    return `${baseUrl}/nav/deleteNav1/${editForm.value.id}`

}
//刪除資料
const dataDelete = async () => {
    const deleteUrl = getDeleteUrl()
    alert(deleteUrl)
    const token = useCookie('auth_token').value
    const { data, error } = await useApi(deleteUrl, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
        },
        body: getBody(),
    })

    if (error) {
        alert(`刪除失敗：${error}`)
    } else {
        //alert(`刪除成功：${JSON.stringify(data)}`)
        fetchNavItems()
    }
}

// ✅ 抽成一個函式
const fetchNavItems = async () => {
    const res = await fetch(urlNavLinks)
    navItems.value = await res.json()
}

onMounted(async () => {
    fetchNavItems()
})
</script>
