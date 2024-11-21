import { defineStore } from 'pinia';
import session from './sessionStorage';

export const useRecordStore = defineStore('record', {
  state: () => ({
    user: {
      username: '',
      password: ''
    },
    isRemember: false,
    lang: 'cn', // cn or en
    isLogin: false
  }),
  getters: {

  },
  actions: {
    // here we change the state
    INIT_LOGIN_STATE () {
      ['user', 'isRemember', 'lang'].forEach((key) => {
        const value = session.getItem(key);
        if (value !== null) {
          this[key] = value
        }
      })
    },
    SET_USER (user) {
      session.setItem('user', user)
      this.user = user
    },
    CLEAR_USER () {
      session.removeItem('user')
      this.user = {
        username: '',
        password: ''
      }
    },
    SET_ISREMEMBER (isRemember) {
      session.setItem('isRemember', isRemember)
      this.isRemember = isRemember
    },
    CLEAR_ISREMEMBER () {
      session.removeItem('isRemember')
      this.isRemember = false
    },
    SET_LANG (lang) {
      session.setItem('lang', lang)
      this.lang = lang
    },
    CLEAR_LANG () {
      session.removeItem('lang')
      this.lang = 'cn'
    },
    SET_LOGIN(isLogin) {
      this.isLogin = isLogin
    }
  }
})
