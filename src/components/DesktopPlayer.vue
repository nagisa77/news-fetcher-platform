<template>
  <div class="desktop-player">
    <!-- 左侧：封面 + 标题 -->
    <div class="desktop-poaster-and-title">
      <div class="desktop-poaster-container">
        <img class="desktop-poster-image" :src="coverSrc" alt="Podcast Poster" @click="$emit('cover-clicked')" />
      </div>
      <div class="desktop-title-container">
        <div class="desktop-player-title" ref="titleRef">
          {{ podcastTitle }}
        </div>
        <div class="desktop-player-subtitle" ref="subtitleRef">
          {{ podcastSubtitle }}
        </div>
      </div>
    </div>

    <!-- 右侧：控制按钮 + 进度条 + 时间显示 -->
    <div class="desktop-player-controls">
      <div class="desktop-player-controls-top">
        <!-- 上一首按钮 -->
        <button @click="playPrevious" class="control-button">
          <!-- 上一首 SVG 图标 -->
          <svg class="icon previous-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 4l-6 6 6 6v-4h8v-4h-8V4z" />
          </svg>
        </button>

        <!-- 播放/暂停按钮 -->
        <button @click="togglePlayPause" class="control-button play-pause-button">
          <!-- 播放图标 -->
          <svg v-if="!isPlaying" class="icon play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          <!-- 暂停图标 -->
          <svg v-else class="icon pause-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </button>

        <!-- 下一首按钮 -->
        <button @click="playNext" class="control-button">
          <!-- 下一首 SVG 图标 -->
          <svg class="icon next-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 18l6-6-6-6v12zm6-12l6 6-6 6V6z" />
          </svg>
        </button>
      </div>

      <div class="desktop-player-controls-bottom">
        <!-- 时间显示：已播放 / 总时长 -->
        <div class="time-display">
          {{ formatTime(currentTime) }}
        </div>
        <!-- 进度条容器（未播放） -->
        <div class="desktop-progress-container" ref="progressContainer" @mousedown="onProgressBarMouseDown"
          @touchstart="onProgressBarTouchStart">
          <!-- 已播放部分 -->
          <div class="desktop-progress-played" :style="{ width: progressBarWidth }"></div>
          <!-- 进度拖动圆点 -->
          <div class="desktop-progress-handle" :style="{ left: progressBarWidth }"></div>
        </div>

        <!-- 时间显示：已播放 / 总时长 -->
        <div class="time-display">
          {{ formatTime(duration) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watch, onMounted, onUnmounted, ref, nextTick } from 'vue';
import audioManager from '@/globalAudioManager.js';

export default {
  name: 'DesktopPlayer',

  setup() {
    // ====== 全局音频管理状态 ======
    const state = audioManager.state;

    // ====== 计算属性 ======
    const isPlaying = computed(() => state.isPlaying);
    const podcastTitle = computed(() => state.currentPodcastTitle);
    const podcastSubtitle = computed(() => state.currentPodcastSubtitle);
    const coverSrc = computed(() => state.currentPodcastCover);
    const duration = computed(() => state.duration);
    const currentTime = computed(() => state.currentTime);

    // ====== 当 currentAudioSrc 改变时初始化音频 ======
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

    // ====== 监听 isPlaying 改变，播放 / 暂停 ======
    watch(isPlaying, (val) => {
      const globalAudio = audioManager.getAudio();
      if (!globalAudio) return;
      val ? globalAudio.play() : globalAudio.pause();
    });

    // ====== 检测标题 & 副标题是否溢出 ======
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

    onMounted(async () => {
      // 如果组件挂载时已经有音频源，则初始化并播放
      if (state.currentAudioSrc) {
        audioManager.initAudio(state.currentAudioSrc);
        const globalAudio = audioManager.getAudio();
        if (globalAudio) globalAudio.play();
      }
      await nextTick();
      checkTitleOverflow();
      checkSubtitleOverflow();
    });

    // ====== 在组件卸载时，清理事件监听（可选但推荐） ======
    onUnmounted(() => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    });

    // ====== 播放 / 暂停按钮 ======
    function togglePlayPause() {
      audioManager.setIsPlaying(!state.isPlaying);
    }

    // ====== 上一首 / 下一首（示例，按需实现） ======
    function playPrevious() {
      // 在此写你的“上一首”逻辑
    }
    function playNext() {
      // 在此写你的“下一首”逻辑
    }

    // ====== 进度条宽度 ======
    const progressBarWidth = computed(() => {
      if (!duration.value) return '0%';
      return `${(currentTime.value / duration.value) * 100}%`;
    });

    // ====== 进度条拖动 ======
    const progressContainer = ref(null);
    let isSeeking = false;

    function onProgressBarMouseDown(event) {
      isSeeking = true;
      updateProgress(event);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(event) {
      if (!isSeeking) return;
      updateProgress(event);
    }

    function onMouseUp() {
      isSeeking = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    function onProgressBarTouchStart(event) {
      isSeeking = true;
      updateProgress(event.touches[0]);
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    }

    function onTouchMove(event) {
      if (!isSeeking) return;
      updateProgress(event.touches[0]);
      event.preventDefault(); // 阻止页面滚动
    }

    function onTouchEnd() {
      isSeeking = false;
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    }

    function updateProgress(e) {
      if (!progressContainer.value) return;
      const rect = progressContainer.value.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      let newProgress = offsetX / rect.width;
      newProgress = Math.max(0, Math.min(newProgress, 1)); // 限制在 [0, 1]
      audioManager.setCurrentTime(newProgress * duration.value);
    }

    // ====== 格式化时间 mm:ss ======
    function formatTime(time) {
      const totalSeconds = Math.floor(time);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return {
      // 全局状态
      state,
      isPlaying,
      duration,
      currentTime,
      // Podcast 信息
      podcastTitle,
      podcastSubtitle,
      coverSrc,
      // 标题滚动检测
      titleRef,
      subtitleRef,
      isTitleOverflow,
      isSubtitleOverflow,
      checkTitleOverflow,
      checkSubtitleOverflow,

      // 控制逻辑
      togglePlayPause,
      playPrevious,
      playNext,

      // 进度条拖动
      progressContainer,
      progressBarWidth,
      onProgressBarMouseDown,
      onProgressBarTouchStart,

      // 工具
      formatTime,
    };
  },
};
</script>

<style scoped>
/* 整个播放器容器 */
.desktop-player {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  /* 背景模糊，可根据需求调整 */
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
}

/* 左侧：封面 + 标题 */
.desktop-poaster-and-title {
  display: flex;
  align-items: center;
}

/* 封面容器 */
.desktop-poaster-container {
  height: 80px;
  width: 80px;
  border-radius: 10%;
  margin-left: 10px;
  overflow: hidden;
}

.desktop-poster-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 标题容器 */
.desktop-title-container {
  max-width: 250px;
  overflow: hidden;
  white-space: nowrap;
  margin-left: 20px;
}

.desktop-player-title {
  display: inline-block;
  font-size: 14px;
  font-weight: bold;
  color: var(--color-deep-level-1-rose-taupe);
}

.desktop-player-subtitle {
  font-size: 12px;
  padding-top: 4px;
  opacity: 0.8;
  color: var(--color-deep-level-1-rose-taupe);
}

/* 右侧：按钮 + 进度条 */
.desktop-player-controls {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 上方按钮组 */
.desktop-player-controls-top {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 8px;
}

.control-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.control-button:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

/* 播放/暂停按钮高亮 */
.play-pause-button {
  background-color: var(--color-deep-level-1-rose-taupe);
  color: var(--color-white);
}

.play-pause-button:hover {
  opacity: 0.8;
  scale: 1.1;
  transition: all 0.3s ease;
  background-color: var(--color-deep-level-1-rose-taupe);
}

/* SVG 图标 */
.icon {
  position: relative;
  top: 2px;
  width: 24px;
  height: 24px;
  fill: var(--color-deep-level-1-rose-taupe);
}

.play-icon,
.pause-icon {
  width: 30px;
  height: 30px;
  fill: var(--color-white);
}

/* 下方进度条 + 时间 */
.desktop-player-controls-bottom {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-right: 20px;
}

/* 未播放区域 */
.desktop-progress-container {
  position: relative;
  flex: 1;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  /* 可自行修改成更明显颜色 */
  border-radius: 2px;
  cursor: pointer;
  width: 300px;
}

/* 已播放区域 */
.desktop-progress-played {
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  background-color: var(--color-deep-level-1-rose-taupe);
  border-radius: 2px;
  transition: width 0.1s linear;
}

/* 拖动小圆点 */
.desktop-progress-handle {
  position: absolute;
  top: -5px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: var(--color-deep-level-1-rose-taupe);
  transform: translateX(-50%);
  transition: left 0.1s linear;
  cursor: pointer;
}

/* 时间显示 */
.time-display {
  font-size: 12px;
  color: var(--color-deep-level-1-rose-taupe);
  user-select: none;
  min-width: 70px;
  text-align: center;
}
</style>