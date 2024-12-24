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
                <div
                    class="mobile-player-title"
                    :class="{ marquee: isTitleOverflow }"
                    ref="titleRef"
                >
                    {{ podcastTitle }}
                </div>
                <div class="mobile-player-subtitle" ref="subtitleRef" :class="{ marquee: isSubtitleOverflow }">{{ podcastSubtitle }}</div>
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
import { computed, watch, onBeforeUnmount, ref, onMounted } from 'vue';
import audioManager from '@/globalAudioManager.js';
import { nextTick } from 'vue';

export default {
  name: 'MobilePlayer',

  setup() {
    // 全局状态对象
    const state = audioManager.state;

    // 这里引用原生 Audio 实例
    const audio = ref(null);

    // 1) 定义几个 computed，用来在模板中使用
    //    只要 globalAudioManager 里发生变动，这些值就会自动更新
    const isPlaying = computed(() => state.isPlaying);
    const podcastTitle = computed(() => state.currentPodcastTitle);
    const podcastSubtitle = computed(() => state.currentPodcastSubtitle);
    const coverSrc = computed(() => state.currentPodcastCover);

    // 如果你要支持进度条，可以加:
    // const currentTime = computed(() => state.currentTime);
    // const duration = computed(() => state.duration);

    // 2) 监听全局的 audioSrc 改变，重新创建 / 播放
    watch(
      () => state.currentAudioSrc,
      (newSrc) => {
        initAudio(newSrc);
        if (newSrc) {
          audio.value.play();
          audioManager.setIsPlaying(true);
        }
      },
    );

    // 2) watch isPlaying，用来决定是否播放 / 暂停
    watch(isPlaying, (val) => {
      if (!audio.value) return;
      if (val) {
        audio.value.play();
      } else {
        audio.value.pause();
      }
    });

    watch(podcastTitle, async () => {
      await nextTick();
      checkTitleOverflow();
    });

    watch(podcastSubtitle, async () => {
      await nextTick();
      checkSubtitleOverflow();
    });

    // 组件挂载时，若已经有 src，则初始化
    onMounted(async () => {
      if (state.currentAudioSrc) {
        initAudio(state.currentAudioSrc);
        audioManager.setIsPlaying(true);
      }

      await nextTick();
      checkTitleOverflow();
      checkSubtitleOverflow();
    });

    // 组件卸载前，清理
    onBeforeUnmount(() => {
      cleanupAudio();
    });

    // ========== 音频核心逻辑 ==========
    function initAudio(src) {
      cleanupAudio();
      if (!src) return;

      audio.value = new Audio(src);
      audio.value.addEventListener('timeupdate', handleTimeUpdate);
      audio.value.addEventListener('ended', handleEnded);
      audio.value.addEventListener('canplay', handleCanPlay);
    }

    function cleanupAudio() {
      if (!audio.value) return;
      audio.value.removeEventListener('timeupdate', handleTimeUpdate);
      audio.value.removeEventListener('ended', handleEnded);
      audio.value.removeEventListener('canplay', handleCanPlay);
      audio.value.pause();
      audio.value = null;
    }

    // 播放 / 暂停
    function togglePlayPause() {
      if (!audio.value) return;
      if (!state.isPlaying) {
        audioManager.setIsPlaying(true);
      } else {
        audioManager.setIsPlaying(false);
      }
    }

    // canplay
    function handleCanPlay() {
      audioManager.setDuration(audio.value.duration);
    }

    // timeupdate
    function handleTimeUpdate() {
      audioManager.setCurrentTime(audio.value.currentTime);
    }

    // ended
    function handleEnded() {
      audioManager.setIsPlaying(false);
      // audioManager.setCurrentTime(0);
    }

    // ========== 动态进度条 ==========
    const progressBarWidth = computed(() => {
      return state.duration
        ? `${(state.currentTime / state.duration) * 100}%`
        : '0%';
    });

    // ========== 标题滚动/溢出检测 ==========
    const titleRef = ref(null);
    const subtitleRef = ref(null);
    const isTitleOverflow = ref(false);
    const isSubtitleOverflow = ref(false);

    // 用于检测标题是否溢出
    function checkTitleOverflow() {
      // 若需要在podcastTitle改变后自动检测，可以 watch(podcastTitle, checkTitleOverflow)
      // 这里只是个示例:
      if (!titleRef.value) return;
      const container = titleRef.value.parentElement; 
      if (container) {
        isTitleOverflow.value = (titleRef.value.scrollWidth > container.clientWidth);
      }
    }

    // 用于检测副标题是否溢出
    function checkSubtitleOverflow() {
      if (!subtitleRef.value) return;
      const container = subtitleRef.value.parentElement; 
      if (container) {
        isSubtitleOverflow.value = (subtitleRef.value.scrollWidth > container.clientWidth);
      }
    }

    // ========== 封面旋转 ==========
    const rotatingPosterClass = computed(() => {
      return isPlaying.value ? 'poster-rotating' : '';
    });

    // 返回模板所需的属性/方法
    return {
      // 全局状态引用
      state,

      // 供模板使用的 computed
      isPlaying,
      podcastTitle,
      podcastSubtitle,
      coverSrc,

      // 进度条
      progressBarWidth,
      rotatingPosterClass,

      // 标题滚动检测
      isTitleOverflow,
      isSubtitleOverflow,
      titleRef,
      subtitleRef,
      checkTitleOverflow,
      checkSubtitleOverflow,

      // 播放控制
      togglePlayPause,
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

/* 
  1. 限制标题容器最大宽度，超出隐藏
  2. 单行显示（white-space: nowrap）
*/
.mobile-player-title-container {
    max-width: 170px; /* 这里可根据需求自行调整 */
    overflow: hidden;
    white-space: nowrap;
    margin-left: 10px;
}

.mobile-player-title {
    display: inline-block;
    font-size: 12px;
    font-weight: bold;
    color: var(--color-deep-level-4-persian-pink);
    /* 默认不滚动，只有当添加 marquee 类时才滚动 */
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
    /* 根据需求可调整体时长、动画曲线等 */
    animation: marquee 5s linear infinite;
}

/* 往返（Ping-Pong）动画：
   0%：回到初始位置
   50%：移动到 -50%
   100%：回到初始位置
 */
@keyframes marquee {
    0%, 100% {
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