<template>
  <div class="home">
    <div class="header">
      <!-- 这是头部 -->
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>

</script>
<style lang="scss" scoped>
.home{
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: vh(25) vw(25);
  display: flex;
  flex-direction: column;
  .header {
    height: vh(58);
    margin-bottom: vh(20)
  }
  .main {
    flex: 1;
    box-sizing: border-box;
  }
}
</style>
