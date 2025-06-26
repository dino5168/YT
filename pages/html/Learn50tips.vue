<template>
    <div class="max-w-3xl mx-auto p-6 text-gray-800">
        <h1 class="text-3xl font-bold mb-4">🗣️ English Tips for Beginners</h1>

        <section v-for="(tip, index) in tips" :key="index" class="mb-6 bg-white shadow rounded-xl p-4">
            <h2 class="text-xl font-semibold mb-2">Tip {{ index + 1 }}: {{ tip.title }}</h2>
            <ul class="list-disc pl-5 space-y-1">
                <li v-for="(point, i) in tip.points" :key="i">{{ point }}</li>
            </ul>
        </section>

        <footer class="text-sm text-center text-gray-500 mt-10">
            <p>📚 More resources: <a href="https://www.engvid.com" target="_blank"
                    class="text-blue-600 underline">engVid.com</a></p>
            <p>▶️ YouTube Channel: <a href="https://www.youtube.com/user/EnglishTeacherEmma"
                    class="text-blue-600 underline" target="_blank">Emma's English</a></p>
        </footer>
    </div>
</template>

<script setup lang="ts">
// 頁面標題
useHead({
    title: 'English Tips for Beginners'
})

const tips = [
    {
        title: "Learn Common Verbs First",
        points: [
            "先學 50 個最常見的動詞，如：be, have, go, do, make, say, think 等。",
            "這些動詞出現在大多數英文句子中。"
        ]
    },
    {
        title: "Don't Worry About Perfect Grammar",
        points: [
            "溝通比文法正確更重要。",
            "你可以犯錯，但還是能被理解。"
        ]
    },
    {
        title: "Focus on 3 Main Tenses",
        points: [
            "先學三個基本時態：簡單現在（I work）、簡單過去（I worked）、簡單未來（I will work）。",
            "其他九個時態之後再學習。"
        ]
    },
    {
        title: "Practice Short Listening",
        points: [
            "從 10 秒到 1 分鐘的英文片段開始練習聽力。",
            "避免一開始就看完整部電影。"
        ]
    },
    {
        title: "Learn Words Related to Your Life",
        points: [
            "先學與你生活有關的字彙，例如家庭、工作、日常活動（如 brush teeth）。",
            "常用的天氣用語也很實用：it's hot, it's cold 等。"
        ]
    },
    {
        title: "Practice a Little Every Day",
        points: [
            "每天練習 10 分鐘，幫助記憶與習慣建立。",
            "重複學習新單字，例如：週一學的單字，週二、三再複習一次。",
            "自我測驗有助於記憶新字。"
        ]
    }
]
</script>

<style scoped></style>
