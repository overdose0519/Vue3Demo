import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from './locales/i18n'
import './assets/common.scss'
import './assets/icon-font/iconfont.css'
import App from './App.vue'
import router from './router'
import { ElMessage } from 'element-plus'

const app = createApp(App)
app.use(i18n)
app.use(createPinia())
app.use(router)
app.config.globalProperties.$message = ElMessage

app.mount('#app')
const isLogin = true // 判定是否登录 todo
router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
  } else if (isLogin) {
    next({ name: 'login' }, () => {
      console.log('导航完成')
    })
  } else {
    next()
  }
})
export default app
