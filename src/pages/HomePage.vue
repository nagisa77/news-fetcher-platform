<template>
  <div class="scroll-view-container">
    <div class="scroll-view">
      <div class="multi-column-layout">
        <div class="content-container">
          <!-- 加载中提示 -->
          <div v-if="loading" class="loading-icon">
            <!-- <l-tail-chase size="40" speed="1.75" color="black"></l-tail-chase> -->
            Loading...
          </div>
          <!-- 文章内容 -->
          <div v-else class="masonry">
            <div v-for="(podcast, index) in podcasts" :key="index" class="masonry-item"
              @click="$emit('play-request', podcast.filename)">
              <div class="image-container">
                <img v-if="podcast.img_url && podcast.img_url.trim() !== ''" :src="podcast.img_url"
                  :alt="'Placeholder Image ' + index" class="responsive-image" />
                <div class="overlay">
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
                    <span v-for="tag in podcast.tags" :key="tag" class="content-card-tag">{{ '#' + tag }}</span>
                  </div>
                </div>
                <span class="content-card-date">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12">
                    <path
                      d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm-7-9h5v5h-5V10z" />
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
// import { tailChase } from 'ldrs'

// tailChase.register()

export default {
  name: 'HomePage',

  data() {
    return {
      podcasts: [],
      loading: true,
    };
  },

  mounted() {
    this.fetchPodcasts();
  },

  methods: {
    async fetchPodcasts() {
      this.loading = true;
      try {
        const response = await fetch(
          "https://getbloglist-a6lubplbza-uc.a.run.app"
          // "http://127.0.0.1:5001/news-fetcher-platform/us-central1/getBlogList"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedPodcasts = await response.json();
        console.log(fetchedPodcasts);
        // 解析格式并按倒序排列
        this.podcasts = fetchedPodcasts.reverse().map((podcast) => ({
          title: podcast.title,
          img_url: podcast.img_url,
          description: podcast.description,
          filename: podcast.filename,
          date: podcast.date,
          tags: podcast.tags,
          displayName: podcast.title.replace(/\.mp3$/i, ""),
        }));
      } catch (error) {
        console.error("Failed to fetch podcast list:", error);
      } finally {
        this.loading = false;
      }
    },
  }
}
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

.loading-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  flex-shrink: 0;
}

.responsive-image {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 20px 20px 0 0;
  object-fit: cover;
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
  margin-top: 0px;
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

/* 响应式布局 */
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
    /* 保持三行限制 */
  }

  .image-container {
    width: 30%;
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
