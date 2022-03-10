<template>
  <el-form-item :label="obj.title" :label-width="obj.width || '100px'">
        <el-upload
              :action='obj.url' 
              :data='obj.body'
              :limit='obj.limit'
              :file-list='obj.value' 
              :on-remove='changeImgs'
              :on-change="changeImgs" 
              :on-preview='preview'
              :on-success='success'
              multiple
              v-if='obj.url'
              :class="{disabled:showCard}">

              <div class='el-upload--picture-card'>
                <i class="el-icon-plus"></i>
              </div>

        </el-upload>
        <el-upload action='' :auto-upload="false"
              :limit='obj.limit'
              :file-list='obj.value' 
              :on-remove='changeImgs'
              :on-change="changeImgs"
              :on-preview='preview'
              :class="{disabled:showCard}"
               v-else>

              <div class='el-upload--picture-card'>
                <i class="el-icon-plus"></i>
              </div>

        </el-upload>

        <el-alert :title='obj.alert' :closable='false' type='error' show-icon v-if='obj.alert'></el-alert>

        <!-- preview -->
        <div class='preview_mask' v-if='previewUrl&&!obj.isVideo' @click='previewUrl = null'>
          <img class='preview_img' :src='previewUrl' @click.stop=';' />
        </div>
        <!-- video -->
        <div class='preview_mask' v-if='previewUrl&&obj.isVideo' @click='previewUrl = null'>
          <video class='preview_img' controls="controls" :src='previewUrl' @click.stop=';' />
        </div>
  </el-form-item>
</template>

<script>
export default {
  name: 'customFile',

  props: {
    obj: {
      type: Object
    }
  },
  computed:{
    showCard(){ return this.obj.value.length >= Number(this.obj.limit); }
  },
  watch: {
    // obj: {
    //   immediate: true,
    //   deep: true,
    //   handler(v1, v2){ console.error('watch', v1, v2, this.obj.value); }
    // },
  },

  data() {
    return {
      previewUrl: null,
    }
  },

  methods: {
    preview(file){
      this.previewUrl = file.url;
    },

    changeImgs(e, list){
      console.log(e,list,"list")
      if(e.name.split(".")[1]=="png"||e.name.split(".")[1]=="jpg"||e.name.split(".")[1]=="gif"){
        this.$message.error("请选择正确的视频格式");
        return false
      }
      let obj = this.obj;

      obj.value = list;

      if(obj.preventValidate) return ;
    if(this.obj.status==false){
      this.obj.alert = null;
      return false
    }
      this.obj.alert = this.obj.value.length ? null : `${obj.title}不能为空!`;
    },

    success(res){
      let url = `${this.obj.cdnUrl}/${res.key}`;
      // this.obj.value.push(url);
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card{
  display: none;
}

.plus_wrap{
  padding: 30px 50px;
  border: 1px dashed #606266;
}

.preview_mask{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .6);
  text-align: center;
}
.preview_img{
  width: 800px;
  height: 600px;
  margin: 40px 0 0;
  background: #fff;
}
</style>
