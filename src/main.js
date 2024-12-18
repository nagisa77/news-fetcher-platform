import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/global.css'; 
import ElementPlus from 'element-plus'
import 'ldrs/ring'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)

app.mount('#app')
