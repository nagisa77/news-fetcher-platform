<template>
  <div class="create-podcast-page">
    <h3>Some Podcasts is Generating...</h3>
    <div v-if="loading">Loading...</div>
    <div v-else class="actions-container">
      <div v-for="action in actions" :key="action.id" class="action-item">
        <span class="status-icon">
          <l-ring-2 v-if="action.status === 'in_progress' || action.status === 'queued'"
            size="20" stroke="5" stroke-length="0.25" bg-opacity="0.1" speed="0.8"
            color="var(--color-deep-level-1-rose-taupe)"></l-ring-2>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-check">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <span class="action-details">
          <template v-if="action.name.includes('triggered event')">
            <span class="action-username">{{ getNameBeforeTriggeredEvent(action.name) }}</span> triggered event
          </template>
          <template v-else>
            {{ action.name }}
          </template>
        </span>
        <span class="action-created-at">
          {{ formatDate(action.created_at) }}
        </span>
      </div>
      <!-- ...... -->
    </div>
  </div>
</template>
<script>
import { ring2 } from 'ldrs'

ring2.register()

export default {
  name: 'CreatePodcastPage',

  data() {
    return {
      actions: [],
      loading: true,
    }
  },

  mounted() {
    this.fetchActions();
  },

  methods: {
    async fetchActions() {
      this.loading = true;
      try {
        const response = await fetch(
          "https://getactiondetail-a6lubplbza-uc.a.run.app"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.actions = await response.json();
      } catch (error) {
        console.error('Failed to fetch actions:', error);
      } finally {
        this.loading = false;
      }
    },
    getNameBeforeTriggeredEvent(name) {
      const keyword = 'triggered event';
      const index = name.indexOf(keyword);
      if (index !== -1) {
        return name.substring(0, index).trim();
      }
      return name;
    },
    formatDate(dateString) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        // timeZoneName: 'short'
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  }
}
</script>
<style scoped>
.create-podcast-page {
  display: flex;
  flex-direction: column;
  color: var(--color-deep-level-1-rose-taupe);
  background-color: var(--color-white);
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.actions-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.action-username {
  color: var(--color-white);
  background-color: var(--color-deep-level-1-rose-taupe);
  padding: 2px 5px;
  border-radius: 5px;
  font-weight: bold;
}

.action-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 10px;
}

.status-icon {
  margin-right: 15px;
  /* 调整图标与文本之间的间距 */
}

.action-details {
  margin-left: 10px;
  font-size: 14px;
}

.action-created-at {
  margin-left: 10px;
  opacity: 0.5;
  font-size: 10px;
}

@media (max-width: 649px) {
  .action-details {
    font-size: 12px;
    margin-left: 2px;
  }

  .action-created-at {
    font-size: 8px;
    margin-left: 2px;
  }

  .status-icon {
    margin-right: 2px;
  }

  .create-podcast-page {
    height: calc(100vh - 100px);
  }
}

</style>