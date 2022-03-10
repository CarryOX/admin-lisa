<style scoped>
.input{
  width: 100px;
}
</style>
<template>
  <el-form-item :label="obj.title" :label-width="obj.width">

    <div>
      <span>{{obj.pre || obj.preValue}}</span>

      <el-color-picker v-model="obj.color"></el-color-picker>

      <span>{{obj.post || obj.postValue}}</span>
    </div>
    <transition name="slide-fade">
      <el-alert type='error' show-icon :title='obj.alert' :closable='false' v-if='obj.alert' style='margin-top: 3px'></el-alert>
    </transition>

  </el-form-item>
</template>

<script>
export default {
  name: 'color',

  props: {
    obj: {
      type: Object
    },
  },

  data() {
    return {
      color1: '#bfa'
    }
  },

  computed: {

  },

  methods: {
    
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(30px);
  opacity: 0;
}
</style>


