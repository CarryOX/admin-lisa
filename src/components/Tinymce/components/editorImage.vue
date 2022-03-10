<template>
  <div class="upload-container">
    <el-button icon='el-icon-upload' size="mini" :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上传图片
    </el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <custom-img :obj='img'></custom-img>

      <el-button style="margin-left:100px;" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitImg">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import uploadFn from '@/utils/tencent_cos'
import customImg from '@/components/customImg'
import commonReq from "@/api/common";

export default {
  name: 'editorSlideUpload',
  components:{
    customImg
  },
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  created(){
    this.getUploadToken();
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      img: {
        title: "图片",
        value: [],
        limit: 100,
        alert: null,
        url: "https://up-z2.qiniup.com",
        cdnUrl: "https://cdn.health.healthplatform.xyz",
        body: {}
      },
    }
  },
  methods: {
    changeImg(file, fileList) {
      this.fileList = fileList;
    },
    async submitImg() {
      let loading = this.$loading({ text: '正在上传中 ...' });
      // if(!this.fileList.length) this.$emit();
      let img = this.img.value.map(v => {
        return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url;
      });
      // let res = await uploadFn(this.fileList.map(v => v.raw));
      // console.warn(this.fileList, res);

      this.$emit('successCBK', img.map(v => { return { url: v }; }));

      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
      loading.close();
    },
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.files.file
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    },
    async getUploadToken() {
      let res = await commonReq.getUploadToken();

      if (res.error) return this.$message.error(`getUploadToken: ${res.error}`);

      this.img.body.token = res.data;
      this.img.body.config ="{ useCdnDomain: true }";
    },

  }
}
</script>
