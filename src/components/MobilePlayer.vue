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
        <!-- 当标题过长时添加 marquee 类，滚动显示 -->
        <div class="mobile-player-title" :class="{ marquee: isTitleOverflow }" ref="titleRef">
          {{ podcastTitle }}
        </div>
        <div class="mobile-player-subtitle" ref="subtitleRef" :class="{ marquee: isSubtitleOverflow }">{{
          podcastSubtitle }}</div>
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
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon pause-icon">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { computed, watch, onMounted, ref, nextTick } from 'vue';
import audioManager from '@/globalAudioManager.js';

export default {
  name: 'MobilePlayer',

  setup() {
    // 全局状态对象
    const state = audioManager.state;

    // computed，模板中直接用
    const isPlaying = computed(() => state.isPlaying);
    const podcastTitle = computed(() => state.currentPodcastTitle);
    const podcastSubtitle = computed(() => state.currentPodcastSubtitle);
    const coverSrc = computed(() => state.currentPodcastCover);

    // ========== 当 currentAudioSrc 变化时，初始化并播放音频 ==========
    watch(
      () => state.currentAudioSrc,
      (newSrc) => {
        audioManager.initAudio(newSrc);
        if (newSrc) {
          const globalAudio = audioManager.getAudio();
          if (globalAudio) {
            globalAudio.play();
            audioManager.setIsPlaying(true);
          }
        }
      }
    );

    // ========== 监听 isPlaying 改变，决定播放 / 暂停 ==========
    watch(isPlaying, (val) => {
      const globalAudio = audioManager.getAudio();
      if (!globalAudio) return;
      val ? globalAudio.play() : globalAudio.pause();
    });

    // ========== 检测标题 & 副标题是否溢出，用于决定是否滚动 ==========
    const titleRef = ref(null);
    const subtitleRef = ref(null);
    const isTitleOverflow = ref(false);
    const isSubtitleOverflow = ref(false);

    function checkTitleOverflow() {
      if (!titleRef.value) return;
      const container = titleRef.value.parentElement;
      if (container) {
        isTitleOverflow.value = titleRef.value.scrollWidth > container.clientWidth;
      }
    }

    function checkSubtitleOverflow() {
      if (!subtitleRef.value) return;
      const container = subtitleRef.value.parentElement;
      if (container) {
        isSubtitleOverflow.value = subtitleRef.value.scrollWidth > container.clientWidth;
      }
    }

    // 组件挂载时，如已有 src，初始化 & 播放
    onMounted(async () => {
      if (state.currentAudioSrc) {
        audioManager.initAudio(state.currentAudioSrc);
        const globalAudio = audioManager.getAudio();
        if (globalAudio) globalAudio.play();
      }
      await nextTick();
      checkTitleOverflow();
      checkSubtitleOverflow();
    });

    // ========== 播放 / 暂停按钮 ==========
    function togglePlayPause() {
      if (!state.isPlaying) {
        audioManager.setIsPlaying(true);
      } else {
        audioManager.setIsPlaying(false);
      }
    }

    // ========== 进度条宽度 ==========
    const progressBarWidth = computed(() => {
      return state.duration
        ? `${(state.currentTime / state.duration) * 100}%`
        : '0%';
    });

    // ========== 封面旋转动画 ==========
    const rotatingPosterClass = computed(() => {
      return isPlaying.value ? 'poster-rotating' : '';
    });

    return {
      state,
      isPlaying,
      podcastTitle,
      podcastSubtitle,
      coverSrc,
      progressBarWidth,
      rotatingPosterClass,
      togglePlayPause,
      // 标题滚动
      titleRef,
      subtitleRef,
      isTitleOverflow,
      isSubtitleOverflow,
      checkTitleOverflow,
      checkSubtitleOverflow,
    };
  },
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
  height: 2px;
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
  max-width: 170px;
  overflow: hidden;
  white-space: nowrap;
  margin-left: 10px;
}

.mobile-player-title {
  display: inline-block;
  font-size: 12px;
  font-weight: bold;
  color: var(--color-deep-level-4-persian-pink);
}

/* 副标题 */
.mobile-player-subtitle {
  font-size: 10px;
  padding-top: 4px;
  opacity: 0.8;
  color: var(--color-deep-level-4-persian-pink);
}

/* marquee 动画：来回滑动 */
.marquee {
  animation: marquee 5s linear infinite;
}

@keyframes marquee {

  0%,
  100% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(-50%);
  }
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