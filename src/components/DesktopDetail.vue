<template>
    <div class="desktop-detail">
        <img class="desktop-detail-image" :src="podcast.img_url" alt="Podcast Poster" />
        <h3 class="desktop-detail-title">{{ podcast.title }}</h3>
        <div class="desktop-detail-description">{{ podcast.description }}</div>
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
    }
}
</script>

<style scoped>
.desktop-detail {
    background-color: var(--color-white);
    display: flex;
    flex-direction: column;
    height: calc(100vh - 100px);
    width: 400px;
    overflow-y: auto; /* 启用垂直滚动 */
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