<template>
  <div class='footer_wrap'>
    <span class='copyright_wrap'>©{{obj.year}}&nbsp;&nbsp;{{obj.company}}</span>

    <a class='record_wrap' style="margin-right:10px" target="_black" :href='url'>{{obj.province}}公网安备 {{obj.record}}号</a>
    <a style="margin-left:10px" href="https://beian.miit.gov.cn/">{{numbers}}</a>
    <!-- <img src='https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/global/img/icons_441e82f.png' /> -->
  </div>  
</template>

<script>

export default {
  name: 'copyRight',

  props: {
    obj: {
      type: Object,
    }
  },

  data() {
    return {
      // search record info page
      searchURL: 'https://beian.miit.gov.cn/portal/recordQuery',
      // record info page
      URL: 'https://beian.miit.gov.cn/portal/registerSystemInfo?recordcode=',
      numbers:'鄂ICP备19006002号-1'
    }
  },

  computed: {
    url(){ return this.URL + this.obj.record; }
  },

  mounted() {},
  beforeDestroy() {},

  methods: {
    
  }
}
</script>

<style scoped>
.footer_wrap{
  position: absolute;
  left: 0;
  bottom: 20px;
  width: 100%;
  font-size: 12px;
  color: #fff;
  text-align: center;
}

.record_wrap{
  position: relative;
  line-height: 26px;
}
.record_wrap:before{
  position: absolute;
  top: -5px;
  right: -24px;
  content: '';
  width: 20px;
  height: 23px;
  background: url(https://static.ws.126.net/163/f2e/www/index20170701/images/sprite_img20190911.png) no-repeat -459px -662px;
}
.record_wrap:hover{
  text-decoration: underline; 
}
</style>
