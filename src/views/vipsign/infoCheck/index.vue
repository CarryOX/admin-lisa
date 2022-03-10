<template>
    <div class="info-check">
        <custom-head :config="headConfig" @search="search"></custom-head>

        <custom-table :config="tableConfig" :data="list" :total="total" @modify="handleTableEvent"
                      @change="changePage"></custom-table>

        <el-dialog title="详情" :visible="isShowDialog == 'detail'" :before-close='closeDialog' width="900px">
            <div class="form-style">
                <div>
                  <div style="line-height: 30px; margin-left: 100px">
                    <div style="margin-top: 20px">
                      <span style="font-weight: bold">购购基本信息</span>
                      <span style="margin-left: 20px">购购昵称： {{gogoName}}</span>
                      <span style="margin-left: 20px">购购账号： {{gogoAccount}}</span>
                    </div>
                  </div>
                  <div v-for='(item, index) in keys' :key='item' class="showItem">
                    <span class='form_title'>{{ baseFormData[item].title }}</span>
                    <span class='form_ctn' v-if="!baseFormData[item].isImg">{{ baseFormData[item].value?baseFormData[item].value:"-" }}</span>
                    <el-image class='form_img' v-if="baseFormData[item].isImg" :src='baseFormData[item].value' :preview-src-list="[baseFormData[item].value]">
                      <div slot="error" class="image-slot">
                          <span>/</span>
                      </div>
                    </el-image>
                  </div>
                </div>
            </div>

            <div class="footer-btn">
                <div>
                    <el-button @click="closeDialog">取消</el-button>
                    <el-button :loading="btnLoading" type="primary" @click="sure">确定</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="拒绝" :visible="isShowDialog == 'reject'" :before-close='closeDialog' width="50%">

            <el-form>
              <el-form-item label="拒绝原因：">
                <el-input type="textarea" rows="5" style="width: 200px;" v-model="form.remark" placeholder="请输入备注内容"></el-input>
                </el-form-item>
            </el-form>

            <div class="footer-btn">
                <div>
                    <el-button @click="closeDialog">取消</el-button>
                    <el-button :loading="btnLoading" type="primary" @click="rejectSureBtn">确定</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="编辑" :visible="isShowDialog == 'edit'" :before-close='closeDialog' width="900px">

            <el-form>
              <custom-input :obj="editInfo.username"></custom-input>
              <custom-input :obj="editInfo.sex"></custom-input>
              <custom-input :obj="editInfo.nation"></custom-input>
              <custom-input :obj="editInfo.politics"></custom-input>
              <custom-input :obj="editInfo.education"></custom-input>
              <custom-input :obj="editInfo.identity"></custom-input>
              <custom-input :obj="editInfo.phone"></custom-input>
              <custom-input :obj="editInfo.address"></custom-input>
              <custom-input :obj="editInfo.experience"></custom-input>
              <custom-input :obj="editInfo.remark"></custom-input>
              <div style="display: flex">
                <custom-img :obj='editInfo.identityCard_front'></custom-img>
                <custom-img :obj='editInfo.identityCard_reverse'></custom-img>
                <custom-img :obj='editInfo.userImg'></custom-img>
                <custom-img :obj='editInfo.signature'></custom-img>
              </div>
            </el-form>

            <div class="footer-btn">
                <div>
                    <el-button @click="closeDialog">取消</el-button>
                    <el-button :loading="btnLoading" type="primary" @click="editSureBtn">确定</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import { getInfoCheckList, editInfoCheck, editInfoCheckBtn } from "@/api/vipsign_api";
import commonReq from "@/api/common";
import customInput from "@/components/customInput";
import customTable from "@/components/customTable";
import customHead from "@/components/customHead";
import customImg from "@/components/customImg";

