<template>
    <section class="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto space-y-12">
            <!-- 網站簡介 -->
            <div class="text-center">
                <h2 class="text-3xl font-bold text-gray-900">關於我們</h2>
                <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    高效影音英語學習網由朱子豪教授與莊基男副教授共同研發，結合語言教學與教育科技，讓您在真實語境中有效提升英語力。
                </p>
            </div>

            <!-- 教授卡片 -->
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
                <!-- 朱子豪教授 -->
                <CardTeacher name="朱子豪 教授" photo="/images/teacher01.png"
                    description="語言教育與語音科技專家，致力於結合人工智慧與多媒體教學技術，推動數位語言學習創新。" title="博士｜國立台灣大學｜現任國立台灣大學榮譽教授"
                    imageSize="lg" />
                <CardTeacher name="朱子豪 教授" photo="/images/teacher01.png"
                    description="語言教育與語音科技專家，致力於結合人工智慧與多媒體教學技術，推動數位語言學習創新。" title="博士｜國立台灣大學｜現任國立台灣大學榮譽教授"
                    imageSize="lg" />

                <CardTeacher name="朱子豪 教授" photo="/images/teacher01.png"
                    description="語言教育與語音科技專家，致力於結合人工智慧與多媒體教學技術，推動數位語言學習創新。" title="博士｜國立台灣大學｜現任國立台灣大學榮譽教授"
                    imageSize="lg" />
                <!-- 莊基男副教授 -->
                <CardTeacher name="莊基男 副教授" photo="/images/teacher02.png"
                    description="教育科技與數位平台開發專家，專注於互動式學習系統設計與學生自主學習歷程建構。" title="博士｜國立台灣大學｜現任華梵大學電子工程系主任"
                    imageSize="lg" />
                <!-- 莊基男副教授 -->
                <CardTeacher name="莊基男 副教授" photo="/images/teacher02.png"
                    description="教育科技與數位平台開發專家，專注於互動式學習系統設計與學生自主學習歷程建構。" title="博士｜國立台灣大學｜現任華梵大學電子工程系主任"
                    imageSize="lg" />
            </div>

            <!-- 平台特色 -->
            <div class="mt-12 bg-white p-8 rounded-2xl shadow-lg">
                <h3 class="text-2xl font-bold text-gray-800 text-center mb-6">我們的理念與特色</h3>
                <ul class="grid md:grid-cols-3 gap-6 text-gray-700">
                    <li class="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h4 class="font-semibold text-lg mb-2">🎯 高效學習</h4>
                        <p>透過影片字幕同步與字彙標註，大幅提升聽力與字彙學習效率。</p>
                    </li>
                    <li class="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h4 class="font-semibold text-lg mb-2">🌐 沉浸語境</h4>
                        <p>從真實生活影片中學習道地用語與語調，自然建立語感。</p>
                    </li>
                    <li class="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h4 class="font-semibold text-lg mb-2">💡 互動設計</h4>
                        <p>內建單字卡、測驗與重播功能，讓學習更主動、更有趣。</p>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import CardTeacher from '~/components/Card/CardTeacher.vue';
useHead({ title: '關於我們' })
</script>
