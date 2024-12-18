<template>
  <div class="site-container">
    <div class="overlay"></div> <!-- 添加全局粉红色透明度为0.2的蒙层 -->
    <header class="site-header-desktop">
      <HeaderContent ref="header-content-desktop" :showTitle="true" @route-clicked="handleRouteClicked"/>
    </header>

    <header class="site-header-mobile">
      <h1 class="mobile-header-title">Podcasts</h1>
      <button @click="toggleMobileMenu" style="background: none; border: none; padding: 0; cursor: pointer;">
        <svg class="mobile-header-menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
        </svg>
      </button>
    </header>

    <div class="header-content-mobile" :class="{ 'menu-visible': isMobileMenuOpen }">
      <HeaderContent ref="header-content-mobile" :showTitle="false" @route-clicked="handleRouteClicked" />
    </div>

    <div class="site-content">
      <router-view @play-request="playPodcast" />
    </div>
  </div>
</template>

<script>
import HeaderContent from './components/HeaderContent.vue';

export default {
  components: {
    HeaderContent
  },
  data() {
    return {
      isMobileMenuOpen: false,
      isMobile: window.innerWidth < 650, // 新增
    };
  },
  mounted() { // 新增
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() { // 新增: Vue 3 使用 beforeUnmount
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleRouteClicked(routeName) {
      console.log(`Route clicked: ${routeName}`);
      if (this.isMobileMenuOpen) {
        this.toggleMobileMenu();
      }
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    playPodcast(filename) {
      if (this.isMobile) {  
        const audioPlayer = this.$refs['header-content-mobile'].$refs.audioPlayer;
        audioPlayer.src = `https://downloadfile-a6lubplbza-uc.a.run.app?filename=${filename}`;
        audioPlayer.play();
      } else {
        const audioPlayer = this.$refs['header-content-desktop'].$refs.audioPlayer;
        audioPlayer.src = `https://downloadfile-a6lubplbza-uc.a.run.app?filename=${filename}`;
        audioPlayer.play();
      }
    },
    handleResize() { 
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth < 650;
      if (wasMobile !== this.isMobile) {
        this.onViewChange(this.isMobile ? 'mobile' : 'desktop');
      }
    },
    onViewChange(view) { 
      console.log(`视图切换到: ${view}`);
      
      if (this.isMobile) {  
        const audioPlayer = this.$refs['header-content-desktop'].$refs.audioPlayer;
        audioPlayer.pause();
      } else {
        const audioPlayer = this.$refs['header-content-mobile'].$refs.audioPlayer;
        audioPlayer.pause();
      }
    },
  }
}
</script>

<style scoped>
.site-container {
  display: flex;
  height: 100%;
  width: 100%;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-deep-level-3-sky-magenta); 
  z-index: 10000000; 
  opacity: 0.15;
  pointer-events: none; 
}

.header-menu-icon {
  margin-right: 20px;
  color: var(--color-deep-level-1-rose-taupe);
}

.site-content {
  height: 100vh;
  width: calc(100% - 300px);
  background-color: var(--content-background-color);
  transition: margin-left 0.3s ease;
}

.site-header-desktop {
  height: calc(100vh - 200px);
  width: 300px;
  padding: 100px 60px;
  background-color: var(--color-white);
  transition: width 0.3s ease;
  box-shadow: inset 0 10px 10px rgba(0, 0, 0, 0.1);
}

.site-header-mobile {
  height: 100px;
  background-color: var(--color-white);
  width: 100%;
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: transform 0.3s ease-in-out;
  transform: translateY(0);
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
}

.header-content-mobile {
  width: calc(100% - 40px);
  top: 100px;
  height: 0;
  padding: 0 20px;
  background-color: var(--color-white);
  position: absolute;
  z-index: 1000;
  overflow: hidden;
  transition: height 0.3s ease-out, padding 0.3s ease-out;
}

.header-content-mobile.menu-visible {
  height: calc(100% - 100px);
  padding: 20px;
}

.mobile-header-title {
  margin-left: 20px;
  font-size: 24px;
  font-weight: bold;
  color: var(--color-deep-level-1-rose-taupe);
}

.mobile-header-menu-icon {
  margin-right: 20px;
  color: var(--color-deep-level-1-rose-taupe);
}

@media (min-width: 650px) and (max-width: 1099px) {
  .site-header-desktop {
    height: calc(100vh - 200px);
    width: 200px;
    padding: 100px 20px; 
  }

  .site-content {
    width: calc(100% - 200px);
  }
}

@media (max-width: 649px) {
  .site-header-mobile {
    display: flex;
    justify-content: center;
    align-items: center;
    justify-content: space-between;
  }

  .site-header-desktop {
    display: none;
  }

  .site-content {
    width: 100%;
    height: calc(100vh - 100px);
    padding-top: 100px;
  }

  .site-content.collapsed {
    width: 100%;
  }
}
</style>
