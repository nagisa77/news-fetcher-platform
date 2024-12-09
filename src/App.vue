<template>
  <div id="app">
    <div class="container">
      <h1>Podcast List</h1>

      <!-- 显示 Loading 状态 -->
      <p v-if="isLoading" class="loading">Loading podcasts...</p>

      <!-- 播放列表 -->
      <ul v-else class="podcast-list">
        <li
          v-for="(podcast, index) in podcasts"
          :key="index"
          class="podcast-item"
        >
          <div>
            <strong>{{ podcast.displayName }}</strong>
            <p class="description">{{ podcast.description }}</p>
          </div>
          <button class="play-button" @click="playPodcast(podcast.filename)">
            <i class="fa fa-play"></i>  
          </button>
        </li>
      </ul>

      <!-- 音频播放器 -->
      <div class="audio-container">
        <audio ref="audioPlayer" controls class="audio-player"></audio>
      </div>

      <p class="intro">
        This system automates news summarization and podcast generation,
        delivering daily 20-40 minute episodes at 8 AM with seamless access via
        a user-friendly front-end.
      </p>
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
      this.isLoading = true;
      try {
        const response = await fetch(
          "https://getbloglist-a6lubplbza-uc.a.run.app"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedPodcasts = await response.json();
        // 解析格式并按倒序排列
        this.podcasts = fetchedPodcasts.reverse().map((podcast) => ({
          title: podcast.title,
          description: podcast.description,
          filename: podcast.filename,
          displayName: podcast.title.replace(/\.mp3$/i, ""), 
        }));
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
  background-color: #ece9e9;
  font-family: Arial, sans-serif;
}

/* 标题样式 */
h1 {
  text-align: center;
  color: #555;
  margin-top: 20px;
}

.audio-container {
  width: 100%;
}

.container {
  margin: 50px;
  max-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 介绍段落 */
.intro {
  text-align: center;
  margin: 20px auto;
  font-size: 16px;
  line-height: 1.5;
  color: #666;
  max-width: 500px;
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
  width: 100%;
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

.description {
  font-size: 14px;
  color: #777;
  margin: 4px 0;
}

/* 播放按钮 */
.play-button {
  margin-left: 10px;
  padding: 15px 18px;
  border-radius: 50%;
  font-size: 14px;
  color: #fff;
  background-color: #4f4f4f;
  border: none;
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