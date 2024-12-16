<template>
    <div class="header-content">
        <!-- 根据 showTitle 来判断是否显示标题 -->
        <h1 v-if="showTitle" class="header-text header-title" @click="navigateToHome">Podcasts</h1>
        <div class="header-text header-route">
            <li v-for="item in routes" :key="item.name" class="header-route-item">
                <router-link :to="item.path" @click="handleRouteClick(item.name)">
                    {{ item.name }}
                </router-link>
            </li>
        </div>

        <!-- 音频播放器 -->
        <div class="audio-container">
            <audio ref="audioPlayer" controls class="audio-player"></audio>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        routes: {
            type: Array,
            default: () => [
                { name: '首页', path: '/' },
                { name: '创建播客', path: '/create-podcast' },
            ],
        },
        showTitle: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        handleRouteClick(routeName) {
            this.$emit('route-clicked', routeName);
        },
        navigateToHome() {
            this.$router.push('/');
        }
    },
};
</script>

<style scoped>
.header-content {
    padding-top: 10px;
    color: var(--color-deep-level-1-rose-taupe);
    background-color: var(--color-white);
}

.header-route {
    padding-top: 80px;
    font-weight: normal;
    list-style-type: none;
    line-height: 2;
    font-size: 13px;
}

.header-route-item a {
    transition: font-weight 0.3s ease;
    text-decoration: none;
    color: inherit;
}

.header-route-item a:hover {
    text-decoration: underline;
    color: var(--color-deep-level-2-rose-taupe);
}

.audio-container {  
    margin-top: 50px;
    width: 100%;
}

.audio-player {
    width: 100%;
}
</style>