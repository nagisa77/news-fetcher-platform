// src/globalAudioManager.js
import { reactive } from 'vue';

let audio = null; // 全局维护一个 Audio 实例

const state = reactive({
  currentAudioSrc: '',
  currentPodcastCover: '',
  currentPodcastTitle: '-',
  currentPodcastSubtitle: '-',
  isPlaying: false,
  currentTime: 0,
  duration: 0,
});

// 初始化音频
function initAudio(src) {
  cleanupAudio(); 
  if (!src) return;
  audio = new Audio(src);
  audio.addEventListener('timeupdate', handleTimeUpdate);
  audio.addEventListener('ended', handleEnded);
  audio.addEventListener('canplay', handleCanPlay);
}

// 清理音频
function cleanupAudio() {
  if (!audio) return;
  audio.removeEventListener('timeupdate', handleTimeUpdate);
  audio.removeEventListener('ended', handleEnded);
  audio.removeEventListener('canplay', handleCanPlay);
  audio.pause();
  audio = null;
}

// 播放进度
function handleTimeUpdate() {
  state.currentTime = audio.currentTime;
}

// 播放结束
function handleEnded() {
  state.isPlaying = false;
}

// 可以播放时，设置总时长
function handleCanPlay() {
  state.duration = audio.duration;
}

export default {
  state,
  initAudio,
  cleanupAudio,

  // 若外部需要拿到 audio 实例，可用此方法
  getAudio() {
    return audio;
  },

  // 设置各种全局状态
  setAudioSrc(src) {
    state.currentAudioSrc = src;
  },
  setPodcastCover(cover) {
    state.currentPodcastCover = cover;
  },
  setPodcastTitle(title) {
    state.currentPodcastTitle = title;
  },
  setPodcastSubtitle(subtitle) {
    state.currentPodcastSubtitle = subtitle;
  },
  setIsPlaying(value) {
    state.isPlaying = value;
  },
  setCurrentTime(value) {
    state.currentTime = value;
  },
  setDuration(value) {
    state.duration = value;
  },
};