<template>
  <div class="site-container">
    <div class="overlay"></div> 
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

    <!-- 修改为带 props 的 MobilePlayer -->
    <MobilePlayer
      :audioSrc="currentAudioSrc"
      :coverSrc="currentPodcastCover"
      :podcastTitle="currentPodcastTitle"
      :podcastSubtitle="currentPodcastSubtitle"
      ref="mobilePlayer"
    />
  </div>
</template>

<script>
import HeaderContent from './components/HeaderContent.vue';
import MobilePlayer from './components/MobilePlayer.vue';
export default {
  components: {
    HeaderContent,
    MobilePlayer
  },
  data() {
    return {
      isMobileMenuOpen: false,
      currentAudioSrc: '',
      currentPodcastCover: 'https://storage.googleapis.com/news-fetcher-platform.firebasestorage.app/podcasts_image/df_image.png?GoogleAccessId=firebase-adminsdk-i0di3%40news-fetcher-platform.iam.gserviceaccount.com&Expires=16447017600&Signature=g3ny1EQ2mliNum08Zk8sP7WL3sE2k9uQFbq9CbJePyqnYIAbexJcZPRG6BPfga7beRk0naYdWKKnZM1RDzGcJEq7xmkxVTNx09pNoD6kN3PYiawt3DvYANWnDCC5HqRad%2B%2BPbwEX5YjTlr9iBGIkk9TJ39%2F6c2VypXaztZDMMdoGZoeC4792Sqc6Bwd%2F7zyi%2FztUUj3%2BHGjroXd1w3c%2BkCEaVMzFN7IXpMMBYClTEv5lYXNLc6NL%2BUNFrFQWUQxrKS3mC1nhsOjwAQbwNCoa7K%2BnvScwdP20iFbVp0Q7hvstB1n9FctEvow0EwuStyn2UPTa8nfMCsKWvV5wAlfRzQ%3D%3D',
      currentPodcastTitle: '-',
      currentPodcastSubtitle: '-',
    };
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
    playPodcast(podcast) {
      // 根据业务场景拼接出完整音频地址
      this.currentAudioSrc = `https://downloadfile-a6lubplbza-uc.a.run.app?filename=${podcast.filename}`;
      this.currentPodcastCover = podcast.img_url;
      this.currentPodcastTitle = podcast.title;
      this.currentPodcastSubtitle = podcast.subtitle;
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
  width: calc(100vw - 300px);
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
