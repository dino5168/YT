<template>
    <div>
        <MediaPlayerControls @play="handlePlay" @pause="handlePause" @previous="handlePrevious" @next="handleNext"
            @speedChange="handleSpeedChange" @fontSizeChange="handleFontSizeChange" />
    </div>
</template>

<script setup>
import MediaPlayerControls from '~/components/MediaPlayerControls.vue'
const handlePlay = () => {
    console.log('開始播放')
}

const handlePause = () => {
    console.log('暫停播放')
}

const handleSpeedChange = (speed) => {
    console.log('播放速度變更:', speed)
}

// 其他事件處理函數...
</script>