<template>
  <el-form-item :label="obj.title" :label-width="obj.width || '100px'" style="margin-top: 15px;">
    <div v-if="obj.type == 'multi'">

      <div class='inline' :key='imgIndex' v-for='(imgItem, imgIndex) in obj.value'>
        <el-upload list-type="picture-card" :class="{disabled: imgItem.value.length}" :action='obj.url' :data='obj.body' :limit='obj.limit'
                :file-list='imgItem.value'
                :on-remove='(e, list) => changeMultiImgs(e, list, imgItem, imgIndex)'
                :on-change="(e, list) => changeMultiImgs(e, list, imgItem, imgIndex)"
                :on-preview='preview'
                :on-success='success'
                :disabled="obj.disabled"
                multiple
                v-if='obj.url'>
                <i class="el-icon-plus"></i>
        </el-upload>
        <div>{{imgItem.title}}</div>
      </div>

    </div>
    <div v-else>
        <el-upload
          :class="{disabled:showCard}"
          :action='obj.url'
          :data='obj.body'
          :limit='obj.limit'
          :file-list='obj.value'
          :on-remove='changeImgs'
          :on-change="changeImgs"
          :on-preview='preview'
          :on-success='success'
          :disabled="obj.disabled"
          list-type="picture"
          v-if='obj.url && obj.picture'>
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过800kb</div>
        </el-upload>
        <el-upload list-type="picture-card"
              :class="{disabled:showCard}"
              :action='obj.url'
              :data='obj.body'
              :limit='obj.limit'
              :file-list='obj.value'
              :on-remove='changeImgs'
              :on-change="changeImgs"
              :on-preview='preview'
              :on-success='success'
              :disabled="obj.disabled"
              multiple
              v-else-if='obj.url'>
              <i class="el-icon-plus"></i>
        </el-upload>
        
        <el-upload action='' list-type="picture-card" :auto-upload="false"
              :limit='obj.limit'
              :file-list='obj.value'
              :on-remove='changeImgs'
              :on-change="changeImgs"
              :on-preview='preview'
              :class="{disabled:showCard}"
              :disabled="obj.disabled"
               v-else>

              <i class="el-icon-plus"></i>

        </el-upload>

        <!-- tip -->
        <div class='tip' v-if='obj.tip'>{{obj.tip}}</div>
    </div>
        <transition name="slide-fade">
          <el-alert :title='obj.alert' :closable='false' type='error' show-icon v-if='obj.alert'></el-alert>
        </transition>

        <!-- preview -->
        <div class='preview_mask' v-if='previewUrl' @click='previewUrl = null'>
          <img class='preview_img' :src='previewUrl' @click.stop=';' />
        </div>
  </el-form-item>
</template>

<script>
export default {
  name: 'customImg',

  props: {
    obj: {
      type: Object
    }
  },
  computed:{
    showCard(){
      return  this.obj.value.length>=Number(this.obj.limit);
    }
  },
  watch: {},

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
      console.log(e,list,"list",this.obj)
      if(e.size/1000>800){
        this.$message("图片大小不能超过800kb");
        this.obj.value = [];
        return false
      }
      let obj = this.obj;

      obj.value = list;
      if(obj.preventValidate) return ;

      this.obj.alert = this.obj.value.length ? null : '请选择图片';
    },

    changeMultiImgs(e, list, item){
      let obj = this.obj,
          arr = obj.value;

      item.value = list;
      console.log(item.value,"value")
      if(obj.preventValidate) return ;

      let res = arr.filter(v => !v.value.length)[0];
      this.obj.alert = res ? `${res.title || obj.title}不能为空` : null;
    },

    success(res){
      let url = `${this.obj.cdnUrl}/${res.key}`;
    }
  }
}
</script>

<style>
  .disabled .el-upload--picture-card{
    display: none;
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

.tip{
  color: #f00;
}

.inline{
  display: inline-block;
  margin: 0 10px 0 0;
  text-align: center;
  color: #666;
}

.el-upload--picture-card{
  margin: 0px 0 21px 0;
}
</style>
