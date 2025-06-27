<template>
    <form @submit.prevent="submit" class="border p-4 bg-white rounded shadow-md mb-6">
        <div class="mb-2">
            <label class="block font-semibold">主選單名稱</label>
            <input v-model="form.label" class="form-input w-full" required />
        </div>

        <div class="mb-2">
            <label class="block font-semibold">主選單連結</label>
            <input v-model="form.href" class="form-input w-full" />
        </div>

        <div class="mb-4">
            <label class="block font-semibold mb-1">角色群組</label>
            <RoleSelector v-model="form.role_ids" :roles="roles" />
        </div>

        <!-- Dropdowns -->
        <div class="mb-4">
            <label class="block font-semibold mb-1">下拉選單</label>
            <NavDropdownForm v-for="(d, idx) in form.dropdowns" :key="idx" :dropdown="d" :roles="roles"
                @remove="form.dropdowns.splice(idx, 1)" />
            <button type="button" class="mt-2 text-sm text-blue-600 hover:underline" @click="addDropdown">
                ➕ 新增子選單
            </button>
        </div>

        <div class="text-right">
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {{ editMode ? '更新' : '新增' }}選單
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import RoleSelector from './RoleSelector.vue'
import NavDropdownForm from './NavDropdownForm.vue'

const emit = defineEmits(["submitted"])

const props = defineProps<{
    navItem?: any
}>()

const roles = ref<{ id: number; name: string }[]>([])

const baseUrl = useBaseUrl()
const url = `${baseUrl}/query/role`

const fetchRoles = async () => {
    const res = await useApi(url, { method: "GET" }) // ❗根據你的後端修改
    if (res && !res.error) {
        roles.value = res.data
    } else {
        alert("取得角色列表有誤")
        roles.value = []
    }
}

onMounted(fetchRoles)

const form = reactive({
    label: "",
    href: "",
    role_ids: [] as number[],
    dropdowns: [] as {
        label: string
        href: string
        role_ids: number[]
    }[]
})

const editMode = computed(() => !!props.navItem)

watchEffect(() => {
    if (props.navItem) {
        form.label = props.navItem.label
        form.href = props.navItem.href
        form.role_ids = [...props.navItem.roles]
        form.dropdowns = props.navItem.dropdowns.map((d: any) => ({
            label: d.label,
            href: d.href,
            role_ids: d.roles
        }))
    }
})

const addDropdown = () => {
    form.dropdowns.push({
        label: "",
        href: "",
        role_ids: []
    })
}

const submit = async () => {
    const endpoint = editMode.value
        ? `http://localhost:8000/nav/items/${props.navItem.id}`
        : `http://localhost:8000/nav/items`

    const method = editMode.value ? "PUT" : "POST"

    await $fetch(endpoint, {
        method,
        body: form
    })

    emit("submitted")
    if (!editMode.value) {
        form.label = ""
        form.href = ""
        form.role_ids = []
        form.dropdowns = []
    }
}
</script>