export default {
  components: {
    customHead,
    customTable,
    customInput,
    customImg
  },

  data() {
    return {
      headConfig: {
        placeHolder: "工会姓名/手机号查询",
        dateWidth: "300px",
        selectLabelList: ["处理状态"],
        selectList: [
          [
            { id: null, name: "全部" },
            { id: 1, name: "待审核" },
            { id: 2, name: "已审核" },
            { id: 3, name: "已拒绝" }
          ]
        ]
      },
      tableConfig: {
        showOperate: true,
        loading: false,
        btnList: [
          { key: "detail", value: "详情" },
          { key: "agreebtn", value: "同意", status: 1 },
          { key: "rejectbtn", value: "拒绝", type: "danger", status: 1 },
          { key: "edit", value: "编辑", status: 1},
        ],
        classList: [
          { key: "序号", value: "sort" },
          { key: "申请时间", value: "create_time" },
          { key: "购购信息", value: "gogo_info", textType: true },
          { key: "工会信息", value: "group_info", textType: true },
          { key: "信息审核状态", value: "info_state_temp" },
          { key: "审核人", value: "admin_name" }
        ]
      },
      baseFormData: {
        create_time: { title: "申请时间", value: "1", alert: null },
        username: { title: "姓名", value: "1", alert: null },
        sex: { title: "性别", value: "1", alert: null },
        nation: { title: "民族", value: "1", alert: null },
        politics: { title: "政治面貌", value: "1", alert: null },
        education: { title: "学历", value: "1", alert: null },
        identity: { title: "身份证号", value: "1", alert: null },
        phone: { title: "手机号", value: "1", alert: null },
        address: { title: "居住地址", value: "1", alert: null },
        experience: { title: "工作经验", value: "1", alert: null },
        audit_info_remark: { title: "用户备注", value: "1", alert: null },
        admin_name: { title: "审核者", value: "1", alert: null },
        info_state_temp: { title: "处理状态", value: "1", alert: null },
        info_remark: { title: "审核者备注", value: "1", alert: null },
        signature: { title: "协议签名图", value: "1", alert: null, isImg: true },
        identityCard_front: { title: "身份证正面", value: "1", alert: null, isImg: true },
        identityCard_reverse: { title: "身份证反面", value: "1", alert: null, isImg: true },
        userImg: { title: "1寸冠冕照", value: "1", alert: null, isImg: true }
      },
      list: [],
      btnLoading: false,
      isShowDialog: "",
      member_id: "", // 每一行数据的id值
      total: 0,
      query: {
        page: 1,
        limit: 10
      },
      isLoading: false,
      row: {
        user: {
          member: {}
        }
      },
      form: {
        remark: '',
      },
      editInfo: {
        username: {title: "姓名",value: "",alert: null, inputWidth: "200px", width: '120px', type: 'text'},
        sex: {title: "性别",value: "",alert: null, inputWidth: "200px", width: '120px', type: 'text'},
        nation: {title: "名族",value: "",alert: null, inputWidth: "200px", width: '120px', type: 'text'},
        politics: {title: "政治面貌",value: "",alert: null, inputWidth: "200px", width: '120px', type: 'text'},
        education: {title: "学历",value: "",alert: null, inputWidth: "200px", width: '120px', type: 'text'},
        identity: {title: "身份证",value: "",alert: null, inputWidth: "200px", width: '120px'},
        phone: {title: "手机号",value: "",alert: null, inputWidth: "200px", width: '120px'},
        address: {title: "居住地址",value: "",alert: null, inputWidth: "80%", width: '120px', type: 'text'},
        experience: {title: "工作经验",value: "",alert: null, inputWidth: "80%", width: '120px', type: 'text'},
        remark: {title: "备注",value: "",alert: null, inputWidth: "80%", width: '120px', type: 'text'},
        identityCard_front: { 
          title: '身份证', 
          value: [], 
          alert: null, 
          url: 'https://up-z2.qiniup.com', 
          cdnUrl: 'https://cdn.health.healthplatform.xyz', 
          body: {}, 
          limit: 1, 
          width: '' 
        },
        identityCard_reverse: { 
          title: '身份证1', 
          value: [], 
          alert: null, 
          url: 'https://up-z2.qiniup.com', 
          cdnUrl: 'https://cdn.health.healthplatform.xyz', 
          body: {}, 
          limit: 1, 
          width: '' 
        },
        userImg: { 
          title: '相片', 
          value: [], 
          alert: null, 
          url: 'https://up-z2.qiniup.com', 
          cdnUrl: 'https://cdn.health.healthplatform.xyz', 
          body: {}, 
          limit: 1, 
          width: '' 
        },
        signature: { 
          title: '签名', 
          value: [], 
          alert: null, 
          url: 'https://up-z2.qiniup.com', 
          cdnUrl: 'https://cdn.health.healthplatform.xyz', 
          body: {}, 
          limit: 1, 
          width: '' 
        },
      }
    };
  },
  created() {
    this.getUploadToken()
    this.getList();
  },
  computed: {
    keys() {
      return this.baseFormData ? Object.keys(this.baseFormData) : [];
    },
    gogoName() {
      return this.row.user.member? this.row.user.member.member_nick : '-'
    },
    gogoAccount() {
      return this.row.user.member? this.row.user.member.member_mobile : '-'
    },
  },
  methods: {

    hand() {
      this.keys.forEach(v => {
        this.baseFormData[v].value = this.row[v];
      });
    },

    async getList() {
      this.tableConfig.loading = true;
      let res = await getInfoCheckList(this.query);
      if (res.code == 0 && res.data) {
        let data = res.data;
        data.forEach((v, i) => {
          if(v.info_state == 1) v.agreebtn = v.rejectbtn = v.edit = 1 
          v.sort = i + 1;
          v.gogo_info = [v.user.member.member_nick,  v.user.member.member_mobile]
          v.group_info = [v.audit_info.username,  v.audit_info.phone]
          v.info_state_temp = v.info_state == 1 ? "待审核" : v.info_state == 2? "已审核" : "已拒绝";
          v.info_state_temp_color = v.info_state == 1 ? "black" : v.info_state == 2? "#42b983" : "red";
          v.admin_name = v.infoAdmin?  v.infoAdmin.admin_name : '-'

          v.username = v.audit_info.username;
          v.sex = v.audit_info.sex;
          v.phone = v.audit_info.phone;
          v.nation = v.audit_info.nation;
          v.education = v.audit_info.education;
          v.identity = v.audit_info.identity;
          v.experience = v.audit_info.experience;
          v.address = v.audit_info.address;
          v.politics = v.audit_info.politics;
          v.signature = v.audit_info.signature;
          v.identityCard_front = v.audit_info.identityCard_front;
          v.identityCard_reverse = v.audit_info.identityCard_reverse;
          v.userImg = v.audit_info.userImg;
          v.info_remark = v.info_remark? v.info_remark[0] : '-'
          v.audit_info_remark = v.audit_info.remark
        });
        this.total = res.pagination.total;
        this.list = data;
      }
      this.tableConfig.loading = false;
    },

    async handCheck(state) {
      let data
      if(state == 3) {
        if(!this.form.remark) return this.$message.warning('请输入备注')
        data = {
          info_state: state,
          info_remark: {0: this.form.remark}
        }
      } else {
        data = {
          info_state: state,
        }
      }
      
      let res = await editInfoCheck(data, this.row.audit_id);
      if(res.code == 0) {
        this.$message.success("处理成功！")
        this.getList()
        this.closeDialog()
      } else {this.$message.error(`${res.error}`)}
    },

    handEditInfo() {
      let {audit_info} = this.row
      let keys = Object.keys(audit_info)
      keys.forEach((v, i) => {
        let imgArr = ['identityCard_front', 'identityCard_reverse', 'userImg', 'signature']
        if(imgArr.includes(v)) {
          this.editInfo[v].value = [{ url: audit_info[v] || "" }];
        } else {
          this.editInfo[v].value = audit_info[v]
        }
        
      })
      this.isShowDialog = 'edit'
    },

    async editSureBtn() {
       Object.keys(this.editInfo).forEach(v => {
          if(this.editInfo[v].value == '' && !this.editInfo[v].isNotMust) {
            this.editInfo[v].alert = `${this.editInfo[v].title}不能为空`
          } 
      })
      try {
        Object.keys(this.editInfo).forEach(v => {
          if(this.editInfo[v].alert) throw Error('表单填写错误')
        })
      } catch(e) { console.log(e); return}

      let identityCard_front = this.editInfo.identityCard_front.value.map(e => {return e.raw ? `${this.editInfo.identityCard_front.cdnUrl}/${e.response.key}` : e.url;});
      let identityCard_reverse = this.editInfo.identityCard_reverse.value.map(e => {return e.raw ? `${this.editInfo.identityCard_reverse.cdnUrl}/${e.response.key}` : e.url;});
      let signature = this.editInfo.signature.value.map(e => {return e.raw ? `${this.editInfo.signature.cdnUrl}/${e.response.key}` : e.url;});
      let userImg = this.editInfo.userImg.value.map(e => {return e.raw ? `${this.editInfo.userImg.cdnUrl}/${e.response.key}` : e.url;});
      let audit_info = {
        address: this.editInfo.address.value,
        education: this.editInfo.education.value,
        experience:this.editInfo.experience.value,
        identity: this.editInfo.identity.value,
        identityCard_front: identityCard_front[0],
        identityCard_reverse: identityCard_reverse[0],
        nation: this.editInfo.nation.value,
        phone: this.editInfo.phone.value,
        politics: this.editInfo.politics.value,
        remark: this.editInfo.remark.value,
        sex: this.editInfo.sex.value,
        signature: signature[0],
        userImg: userImg[0],
        username: this.editInfo.username.value,
      }
      let data = {
        audit_info,
        audit_id: this.row.audit_id
      }
      let res = await editInfoCheckBtn(data);
        if(res.code == 0) {
          this.$message.success("编辑成功！")
          this.getList()
          this.closeDialog()
        } else {this.$message.error(`${res.error}`)}
    },

    rejectSureBtn() {
      this.handCheck(3)
    },

    async sure() {
      this.isShowDialog = ""
    },

    closeDialog() {
      if(this.isShowDialog == 'reject') this.form.remark = ""
      if(this.isShowDialog == 'edit') {
        Object.keys(this.editInfo).forEach(v => {
          this.editInfo[v].alert = ""
          if(['identityCard_front', 'identityCard_reverse', 'userImg', 'signature'].includes(v)) {
            this.editInfo[v].value = []
          } else {
            this.editInfo[v].value = ""
          }
        })
      }
      this.isShowDialog = "";
    },

    search(param) {
      console.log(param.statusList, "param.statusList");
      this.query.page = 1;
      this.query.search = param.search;
      this.query.info_state = param.statusList[0];
      if (param.date) {
        this.query.start_time = param.date.startDate;
        this.query.end_time = param.date.endDate;
      } else {
        delete this.query.start_time;
        delete this.query.end_time;
      }
      this.getList();
    },

    handleTableEvent(row, index, i, item) {
      this.row = row;
      this.hand();
      if (item.key == "detail") this.isShowDialog = 'detail'
      if(item.key == 'agreebtn') this.handCheck(2)
      if(item.key == 'rejectbtn')  this.isShowDialog = 'reject'
      if(item.key == 'edit')  this.handEditInfo() 
    },

    changePage(param) {
      this.query.limit = param.limit;
      this.query.page = param.page;
      this.getList();
    },

    async getUploadToken(){
      let res = await commonReq.getUploadToken();
      if(res.error) return this.$message.error(`getUploadToken: ${res.error}`);
      let {identityCard_front, identityCard_reverse, userImg, signature} = this.editInfo
      identityCard_front.body.token = identityCard_reverse.body.token = userImg.body.token = signature.body.token = res.data;
      identityCard_front.body.config = identityCard_reverse.body.config = userImg.body.config = signature.body.config = "{ useCdnDomain: true }";
    },
  }
};
</script>

<style lang="scss">
.el-form-item.el-form-item--medium {
  margin-bottom: 10px !important;
}

.handel-btn {
  background-color: #409eff;
  color: #fff;
}

.form-style {
  display: flex;
}

.form-right > div {
  margin-top: 20px;
}
</style>
<style scoped>
.info-check >>> .el-upload--picture-card {
  width: 90px;
  height: 90px;
  line-height: 90px;
}
.info-check >>> .el-upload-list__item {
  width: 90px;
  height: 90px;
}
</style>

