<template>
    <div class="p-6 max-w-3xl mx-auto">
        <h1 class="text-2xl font-bold mb-4">字幕修正</h1>

        <!-- 輸入 videoId -->
        <div class="flex gap-2 mb-6">
            <input v-model="videoId" placeholder="Enter YouTube Video ID" class="flex-1 border rounded px-4 py-2"
                @keyup.enter="fetchSRT" />
            <button @click="fetchSRT" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Load
            </button>
        </div>

        <!-- 狀態 -->
        <div v-if="loading" class="text-gray-500">Loading subtitles...</div>
        <div v-else-if="error" class="text-red-600">⚠️ Failed to load subtitles.</div>

        <!-- 字幕內容 -->
        <div v-else-if="subtitles.length > 0" class="space-y-6">
            <div v-for="(item, index) in subtitles" :key="index" class="border-b pb-4">
                <!-- 若正在編輯 -->
                <div v-if="editingIndex === index" class="space-y-2">
                    <div class="flex gap-2">
                        <input v-model="editForm.start_time" class="border px-2 py-1 w-1/3" />
                        <input v-model="editForm.end_time" class="border px-2 py-1 w-1/3" />
                    </div>
                    <input v-model="editForm.en_text" class="w-full border px-2 py-1" />
                    <input v-model="editForm.zh_text" class="w-full border px-2 py-1" />
                    <div class="flex gap-2 mt-2">
                        <button @click="saveEdit(index)" class="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                        <button @click="cancelEdit" class="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                    </div>
                </div>

                <!-- 顯示模式 -->
                <div v-else>
                    <div class="text-sm text-gray-400">
                        {{ item.start }} → {{ item.end }}
                    </div>
                    <div class="mt-2">
                        <p class="text-lg font-medium">seq:{{ item.seq }}</p>
                        <p class="text-lg font-medium">{{ item.en }}</p>
                        <p class="text-base text-gray-700">{{ item.zh }}</p>
                    </div>
                    <button @click="editSubtitle(index, item)" class="text-blue-600 text-sm mt-2">✏️ Edit</button>
                </div>
            </div>
        </div>

        <!-- 無字幕 -->
        <div v-else class="text-gray-500">No subtitles loaded.</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useSubtitleLoader } from "~/composables/useSubtitleLoader"
import { TimeUtil } from '~/composables/useTimeUtils'
//const { displayTime } = useTimeUtils()

const videoId = ref("jKi2SvWOCXc")
const config = useRuntimeConfig()
const srtBaseUrl = config.public.srtBaseUrl

const { subtitles, loadStatus, error, loadSubtitle } = useSubtitleLoader()
const loading = ref(false)

const fetchSRT = async () => {

    loading.value = true
    await loadSubtitle(videoId.value, srtBaseUrl)
    loading.value = false
}

// 🟡 編輯邏輯區
const editingIndex = ref<number | null>(null)
const editForm = ref({
    id: 0,
    seq: 1,
    start_time: '',
    end_time: '',
    en_text: '',
    zh_text: ''
})

const editSubtitle = (index: number, item: any) => {
    editingIndex.value = index
    editForm.value = {
        id: item.id,
        seq: item.seq,
        start_time: item.start,
        end_time: item.end,
        en_text: item.en,
        zh_text: item.zh
    }
}

const cancelEdit = () => {
    editingIndex.value = null
}

const saveEdit = async (index: number) => {
    // 修改 URL 格式：从 /subtitles/{id} 改为 /subtitles/{video_id}/{seq}
    //const putUrl = `http://127.0.0.1:8000/subtitles/${videoId.value}/${index + 1}`
    const putUrl = `http://127.0.0.1:8000/subtitles/${videoId.value}/${editForm.value.seq}`

    //alert(putUrl)
    try {
        await $fetch(putUrl, {
            method: 'PUT',
            body: {
                // 注意：video_id 和 seq 现在在路径参数中，不需要在 body 中传递
                // 但为了保持向后兼容或其他逻辑需要，你也可以保留在 body 中
                video_id: videoId.value,  // 可选，因为已经在路径中
                seq: editForm.value.seq,          // 可选，因为已经在路径中
                start_time: editForm.value.start_time,
                end_time: editForm.value.end_time,
                en_text: editForm.value.en_text,
                zh_text: editForm.value.zh_text,
            }
        })

        // 更新本地字幕陣列內容
        subtitles.value[index].seq = editForm.value.seq
        subtitles.value[index].start = editForm.value.start_time
        subtitles.value[index].end = editForm.value.end_time
        subtitles.value[index].en = editForm.value.en_text
        subtitles.value[index].zh = editForm.value.zh_text

        editingIndex.value = null
    } catch (err) {
        alert("❌ Update failed.")
        console.error(err)
    }
}

// 如果你想要完全清理 body，只保留需要更新的字段：
const saveEditClean = async (index: number) => {
    const putUrl = `http://127.0.0.1:8000/subtitles/${videoId.value}/${index + 1}`

    try {
        await $fetch(putUrl, {
            method: 'PUT',
            body: {
                // 只传递需要更新的内容字段
                start_time: editForm.value.start_time,
                end_time: editForm.value.end_time,
                en_text: editForm.value.en_text,
                zh_text: editForm.value.zh_text,
            }
        })

        // 更新本地字幕陣列內容
        subtitles.value[index].start = editForm.value.start_time
        subtitles.value[index].end = editForm.value.end_time
        subtitles.value[index].en = editForm.value.en_text
        subtitles.value[index].zh = editForm.value.zh_text

        editingIndex.value = null
    } catch (err) {
        alert("❌ Update failed.")
        console.error(err)
    }
}
</script>
