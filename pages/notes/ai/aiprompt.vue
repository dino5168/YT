<template>
    <div class="min-h-screen bg-gray-50 py-10 px-4">
        <div class="max-w-5xl mx-auto">
            <h1 class="text-4xl font-bold text-gray-900 mb-6">Prompt Design 概念總覽</h1>

            <!-- 1. Prompt Design 定義 -->
            <section class="mb-8">
                <h2 class="text-2xl font-semibold text-blue-700 mb-2">1. 何謂「Prompt Design」</h2>
                <p class="text-gray-700">
                    「Prompt Design」是一種將 AI 指令編寫（prompting）視為設計流程的概念，強調像網站設計一樣需具備清晰結構、良好邏輯與可維護性。
                    它由 Cursor 共同創辦人 Arvid 在 2023 年提出，目的在於讓 prompt 不只是「指令」而是「設計」，講究規則、模組、測試與輸出預測。
                </p>
            </section>

            <!-- 2. Parahelp 實作經驗 -->
            <section class="mb-8">
                <h2 class="text-2xl font-semibold text-blue-700 mb-2">2. Parahelp 的實作經驗</h2>
                <p class="text-gray-700 mb-2">
                    Parahelp 團隊開發 AI 客服系統，涵蓋像是 Perplexity、Framer、Replit、ElevenLabs 等客戶服務。他們的 prompt
                    僅數百行，卻投注了數百小時進行設計與修正，實現高度穩定與正確率。
                </p>
                <ul class="list-disc pl-5 text-gray-700 space-y-1">
                    <li>客服成功率是關鍵評估標準。</li>
                    <li>涵蓋真實錯誤、用戶不確定語句、資料不足情境。</li>
                </ul>
            </section>

            <!-- 3. Prompt 結構要素 -->
            <section class="mb-8">
                <h2 class="text-2xl font-semibold text-blue-700 mb-2">3. Prompt 的結構與要素</h2>
                <ul class="list-decimal pl-5 text-gray-700 space-y-2">
                    <li>
                        <strong>角色設定</strong>：指定 AI 的角色（如客服經理），提供背景知識與語氣指導，確保輸出符合期待。
                    </li>
                    <li>
                        <strong>任務分解</strong>：使用 XML/Markdown/JSON 標籤切分邏輯區塊（如 &lt;if_block&gt;），提升模型理解力與控制性。
                    </li>
                    <li>
                        <strong>few-shot 範例</strong>：給模型清楚的範例，讓其模仿格式與語氣，減少 hallucination。
                    </li>
                    <li>
                        <strong>格式規範</strong>：明確要求輸出格式，例如 JSON、Markdown、表格，便於前端或後端驗證處理。
                    </li>
                    <li>
                        <strong>錯誤處理</strong>：教模型遇到資料不足時說「我不知道」，或請用戶進一步澄清，避免瞎猜。
                    </li>
                    <li>
                        <strong>Meta-Prompting</strong>：讓模型參與生成自己的 prompt（如反覆優化、prompt folding）。
                    </li>
                    <li>
                        <strong>自動評估機制</strong>：建立 Evals 測試集與標準，量測正確率、可信度與成功率。
                    </li>
                </ul>
            </section>

            <!-- 4. 類比 Web 設計思維 -->
            <section class="mb-8">
                <h2 class="text-2xl font-semibold text-blue-700 mb-2">4. 類比 Web Design 的啟發</h2>
                <ul class="list-disc pl-5 text-gray-700 space-y-2">
                    <li>
                        <strong>動態資料與預覽</strong>：設計 prompt 時須即時檢視渲染效果，就像設計網站時需要即時預覽畫面。
                    </li>
                    <li>
                        <strong>組件化與宣告式架構</strong>：使用 JSX-like 或模組化語法撰寫 prompt，提升可維護性與可重用性（如 Priompt）。
                    </li>
                    <li>
                        <strong>效能與快取</strong>：盡量避免整段 prompt 重構，提高執行效率，也利於大型上下文模型延伸使用。
                    </li>
                </ul>
            </section>

            <!-- 5. 效益總結 -->
            <section class="mb-8">
                <h2 class="text-2xl font-semibold text-blue-700 mb-2">5. 核心效益與落地價值</h2>
                <ul class="list-disc pl-5 text-gray-700 space-y-2">
                    <li>
                        <strong>高可控性</strong>：在不同語境下仍能維持模型輸出的一致性與準確性。
                    </li>
                    <li>
                        <strong>良好可維護性</strong>：可快速修改、擴充、遷移至不同角色與場景。
                    </li>
                    <li>
                        <strong>可靠性</strong>：降低幻覺風險，建立錯誤處理與輸出標準化流程。
                    </li>
                    <li>
                        <strong>建立競爭力</strong>：將 prompt 設計視為企業資產與技術優勢。
                    </li>
                </ul>
            </section>

            <!-- Summary Table -->
            <section class="mb-12">
                <h2 class="text-2xl font-semibold text-blue-700 mb-2">📌 總結重點</h2>
                <div class="overflow-x-auto">

                    <table class=" table-auto rounded-md shadow-sm w-full text-left text-sm border border-gray-300">
                        <thead>
                            <tr class="bg-blue-100 text-gray-800">
                                <th class="px-4 py-2 border">範疇</th>
                                <th class="px-4 py-2 border">執行細節</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-700">
                            <tr>
                                <td class="border px-4 py-2">設計心態</td>
                                <td class="border px-4 py-2">像 UI 設計一樣結構化開發 prompt</td>
                            </tr>
                            <tr>
                                <td class="border px-4 py-2">核心技術</td>
                                <td class="border px-4 py-2">角色、任務拆解、格式控制、few-shot 範例</td>
                            </tr>
                            <tr>
                                <td class="border px-4 py-2">可靠性</td>
                                <td class="border px-4 py-2">錯誤處理、逃生出口、Meta-prompting</td>
                            </tr>
                            <tr>
                                <td class="border px-4 py-2">開發策略</td>
                                <td class="border px-4 py-2">組件化、快取、易於迭代</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
// 無需邏輯處理，單純靜態內容展示頁面
</script>

<style scoped></style>
