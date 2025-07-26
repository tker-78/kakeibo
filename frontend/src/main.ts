import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify( {
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
    },
    display: {
      mobileBreakpoint: 'sm',
      thresholds: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    // デフォルトの設定でモバイルタッチをサポート
    defaults: {
      VSelect: {
        variant: 'outlined',
        density: 'compact',
        menuProps: {
          attach: true,
          closeOnContentClick: true
        }
      }
    }
  }
)

const app = createApp(App)

app.use(vuetify)
app.use(createPinia())
app.use(router)

app.mount('#app')
