<template>
  <div class="dashboard-container">
    <div class="dashboard-container" id="home">
      <el-image :src="require('@/assets/noinformation.png')" alt="" style="width: 700px; margin:0 auto; display:block"></el-image>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
