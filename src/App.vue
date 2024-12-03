<template>
  <div id="app">
    <h1>Podcast List</h1>
    <p class="intro">
      ^_^这些播客源自新闻网站。我通过 Firecrawl API 抓取指定层级的内容，利用 GPT-4o-mini-2024-07-18 提炼新闻摘要，并生成 5-10 分钟的播客。脚本通过 GitHub Actions 每天早晨 8 点自动运行，生成的 MP3 文件按时间和新闻内容命名并上传至私有 Git 仓库。前端通过 GitHub API 提供播客列表和播放功能，方便随时收听。
    </p>
    <!-- 显示 Loading 状态 -->
    <p v-if="isLoading">Loading podcasts...</p>

    <!-- 播放列表 -->
    <ul v-else>
      <li v-for="(podcast, index) in podcasts" :key="index">
        {{ podcast }}
        <button @click="playPodcast(podcast)">Play</button>
      </li>
    </ul>

    <!-- 音频播放器 -->
    <audio ref="audioPlayer" controls></audio>
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
/* 无样式，供你自行设计 */
</style>