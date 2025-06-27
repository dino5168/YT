<template>
    <div class="min-h-screen  text-gray-900 py-6 space-y-8">
        <h1 class="text-3xl font-bold text-center">高效學習技巧整理</h1>

        <!-- 錯誤的學習方式 -->
        <section>
            <h2 class="text-2xl font-semibold mb-4 text-red-600">❌ 無效的學習方法</h2>
            <div class="grid gap-4 md:grid-cols-2">
                <div class="bg-white rounded-2xl p-4 shadow">
                    <h3 class="text-lg font-bold">重複閱讀</h3>
                    <p>看第二遍不等於學得更好，只是更熟悉，容易產生錯覺。</p>
                </div>
                <div class="bg-white rounded-2xl p-4 shadow">
                    <h3 class="text-lg font-bold">螢光筆劃重點</h3>
                    <p>被動劃線對學習效果不大，只有特定方式才有效。</p>
                </div>
                <div class="bg-white rounded-2xl p-4 shadow">
                    <h3 class="text-lg font-bold">抄寫筆記</h3>
                    <p>單純抄寫內容無助於理解與記憶，需搭配思考與重組。</p>
                </div>
                <div class="bg-white rounded-2xl p-4 shadow">
                    <h3 class="text-lg font-bold">學起來太輕鬆</h3>
                    <p>真正有效的學習應該讓你「感覺困難」。</p>
                </div>
            </div>
        </section>

        <!-- 有效的學習策略 -->
        <section class="py-8 mt-8">
            <h2 class="text-2xl font-semibold mb-4 text-green-700">✅ 有效的學習方法</h2>
            <div class="grid gap-4 md:grid-cols-2">
                <div class="bg-white rounded-2xl p-4 shadow">
                    <h3 class="text-lg font-bold">提取練習（Retrieval Practice）</h3>
                    <p>讀完後蓋上書，試著回想並寫下你能記住的內容。</p>
                </div>
                <div class="bg-white rounded-2xl p-4 shadow">
                    <h3 class="text-lg font-bold">精緻化處理（Elaboration）</h3>
                    <p>用自己的話講出知識內容，並問自己「為什麼？」</p>
                </div>
                <div class="bg-white rounded-2xl p-4 shadow">
                    <h3 class="text-lg font-bold">交錯學習（Interleaving）</h3>
                    <p>將不同主題混合學習，訓練問題辨識與應用力。</p>
                </div>
                <div class="bg-white rounded-2xl p-4 shadow">
                    <h3 class="text-lg font-bold">具體例子（Concrete Examples）</h3>
                    <p>抽象概念搭配生活化舉例，加深理解與記憶。</p>
                </div>
                <div class="bg-white rounded-2xl p-4 shadow">
                    <h3 class="text-lg font-bold">雙重編碼（Dual Coding）</h3>
                    <p>圖文並用效果最佳，例如示意圖 + 說明文字。</p>
                </div>
            </div>
        </section>

        <footer class="text-center text-sm text-gray-500 mt-12">
            以上內容整理自教育研究與學習心理學。
        </footer>
    </div>
</template>

<script setup>
// 無需邏輯腳本，純展示用途

useHead({
    title: '高效學習技巧整理'
})

</script>

<style scoped>
/* 這裡可加入進一步的客製樣式 */
</style>
