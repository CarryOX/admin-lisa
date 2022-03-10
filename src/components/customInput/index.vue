<style scoped>
.input{
  width: 100px;
}
</style>
<template>
  <el-form-item :label="obj.title" :label-width="obj.width">

    <div>
      <span>{{obj.pre || obj.preValue}}</span>

      <el-input :style="{width:`${obj.inputWidth}`}" :class='{input: obj.pre || obj.post || obj.preValue || obj.postValue }'
                v-model="obj.value"
                :disabled="'disabled' in obj ? obj.disabled : false"
                auto-complete="off"
                :type="obj.type || 'text'"
                @input='getInput'
                @blur="getBlur" :placeholder="obj.placeholder"></el-input>

      <span>{{obj.post || obj.postValue}}</span>
    </div>
    <transition name="slide-fade">
      <el-alert type='error' show-icon :title='obj.alert' :closable='false' v-if='obj.alert' style='margin-top: 3px'></el-alert>
    </transition>

  </el-form-item>
</template>

<script>
export default {
  name: 'number',

  props: {
    obj: {
      type: Object
    },
  },

  data() {
    return {
      mRegexp: {
        integer: { pattern: /^[+]?\d+$/, alert: `必须为正整数`, },
        positive: { pattern: /^[+]?\d+(?:\.\d+)?$/, alert: `必须为正数`, },
        number: { pattern: /^[+-]?\d+(?:\.\d+)?$/, alert: `必须为数字`, },
        string: { pattern: /^.*$/, alert: `不能为空`, },
        text: { pattern: /^.*$/, alert: `不能为空`, },
      }
    }
  },

  computed: {

  },

  methods: {
    getInput(v){
      console.log(v,"v")
      if(this.obj.custom && typeof this.obj.custom.pattern === 'string') {
          this.obj.custom.pattern = eval(this.obj.custom.pattern)
      }

      let o = this.obj,
          // current validate rule
          reg = o.custom || this.mRegexp[o.type || 'number'];
      
      if(o.preventValidate) return ;

      if(!o.value && !o.isNotMust) return o.alert = `请输入${o.title}`;

      // console.error(reg.pattern.test(o.value), reg.pattern, o.value, o.value.length);
      if(!reg.pattern.test(o.value)) return o.alert = `${o.title}${reg.alert}`;

      // if(isNaN(Number(o.value))) return o.alert = `${o.title}必须为数字`;

      // console.error('custom input obj : ', v);
      o.alert = null;
    },
    getBlur(){
      console.log(11111)
      this.$emit("getList")
    }
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


