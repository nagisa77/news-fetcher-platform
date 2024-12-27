import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/global.css'; 
import ElementPlus from 'element-plus'
import 'ldrs/ring'
import { ResizeSensor } from 'css-element-queries';


const app = createApp(App)

app.use(router)
app.use(ElementPlus)

app.directive('element-queries', {
    mounted(el, binding) {
      const callback = binding.value;
      new ResizeSensor(el, () => {
        callback(el.offsetWidth, el.offsetHeight);
      });
    }
  });

app.mount('#app')
