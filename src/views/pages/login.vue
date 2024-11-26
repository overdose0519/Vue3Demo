<template>
  <div class="login">
    <transition name="el-zoom-in-top">
      <div class="form_contianer" v-show="isShow">
        <div class="manage_tip">
          <p>{{$t('message.bsManage')}}</p>
        </div>
        <p class="loginTitle">{{ $t('message.title_login') }}</p>
        <el-form :model="state.user" :rules="rules" ref="loginForm" class="loginForm" >
          <el-form-item prop="username">
            <el-input v-model="state.user.username" class="loginInput" :placeholder="$t('message.username')" @keyup.enter="onEnterUp">
              <template #prefix>
                <icon-ep-user/>
              </template>
          </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" show-password class="loginInput" :placeholder="$t('message.password')" v-model="state.user.password" @keyup.enter="onEnterUp" >
              <template #prefix>
                <icon-ep-lock/>
              </template>
            </el-input>
          </el-form-item>
          <div class="checkboxs">
            <el-checkbox v-model="state.isRemember" class="remember">{{$t('message.remPsw')}}</el-checkbox>
            <el-checkbox v-model="state.lang" true-value="en" false-value="cn" @change='translate' class="changeLang">English</el-checkbox>
          </div>
          <el-form-item>
            <el-button type="primary" @click="submitForm()" :loading="loading" class="submit_btn">
              {{$t('message.title_login')}}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useRecordStore } from '@/store/pinia.js';
import md5 from 'js-md5';
import session from '../../store/sessionStorage'
import { computed, ref } from 'vue';

const store = useRecordStore();
const { t, locale } = useI18n();
const state = reactive({
  user: {
    username: '',
    password: ''
  },
  isRemember: false,
  lang: 'cn'
});
console.log('init');

const validLegalInput = (rule, value, callback) => {
  // 只允许输入数字 大小写字母 下划线_ 空格
  const reg = /^[0-9a-zA-Z_ ]+$/;
  if (!reg.test(value)) {
    callback(new Error(t('message.login.illegalCharacter')));
  } else {
    callback();
  }
}

// 表单校验

const rules = computed(() => {
  return {
    username: [
      {
        required: true,
        message: t('message.login.name_tip'),
        trigger: 'blur'
      },
      { validator: validLegalInput, trigger: 'blur' }
    ],
    password: [
      {
        required: true,
        message: t('message.login.pwd_tip'),
        trigger: 'blur'
      },
      { validator: validLegalInput, trigger: 'blur' }
    ]
  }
})
const loginForm = ref(null);

const initLogin = () => {
  ['user', 'isRemember', 'lang'].forEach((key) => {
    const value = session.getItem(key);
    if (value !== null) {
      state[key] = value
    }
  })
  translate(state.lang)
}

const isShow = ref(false);
onMounted(() => {
  store.INIT_LOGIN_STATE();
  initLogin();
  // 显示登录表单
  setTimeout(() => {
    isShow.value = true
  }, 500);
})

// 初始化登录页面
const translate = (val) => {
  locale.value = val;
  store.SET_LANG(val);
  // 修改标题
  document.title = t('message.bsManage')
}

// 按下回车键
const onEnterUp = () => {
  submitForm()
}

const router = useRouter();
const loading = ref(false)
const submitForm = async () => {
  loading.value = true;
  loginForm.value.validate(async(valid) => {
    if (valid) {
      const param = {
        username: state.user.username,
        password: md5(state.user.password) // md5加密
      }
      console.log(param);
      // 这里做登录操作 todo
      if (state.isRemember) {
        store.SET_USER(state.user);
        store.SET_ISREMEMBER(state.isRemember)
      } else {
        store.CLEAR_USER();
        store.CLEAR_ISREMEMBER();
      }
      router.push({ name: 'Home' })
    } else {
      loading.value = false;
    }
  })
}

</script>

<style lang="scss" scoped>
.login{
  width: 100%;
  height: 100%;
  background-color:var(--THEMECOLOR);
  .form_contianer{
    padding: 25px;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 422px;
    height: 334px;
    box-sizing: border-box;
    transform: translate(-50%, -50%);
    text-align: center;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 2px 15px 0px rgba(0,0,0,0.05);
    .manage_tip {
      position: absolute;
      width: 100%;
      top: -100px;
      left: 0;
      p {
        font-size: 36px;
        color: #2150AD;
        font-weight: 500;
      }
    }
    .loginTitle {
      text-align: left;
      font-size: 22px;
      letter-spacing: 2px;
      font-weight: bold;
      margin-top: 0px;
    }
    .loginForm {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      margin-top: 20px;
      .loginInput {
        height: 48px;
        :deep(.el-input__wrapper) {
          background: #ECF1FB;
          border-radius: 11px;
          font-size: 16px
        }
      }
    }
    .submit_btn{
      width: 100%;
      font-size: 22px;
      height: 50px;
      letter-spacing: 2px;
    }
    .checkboxs{
      display: flex;
      height: 32px;
      line-height: 32px;
      justify-content: space-between;
      margin-bottom: 15px;
      font-weight: bold;
    }
  }

}

</style>
