<template>
  <el-config-provider :locale="locale">
    <router-view id='app'/>
  </el-config-provider>
</template>
<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import en from 'element-plus/dist/locale/en.mjs'
import { useRecordStore } from './store/pinia';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
const store = useRecordStore();
const { lang } = storeToRefs(store);
// 修改整体的中英文
const locale = ref(zhCn);
watch(() => lang.value, (newVal) => {
  if (newVal === 'cn') {
    locale.value = zhCn
  } else if (newVal === 'en') {
    locale.value = en
  }
}, {
  immediate: true
})

</script>
<style lang="scss">
  #app{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
</style>
