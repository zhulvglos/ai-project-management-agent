import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import App from './App.vue'
import router from './router'

// GitHub Pages serves this app from a repository subpath. Normalize public
// image URLs so both local development and the deployed demo resolve assets.
const assetBase = import.meta.env.BASE_URL
const nativeImageSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')
if (nativeImageSrc?.set && assetBase !== '/') {
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    ...nativeImageSrc,
    set(value: string) {
      nativeImageSrc.set!.call(this, value.startsWith('/') ? `${assetBase}${value.slice(1)}` : value)
    },
  })
}

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ArcoVue, { componentPrefix: 'a' })
app.mount('#app')
