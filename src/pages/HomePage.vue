<template>
  <div class="scroll-view-container" ref="scrollViewContainer">
    <div class="scroll-view">
      <div class="multi-column-layout">
        <div class="content-container">
          <!-- 加载中提示 -->
          <div v-if="loading" class="loading-icon">
            Loading...
          </div>
          <!-- 文章内容 -->
          <div :class="['masonry', currentLayout]">
            <div
              v-for="(podcast, index) in podcasts"
              :key="index"
              class="masonry-item"
              @click="$emit('play-request', podcast)"
            >
              <!-- 组件内容 -->
              <div class="image-container">
                <img
                  v-if="podcast.img_url && podcast.img_url.trim() !== ''"
                  :src="podcast.img_url"
                  :alt="'Placeholder Image ' + index"
                  class="responsive-image"
                  :class="{'fade-in': imageLoadedMap[index]}"
                  @load="onImageLoad(index)"
                />
                <!-- 显示总时长 -->
                <div class="duration-overlay">
                  {{ formatDuration(podcast.total_duration) }}
                </div>
                <div
                  v-if="
                    audioManager.state.isPlaying &&
                    podcast.title === audioManager.state.currentPodcastTitle
                  "
                  class="overlay"
                >
                  <!-- 暂停图标 -->
                  <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="32" fill="rgba(0, 0, 0, 0.5)" />
                    <rect x="22" y="20" width="8" height="24" fill="#fff" />
                    <rect x="34" y="20" width="8" height="24" fill="#fff" />
                  </svg>
                </div>
                <div v-else class="overlay">
                  <!-- 播放图标 -->
                  <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="32" fill="rgba(0, 0, 0, 0.5)" />
                    <polygon points="26,20 26,44 46,32" fill="#fff" />
                  </svg>
                </div>
              </div>
              <div class="content-card-text-container">
                <div>
                  <p class="content-card-text">{{ podcast.title || '未命名文章' }}</p>
                  <div class="tags-container">
                    <span
                      v-for="tag in podcast.tags"
                      :key="tag"
                      class="content-card-tag"
                    >
                      {{ '#' + tag }}
                    </span>
                  </div>
                </div>
                <span class="content-card-date">
                  <svg
                    class="content-card-date-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                  >
                    <path
                      fill="currentColor"
                      d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm-7-9h5v5h-5V10z"
                    />
                  </svg>
                  {{ podcast.date || '未知日期' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import audioManager from '@/globalAudioManager.js';

export default {
  name: 'HomePage',

  data() {
    return {
      podcasts: [],
      loading: true,
      audioManager, // 保持 audioManager
      // 新增：用于记录每张图片是否加载完成
      imageLoadedMap: {},
    };
  },

  mounted() {
    this.fetchPodcasts();
  },

  methods: {
    async fetchPodcasts() {
      this.loading = true;
      try {
        const response = await fetch("https://getbloglist-a6lubplbza-uc.a.run.app");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedPodcasts = await response.json();
        console.log(fetchedPodcasts);
        // 解析格式并按倒序排列
        const parsed = fetchedPodcasts.reverse().map((podcast) => ({
          title: podcast.title,
          img_url: podcast.img_url,
          description: podcast.description,
          filename: podcast.filename,
          date: podcast.date,
          tags: podcast.tags,
          total_duration: podcast.total_duration, // 确保包含 total_duration
          displayName: podcast.title.replace(/\.mp3$/i, ""),
        }));
        const columnCount = this.getColumnCount();
        this.podcasts = this.reorderForColumns(parsed, columnCount);
      } catch (error) {
        console.error("Failed to fetch podcast list:", error);
      } finally {
        this.loading = false;
      }
    },
    /**
     * 将秒数转换为 mm:ss 格式
     * @param {number} seconds
     * @returns {string}
     */
    formatDuration(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    },
    /**
     * 当图片加载完成时，设置对应标记，触发淡入
     */
      onImageLoad(index) {
      this.imageLoadedMap[index] = true;
    },

    /**
     * 获取当前页面的列数
     * @returns {number}
     */
    getColumnCount() {
      const masonryEl = this.$el.querySelector('.masonry');
      if (!masonryEl) return 1;
      const style = window.getComputedStyle(masonryEl);
      const count = parseInt(style.columnCount, 10);
      return isNaN(count) ? 1 : count;
    },

    /**
     * 根据列数重新排序数组，使其以行顺序显示
     * @param {Array} items
     * @param {number} columnCount
     * @returns {Array}
     */
    reorderForColumns(items, columnCount) {
      if (columnCount <= 1) return items;
      const result = [];
      const rows = Math.ceil(items.length / columnCount);
      for (let col = 0; col < columnCount; col++) {
        for (let row = 0; row < rows; row++) {
          const idx = row * columnCount + col;
          if (idx < items.length) result.push(items[idx]);
        }
      }
      return result;
    },
  },
};
</script>

<style scoped>
.scroll-view-container {
  position: relative;
  background-color: var(--color-white);
}

.scroll-view {
  height: 100vh;
  overflow-y: auto;
}

.multi-column-layout {
  padding: 150px 50px;
}

.content-card-text-container {
  padding: 18px;
}

.loading-container {
  text-align: center;
  font-size: 18px;
  color: var(--color-deep-level-1-rose-taupe);
  padding: 50px 0;
}

.masonry {
  column-gap: 20px;
}

.masonry-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  break-inside: avoid;
  background-color: var(--color-white);
  text-decoration: none;
  color: var(--color-deep-level-1-rose-taupe);
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.masonry-item:hover {
  color: var(--color-deep-level-2-rose-taupe);
  text-decoration: underline;
}

.masonry-item:hover .overlay {
  opacity: 1;
}

.content-container {
  max-width: 800px;
  margin: 0 auto;
}

.content-card-date-icon {
  color: var(--color-deep-level-2-rose-taupe);
}

.loading-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-deep-level-2-rose-taupe);
}


