<template>
    <div class="desktop-detail">
        <img class="desktop-detail-image" :src="podcast.img_url" alt="Podcast Poster" />
        <h3 class="desktop-detail-title">{{ podcast.title }}</h3>
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
    background-color: #f0f0f0;
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 400px;
}

.desktop-detail-image {
    width: 380px;
    height: 380px;
    border-radius: 5%;
    object-fit: cover;
    margin-top: 50px;
    margin-left: 10px;
}

.desktop-detail-title {
    margin-left: 20px;
}

</style>