<template>
    <div class="p-4 border-2 border-dashed rounded text-center space-y-2">
        <label class="block font-semibold mb-2">📁 選擇 SRT 字幕檔案：</label>
        <input type="file" accept=".srt" @change="handleFileChange" class="block w-full text-sm border rounded p-2" />
    </div>
</template>

<script setup lang="ts">
//import { useSrtParser } from '#imports'
import type { SubtitleItem } from '~/types/subtitle'
import { useBaseUrl } from '#imports'
const apibaseUrl = useBaseUrl()
const emit = defineEmits<{
    (e: 'parsed', subtitles: SubtitleItem[]): void
}>()

const handleFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (!file) return

    if (!file.name.endsWith('.srt')) {
        alert('請選擇副檔名為 .srt 的字幕檔案')
        return
    }

    try {
        const text = await file.text()
        //const parser = useSrtParser()
        //const subtitles = parser.parse(text)
        //emit('parsed', subtitles)
    } catch (error) {
        console.error('讀取檔案錯誤', error)
        alert('解析字幕檔失敗，請檢查檔案格式')
    }
}
</script>
