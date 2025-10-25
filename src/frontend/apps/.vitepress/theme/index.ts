// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './styles/vars.css'
import BuyMeCoffee from './components/BuyMeCoffee.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'layout-bottom': () => h(BuyMeCoffee)
    })
  },
  enhanceApp({ app }) {
    // Register global components here if needed
  }
} satisfies Theme

