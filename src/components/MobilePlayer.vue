<template>
    <div class="bottom-audio-container">
        <!-- 背景色容器 -->
        <div class="bottom-audio-color-container"></div>

        <!-- 动态进度条 -->
        <div class="bottom-audio-progress-bar" :style="{ width: progressBarWidth }"></div>

        <!-- 左侧：封面 + 标题 -->
        <div class="bottom-audio-left-container">
            <div class="mobile-player-poster-container" :class="rotatingPosterClass">
                <img :src="coverSrc" alt="Podcast Poster" />
            </div>
            <div class="mobile-player-title-container">
                <div class="mobile-player-title">{{ podcastTitle }}</div>
                <div class="mobile-player-subtitle">{{ podcastSubtitle }}</div>
            </div>
        </div>

        <!-- 右侧：播放 / 暂停 按钮 -->
        <div class="mobile-player-right-container">
            <button @click="togglePlayPause" class="play-pause-button">
                <!-- 播放图标 -->
                <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                    class="icon play-icon">
                    <path d="M8 5v14l11-7z" />
                </svg>
                <!-- 暂停图标 -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                    class="icon pause-icon">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MobilePlayer',
    props: {
        /**
         * 音频源地址，可根据业务场景动态传入
         */
        audioSrc: {
            type: String,
            default: ''
        },
        /**
         * Podcast 封面图片链接
         */
        coverSrc: {
            type: String,
            default: 'https://storage.googleapis.com/news-fetcher-platform.firebasestorage.app/podcasts_image/今日新闻热点_cover.png'
        },
        /**
         * Podcast 标题
         */
        podcastTitle: {
            type: String,
            default: '今日新闻热点'
        },
        /**
         * Podcast 副标题
         */
        podcastSubtitle: {
            type: String,
            default: '今日新闻热点'
        },
    },
    data() {
        return {
            isPlaying: false,
            audio: null,
            duration: 0,
            currentTime: 0
        };
    },
    computed: {
        /**
         * 动态设置进度条宽度
         */
        progressBarWidth() {
            if (!this.duration) return '0%';
            return `${(this.currentTime / this.duration) * 100}%`;
        },
        /**
         * 播放时给封面添加旋转动画
         */
        rotatingPosterClass() {
            return this.isPlaying ? 'poster-rotating' : '';
        }
    },
    watch: {
        audioSrc: {
            immediate: true,
            handler(newSrc) {
                this.initAudio(newSrc);
                // 如果存在新的音频地址，则自动播放
                if (newSrc) {
                    this.audio.play();
                    this.isPlaying = true;
                }
            }
        }
    },
    mounted() {
        // 如果一开始就有 audioSrc，可在这里也调用 initAudio(this.audioSrc)
        // 但因为设置了 watch immediate:true，所以已包含初始化逻辑
    },
    beforeUnmount() {
        if (this.audio) {
            this.audio.removeEventListener('timeupdate', this.handleTimeUpdate);
            this.audio.removeEventListener('ended', this.handleEnded);
            this.audio.removeEventListener('canplay', this.handleCanPlay);
            this.audio.pause();
            this.audio = null;
        }
    },
    methods: {
        /**
         * 初始化音频事件监听
         */
        initAudio(src) {
            // 先清理旧 audio
            if (this.audio) {
                this.audio.pause();
                this.audio = null;
            }
            if (!src) return; // 如果没有音频源，就不做初始化了

            this.audio = new Audio(src);
            // 监听事件
            this.audio.addEventListener('timeupdate', this.handleTimeUpdate);
            this.audio.addEventListener('ended', this.handleEnded);
            this.audio.addEventListener('canplay', this.handleCanPlay);
        },
        /**
         * 播放 / 暂停 按钮事件
         */
        togglePlayPause() {
            if (!this.audio) return;
            if (!this.isPlaying) {
                this.audio.play();
                this.isPlaying = true;
            } else {
                this.audio.pause();
                this.isPlaying = false;
            }
        },
        /**
         * 当音频可播放时，获取总时长
         */
        handleCanPlay() {
            this.duration = this.audio.duration;
        },
        /**
         * 实时更新 currentTime，用来设置进度条
         */
        handleTimeUpdate() {
            this.currentTime = this.audio.currentTime;
        },
        /**
         * 当音频播放结束
         */
        handleEnded() {
            this.isPlaying = false;
            this.currentTime = 0;
        }
    }
};
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
    /* 让内容不被背景模糊色覆盖 */
    overflow: hidden;
}

/* 底色容器 */
.bottom-audio-color-container {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: var(--color-deep-level-1-rose-taupe);
    border-radius: 30px;
    opacity: var(--bottom-audio-opacity);
    z-index: 0;
}

/* 进度条 */
.bottom-audio-progress-bar {
    position: absolute;
    bottom: 0;
    left: 30px;
    right: 30px;
    height: 2px;
    /* 原先固定 50%，现改为动态计算 */
    width: 0%;
    background-color: var(--color-deep-level-3-sky-magenta);
    z-index: 2;
    transition: width 0.2s linear;
}

/* 左侧：封面容器 */
.mobile-player-poster-container {
    height: 45px;
    width: 45px;
    border-radius: 50%;
    margin-left: 10px;
    overflow: hidden;
}

/* 封面自适应 */
.mobile-player-poster-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

/* 播放时封面旋转动画 */
.poster-rotating {
    animation: rotatingPoster 3s linear infinite;
}

@keyframes rotatingPoster {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* 标题 + 副标题 */
.bottom-audio-left-container {
    display: flex;
    align-items: center;
    z-index: 1;
}

.mobile-player-title-container {
    margin-left: 10px;
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

/* 播放 / 暂停图标样式 */
.icon {
    width: 28px;
    height: 28px;
    fill: var(--color-deep-level-4-persian-pink);
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
