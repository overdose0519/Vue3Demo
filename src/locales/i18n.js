import { createI18n } from 'vue-i18n';
import cn from './cn';
import en from './en';
const i18n = createI18n({
  locale: 'cn',
  legacy: false,
  globalInjection: true,
  messages: {
    en,
    cn
  }
})
export default i18n
