// src/globalAudioManager.js
import { reactive } from 'vue';

const state = reactive({
  currentAudioSrc: '',
  currentPodcastCover: '',
  currentPodcastTitle: '-',
  currentPodcastSubtitle: '-',
  isPlaying: false,
  currentTime: 0,
  duration: 0,
});

export default {
  state,
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
