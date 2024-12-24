<template>
    <div class="bottom-audio-container">
        <div class="bottom-audio-color-container"></div>
        <div class="bottom-audio-progress-bar"></div>
        <div class="bottom-audio-left-container">
            <div class="mobile-player-poster-container">
                <img src="https://storage.googleapis.com/news-fetcher-platform.firebasestorage.app/podcasts_image/今日新闻热点_cover.png"
                    alt="Podcast Poster" />
            </div>
            <div class="mobile-player-title-container">
                <div class="mobile-player-title">今日新闻热点</div>
                <div class="mobile-player-subtitle">今日新闻热点</div>
            </div>
        </div>
        <div class="mobile-player-right-container">
            <button @click="togglePlayPause" class="play-pause-button">
                <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon play-icon">
                    <path d="M8 5v14l11-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon pause-icon">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MobilePlayer',
}
</script>

<style scoped>
.bottom-audio-container {
    position: fixed;
    bottom: 0;
    left: 50%;
    height: 60px;
    transform: translate(-50%, -10px);
    padding: 0;
    z-index: 1000;
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 30px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}


.bottom-audio-color-container {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: var(--color-deep-level-1-rose-taupe);
    border-radius: 30px;
    opacity: var(--bottom-audio-opacity);
    z-index: 0;
}

.mobile-player-poster-container {
    height: 45px;
    width: 45px;
    border-radius: 50%;
    margin-left: 10px;
    overflow: hidden;
}

.bottom-audio-progress-bar {
  position: absolute;
  bottom: 0;
  left: 30px;
  height: 2px;
  width: 50%;
  background-color: var(--color-deep-level-3-sky-magenta);
  z-index: 2; 
}

.mobile-player-poster-container img {
    /* 让图片自适应容器并裁剪成圆形 */
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.bottom-audio-left-container {
    display: flex;
    align-items: center;
    z-index: 1;
    /* 其他内容在颜色容器之上 */
}

.mobile-player-title {
    font-size: 12px;
    font-weight: bold;
    color: var(--color-deep-level-4-persian-pink);
}

.mobile-player-subtitle {
    font-size: 10px;
    padding-top: 4px;
    opacity: 0.8;
    color: var(--color-deep-level-4-persian-pink);
}

.mobile-player-title-container {
    margin-left: 10px;
}

.icon {
    width: 28px;
    height: 28px;
    fill: var(--color-deep-level-4-persian-pink); /* 根据需要调整颜色 */
}

.play-pause-button {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 50%;
    transition: background-color 0.3s;
    margin-right: 5px;
    top: 2px;
}

</style>
