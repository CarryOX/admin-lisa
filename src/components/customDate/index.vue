<template>
  <el-form-item :label="obj.title" :label-width="obj.width || obj.labelWidth">

        <!-- Time -->
        <el-time-picker v-model="obj.value"
                        v-if="isTime || isTimeRange"
                        :is-range="isTimeRange"
                        :disabled="obj.disabled"
                        range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" @change="getInput"></el-time-picker>

        <!-- Date -->
        <el-date-picker v-model="obj.value" 
                        v-else
                        :type="obj.type || 'datetimerange'" 
                        :picker-options="obj.isNow ? pickerOptions : {}"
                        :disabled="obj.disabled"
                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" placeholder="请选择日期" @change='getInput'></el-date-picker>

        <!-- Error -->
        
        <transition name="slide-fade">
          <el-alert :title='obj.alert' :closable='false' type='error' show-icon v-if='obj.alert' style='margin-top: 3px'></el-alert>
        </transition>
  </el-form-item>
</template>

<script>
export default {
  name: 'Date-Time',

  props: {
    /**
     * 
     * obj.type:  
     * 1. 日期 year|month|date|datetime|daterange|datetimerange
     * 2. 时间 time|timerange
     * 
     */
    obj: {
      type: Object
    },
  },

  data() {
    return {
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() < Date.now()-86400000;
        }
      },
      time:''

    }
  },

  computed: {
    isTime(){ return this.obj.type == 'time' },
    isTimeRange(){ return this.obj.type == 'timerange' },
  },

  watch: { },

  methods: {
    getInput(v){
      if(this.obj.limitAfter) {
        let o = this.obj;
        if(o.preventValidate) return ;
        o.alert = (/range/.test(o.type) ? o.value && o.value.length : o.value) ? null : `请输入${o.title}`;
      } else {
        console.log(v,"v")
        let o = this.obj;
        // if(this.time.getTime() > v.getTime()){
        //   this.obj.value = "",
        //   this.$message.error("延期时间应在截止时间之后") ;
        //   return false
        // }
        if(o.preventValidate) return ;
  
        o.alert = (/range/.test(o.type) ? o.value && o.value.length : o.value) ? null : `请输入${o.title}`;
      }

    },
  },
  created(){
    this.time = this.obj.value
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
