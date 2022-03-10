<template>
  <div class="main-wrap">
    <el-form ref="form">
      <el-row :gutter="0">
        <el-col :span="5">
          <el-form-item label="工会报名费用支付">
            <el-switch
              v-model="isPayFee"
              active-text="开启"
              inactive-text="关闭">
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-if="isPayFee">
          <custom-input :obj="fee"></custom-input>
        </el-col>
      </el-row>

      <el-row :gutter="0">
        <el-col :span="5">
          <custom-img :obj='applicationImg'></custom-img>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="0">
        <el-col :span="5">
          <custom-file :obj='contentFile'></custom-file>
        </el-col>
      </el-row>

      <el-row :gutter="0">
        <el-col>
          <el-form-item label="基本说明/合同范本富文本:">
            <editor
              style="width: 50%;height:50%;margin:50px"
              v-model="content1"
              :height="500"
              width="10%"s
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="0">
        <el-col>
          <el-form-item label="合同范本富文本:">
            <editor
              style="width: 50%;height:50%;margin:50px"
              v-model="content2"
              :height="500"
              width="10%"
            />
          </el-form-item>
        </el-col>
      </el-row> -->

      <el-row :gutter="0">
        <el-button type="primary" @click="sure">确定设置</el-button>
      </el-row>




      
    </el-form>
  </div>
</template>

<script>
  import {getSet, editSet} from '@/api/vipsign_api'
  import commonReq from '@/api/common'
  import customFile from '@/components/customFile'
  import customInput from '@/components/customInput'
  import customImg from "@/components/customImg";
  import editor from "@/components/Tinymce";

  export default {
    components: {
      customFile,
      customInput,
      customImg,
      editor
    },

    created() {
      this.getSetting()
      this.getUploadToken()
    },

    data() {
      return {
        isPayFee: false,
        fee: { title: '活动费用开启额度', value: '', alert: null, type: 'number',inputWidth: "200px", placeholder: '请输入'},
        applicationImg: {title: '入会申请书图片', width: '120px',value: [],alert: null, url: 'https://up-z2.qiniup.com',cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {},disabled: false,limit: 1,picture: true},
        content1: null,
        content2: null,
        contentFile: { title: '操作视频', width: '120px',isVideo:true, value: [], limit: 1, alert: null, status:false, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      }
    },

    methods: {
      async getSetting() {
        let res = await getSet({
            config: ['union_member_fee', 'union_member_application', 'union_auth']
        })
        if (res.data) {
          let data = res.data
          this.isPayFee = data.union_member_fee == 0? false : true
          if(data.union_member_fee !== 0) this.fee.value = data.union_member_fee
          this.applicationImg.value.push({url: data.union_member_application})
        }
      },
      async sure() {
        let img1 = this.applicationImg.value.map(v => { return v.raw ? `${this.applicationImg.cdnUrl}/${v.response.key}` : v.url });
        let res = editSet({
            union_member_fee: this.isPayFee? this.fee.value : 0,
            union_member_application: img1[0],
        })
        res.then(response => {
            if(response.code == 0) {
                this.$message.success("修改成功")
            } else {this.$message.error("修改失败")}
        })

      },
      async getUploadToken() {
        let res = await commonReq.getUploadToken();
        if (res.error) return this.$message.error(`getUploadToken: ${res.error}`);
        this.applicationImg.body.token = this.contentFile.body.token = res.data;
        this.applicationImg.body.config = this.contentFile.body.config = "{ useCdnDomain: true }";
      },
    }
    
  }
</script>

<style lang="scss" scoped>
  .main-wrap {
    padding: 40px
  }
</style>


