import Vue from 'vue'
import VueI18n from 'vue-i18n'
import locale from './locale.js'
Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'en',
  messages: locale,
  silentTranslationWarn: true
})
