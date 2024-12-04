<template>
  <div id="app">
    <h1>Podcast List</h1>

    <p class="intro">
      Using Firecrawl API and GPT technology,
      this system automatically crawls specific levels of content from news websites,
      summarizes the news into concise briefs, and generates 5-10 minute podcasts daily at
      8 AM via a script powered by GitHub Actions. The resulting MP3 files are named based on
      time and news content, then uploaded to a private Git repository. The front-end,
      integrated with the GitHub API, provides a user-friendly interface to list and play podcasts,
      making them easily accessible anytime.
    </p>

    <!-- 显示 Loading 状态 -->
    <p v-if="isLoading" class="loading">Loading podcasts...</p>

    <!-- 播放列表 -->
    <ul v-else class="podcast-list">
      <li v-for="(podcast, index) in podcasts" :key="index" class="podcast-item">
        {{ podcast }}
        <button class="play-button" @click="playPodcast(podcast)">Play</button>
      </li>
    </ul>

    <!-- 音频播放器 -->
    <div class="audio-container">
      <audio ref="audioPlayer" controls class="audio-player"></audio>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      podcasts: [], // 存储播客列表
      isLoading: true, // 是否正在加载
    };
  },
  mounted() {
    this.fetchPodcasts();
  },
  methods: {
    async fetchPodcasts() {
      this.isLoading = true; // 开始加载
      try {
        const response = await fetch("https://getbloglist-a6lubplbza-uc.a.run.app");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedPodcasts = await response.json();
        // 按倒序排列列表
        this.podcasts = fetchedPodcasts.reverse();
      } catch (error) {
        console.error("Failed to fetch podcast list:", error);
      } finally {
        this.isLoading = false; // 加载结束
      }
    },
    playPodcast(filename) {
      const audioPlayer = this.$refs.audioPlayer;
      audioPlayer.src = `https://downloadfile-a6lubplbza-uc.a.run.app?filename=${filename}`;
      audioPlayer.play();
    },
  },
};
</script>

<style>
/* 全局样式 */
body {
  font-family: Arial, sans-serif;
  margin: 50px;
  background-color: #f9f9f9;
  color: #333;
}

/* 标题样式 */
h1 {
  text-align: center;
  color: #555;
  margin-top: 50px;
}

/* 介绍段落 */
.intro {
  text-align: center;
  margin: 20px auto;
  font-size: 16px;
  line-height: 1.5;
  color: #666;
  max-width: 600px;
}

/* 加载状态 */
.loading {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #888;
}

/* 播放列表样式 */
.podcast-list {
  list-style: none;
  padding: 0;
  margin: 20px auto;
  padding-top: 20px;
  max-width: 600px;
  max-height: 400px;
  overflow-y: auto;
}

.podcast-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 10px 20px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 播放按钮 */
.play-button {
  padding: 8px 20px;
  font-size: 14px;
  color: #fff;
  background-color: #4f4f4f;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.play-button:hover {
  background-color: #050506;
}

/* 音频播放器样式 */
.audio-container {
  text-align: center;
  margin-top: 20px;
}

.audio-player {
  width: 100%;
  max-width: 600px;
  border-radius: 8px;
  background-color: #f0f0f0;
  outline: none;
}
</style>