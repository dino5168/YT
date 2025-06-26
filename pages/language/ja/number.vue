<template>
    <div class="min-h-screen bg-gray-50 p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">1〜100 の日本語数字表</h1>

        <div class="overflow-x-auto">
            <table class="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
                <thead class="bg-blue-600 text-white">
                    <tr>
                        <th class="px-4 py-2 text-left">數字</th>
                        <th class="px-4 py-2 text-left">漢字（日語）</th>
                        <th class="px-4 py-2 text-left">平假名（讀音）</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in numbers" :key="index" class="even:bg-gray-100">
                        <td class="px-4 py-2">{{ item.number }}</td>
                        <td class="px-4 py-2">{{ item.kanji }}</td>
                        <td class="px-4 py-2">{{ item.kana }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
const numbers = Array.from({ length: 100 }, (_, i) => {
    const n = i + 1
    const getKanji = (num: number): string => {
        const units = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九']
        const tens = ['', '十', '二十', '三十', '四十', '五十', '六十', '七十', '八十', '九十']
        if (num <= 10) return ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][num - 1]
        const t = Math.floor(num / 10)
        const u = num % 10
        return tens[t] + (u !== 0 ? units[u] : '')
    }

    const getKana = (num: number): string => {
        const unitsKana = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう']
        const tensKana = ['', 'じゅう', 'にじゅう', 'さんじゅう', 'よんじゅう', 'ごじゅう', 'ろくじゅう', 'ななじゅう', 'はちじゅう', 'きゅうじゅう']
        if (num <= 10) return ['いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう', 'じゅう'][num - 1]
        const t = Math.floor(num / 10)
        const u = num % 10
        return tensKana[t] + (u !== 0 ? unitsKana[u] : '')
    }

    return {
        number: n,
        kanji: getKanji(n),
        kana: getKana(n)
    }
})
</script>

<style scoped>
table {
    border-collapse: collapse;
}
</style>
