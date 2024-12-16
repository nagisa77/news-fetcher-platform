import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from './pages/HomePage.vue';
import CreatePodcastPage from './pages/CreatePodcastPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/create-podcast', component: CreatePodcastPage },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