.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1; /* 你可以改成 1 / 1, 4 / 3, etc. */
  overflow: hidden;
  border-radius: 20px 20px 0 0;
  flex-shrink: 0;
}

/* 2) 图片本身绝对定位全覆盖，并设置淡入动画 */
.responsive-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px 20px 0 0;
  opacity: 0;               /* 初始透明 */
  transition: opacity 0.5s; /* 淡入时长 0.5s */
}

/* 加载完成后，通过 .fade-in 切换到不透明 */
.fade-in {
  opacity: 1;
}

/* 遮罩层 */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  /* 半透明遮罩 */
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  /* 初始隐藏 */
  transition: opacity 0.3s ease;
  border-radius: 20px 20px 0 0;
  cursor: pointer;
}

/* 播放图标 */
.play-icon {
  width: 50px;
  height: 50px;
  fill: #fff;
}

.content-card-text {
  margin-top: 0;
  color: var(--content-card-text-color);
  font-weight: bold;
  font-size: 13px;
  display: flex;
  align-items: center;
}

.content-card-date {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 10px;
  margin-top: 10px;
}

.tags-container {
  font-size: 8px;
  display: flex;
  flex-wrap: wrap;
  opacity: 0.8;
}

.content-card-tag {
  margin-right: 5px;
}

/* 添加总时长的样式 */
.duration-overlay {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 响应式布局：根据视口大小改变列数 */
@media (prefers-color-scheme: dark) {
  .masonry-item {
    border: 1px solid var(--color-deep-level-2-rose-taupe);
  }
}

@media (min-width: 900px) {
  .masonry {
    column-count: 3;
  }
}

@media (max-width: 649px) {
  .multi-column-layout {
    padding: 50px 30px;
  }

  .scroll-view {
    height: calc(100vh - 100px);
  }

  .loading-icon {
    top: calc(50% - 100px);
  }
}

@media (min-width: 541px) and (max-width: 899px) {
  .masonry {
    column-count: 2;
  }
}

@media (max-width: 540px) {
  .masonry {
    column-count: 1;
  }

  .masonry-item {
    flex-direction: row;
    border-radius: 14px;
  }

  .content-card-text {
    font-size: 11px;
  }

  .description {
    font-size: 10px;
    -webkit-line-clamp: 3;
  }

  .image-container {
    width: 30%;
    aspect-ratio: unset; /* 若想在小屏改成自适应，可在此禁用固定比 */
    border-radius: 14px 0 0 14px;
  }

  .responsive-image {
    border-radius: 14px 0 0 14px;
  }

  .overlay {
    border-radius: 14px 0 0 14px;
  }

  .content-card-text-container {
    width: 70%;
    padding: 8px;
  }

  .content-card-description {
    font-size: 9px;
  }

  .play-icon {
    width: 30px;
    height: 30px;
  }

  .content-card-text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>