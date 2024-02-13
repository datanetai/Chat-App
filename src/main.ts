import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import '@fortawesome/fontawesome-free/css/all.css'
import '@/assets/index.css'


const app = createApp(App)
app.use(router)
app.use(createPinia())
app.directive('auto-height', {
    updated: function (el) {
        el.style.height = 'auto';
        const maxHeight = window.innerHeight / 3;
        const newHeight = Math.min(el.scrollHeight, maxHeight);
        el.style.height = newHeight + 'px';
    },
    mounted: function (el) {
        el.style.height = 'auto';
        const maxHeight = window.innerHeight / 3;
        const newHeight = Math.min(el.scrollHeight, maxHeight);
        el.style.height = newHeight + 'px';
    }
});

app.mount('#app')