<template>
    <div class="desktop-back-container">
        <div class="desktop-detail">
            <img class="desktop-detail-image" :src="podcast.img_url" alt="Podcast Poster" />
            <h3 class="desktop-detail-title">
                {{ podcast.title }}
                <!-- 下载图标，点击触发事件 -->
                <svg class="download-icon" @click="handleDownloadClick" width="24" height="24" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M12 16l-6-6h4V4h4v6h4l-6 6zm-6 2h12v2H6v-2z" />
                </svg>
            </h3>
            <div class="desktop-detail-description">{{ podcast.description }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DesktopDetail',
    props: {
        podcast: {
            type: Object,
            required: true
        }
    },
    methods: {
        handleDownloadClick() {
            console.log('Download icon clicked!');
            const url = `https://downloadfile-a6lubplbza-uc.a.run.app?filename=${this.podcast.filename}`;

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then(blob => {
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.setAttribute('download', `${this.podcast.title}.mp3`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch(error => console.error('Download failed:', error));
        },
  
    }
}
</script>

<style scoped>
.desktop-back-container {
    background-color: var(--color-white);
    height: calc(100vh);
    width: 400px;
}

.desktop-detail {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 100px);
    width: 400px;
    overflow-y: auto;
    /* 启用垂直滚动 */
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
}

.desktop-detail-image {
    width: 360px;
    height: 360px;
    border-radius: 5%;
    object-fit: cover;
    margin-top: 50px;
    margin-left: 20px;
}

.desktop-detail-title {
    margin-left: 20px;
    margin-right: 20px;
    color: var(--color-deep-level-1-rose-taupe);
    font-size: 22px;
    display: flex;
    align-items: center;
    /* 使标题与图标在同一行垂直居中 */
}

.download-icon {
    position: relative;
    top: 2px;
    cursor: pointer;
    margin-left: 8px;
    fill: var(--color-deep-level-1-rose-taupe);
}

.desktop-detail-description {
    margin-left: 20px;
    margin-right: 20px;
    font-size: 14px;
    opacity: 0.6;
    color: var(--color-deep-level-1-rose-taupe);
    padding-bottom: 30px;
}
</style>