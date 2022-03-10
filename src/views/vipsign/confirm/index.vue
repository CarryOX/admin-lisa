<template>
    <div>
        <custom-head :config="headConfig" @search="search"></custom-head>

        <custom-table :config="tableConfig" :data="list" :total="total" @modify="handleTableEvent" @change="changePage"></custom-table>

        <el-dialog title="详情" :visible="isShowDialog == 'detail'" :before-close='closeDialog' width="900px">
            <div>
              <div style="line-height: 30px; margin-left: 100px">
                <div>申请时间： {{row.create_time}}</div>
                <div style="margin-top: 20px">
                  <div style="font-weight: bold">支付信息审核</div>
                  <div style="margin-left: 20px">审核者： {{row.paymentAdmin?  row.paymentAdmin.admin_name : '-'}}</div>
                  <div style="margin-left: 20px">审核结果： {{row.payment_state_temp}}</div>
                  <div style="margin-left: 20px">备注： {{row.payment_remark? row.payment_remark[0] : "-"}}</div>
                </div>
                <div style="margin-top: 20px">
                  <div style="font-weight: bold">会员信息审核</div>
                  <div style="margin-left: 20px">审核者： {{row.infoAdmin?  row.infoAdmin.admin_name : '-'}}</div>
                  <div style="margin-left: 20px">审核结果： {{row.info_state_temp}}</div>
                  <div style="margin-left: 20px">备注： {{row.info_remark? row.info_remark[0] : "-"}}</div>
                </div>
                <div style="margin-top: 20px">
                  <div style="font-weight: bold">购购基本信息</div>
                  <div style="margin-left: 20px">购购昵称： {{row.user.member.member_nick}}</div>
                  <div style="margin-left: 20px">购购账号： {{row.user.member.member_mobile}}</div>
                </div>
              </div>
              <el-divider></el-divider>
              <div>
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

        <el-dialog title="备注" :visible="isShowDialog == 'reject' || isShowDialog == 'agree'" :before-close='closeDialog' width="50%">

            <el-form>
              <el-form-item :label="isShowDialog == 'agree'? '当前审核意见不一致，请填写原因：' : '拒绝原因：' " >
                <el-input type="textarea" rows="5" style="width: 200px;" v-model="form.remark" placeholder="请输入备注内容"></el-input>
              </el-form-item>
            </el-form>

            <div class="footer-btn">
                <div>
                    <el-button @click="closeDialog">取消</el-button>
                    <el-button :loading="btnLoading" type="primary" @click="remarkSureBtn">确定</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import { payCheck, editPayCheck } from "@/api/vipsign_api";
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
        placeHolder: "姓名/手机号查询",
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
        ],
        classList: [
          { key: "序号", value: "sort" },
          { key: "申请时间", value: "create_time" },
          { key: "购购信息", value: "gogo_info", textType: true },
          { key: "工会信息", value: "group_info", textType: true },
          { key: "支付审核状态", value: "payment_state_temp"},
          { key: "信息审核状态", value: "info_state_temp"},
          { key: "处理状态", value: "audit_state_temp" },
          { key: "操作人", value: "admin_name" }
        ]
      },
      baseFormData: {
        username: { title: "姓名", value: "1", alert: null },
        sex: { title: "性别", value: "1", alert: null },
        nation: { title: "民族", value: "1", alert: null },
        politics: { title: "政治面貌", value: "1", alert: null },
        education: { title: "学历", value: "1", alert: null },
        identity: { title: "身份证号", value: "1", alert: null },
        phone: { title: "手机号", value: "1", alert: null },
        address: { title: "居住地址", value: "1", alert: null },
        experience: { title: "工作经验", value: "1", alert: null },
        remark: { title: "备注", value: "1", alert: null },
        admin_name: { title: "审核者", value: "1", alert: null },
        audit_state_temp: { title: "处理状态", value: "1", alert: null },
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
      row: {user: {member:{}}},
      form: {
        remark: '',
      }
    };
  },
  created() {
    this.getList();
  },
  computed: {
    keys() {
      return this.baseFormData ? Object.keys(this.baseFormData) : [];
    }
  },
  methods: {

    hand() {
      this.keys.forEach(v => {
        this.baseFormData[v].value = this.row[v];
      });
    },

    async getList() {
      this.tableConfig.loading = true;
      let res = await payCheck(this.query);
      if (res.code == 0 && res.data) {
        let data = res.data;
        data.forEach((v, i) => {
          if(v.audit_state == 1) v.agreebtn = v.rejectbtn = 1 
          v.sort = i + 1;
          v.gogo_info = [v.user.member.member_nick,  v.user.member.member_mobile]
          v.group_info = [v.audit_info.username,  v.audit_info.phone]
          v.payment_state_temp = v.payment_state == 1 ? "待审核" : v.payment_state == 2? "已审核" : "已拒绝";
          v.payment_state_temp_color = v.payment_state == 1 ? "black" : v.payment_state == 2? "#42b983" : "red";
          v.info_state_temp = v.info_state == 1 ? "待审核" : v.info_state == 2? "已审核" : "已拒绝";
          v.info_state_temp_color = v.info_state == 1 ? "black" : v.info_state == 2? "#42b983" : "red";
          v.audit_state_temp = v.audit_state == 1 ? "待审核" : v.audit_state == 2? "已审核" : "已拒绝";
          v.audit_state_temp_color = v.audit_state == 1 ? "black" : v.audit_state == 2? "#42b983" : "red";
          v.admin_name = v.auditAdmin? v.auditAdmin.admin_name : '-'

          v.username = v.audit_info.username;
          v.sex = v.audit_info.sex;
          v.phone = v.audit_info.phone;
          v.address = v.audit_info.address;
          v.nation = v.audit_info.nation;
          v.education = v.audit_info.education;
          v.experience = v.audit_info.experience;
          v.identity = v.audit_info.identity;
          v.politics = v.audit_info.politics;
          v.remark = v.audit_remark? v.audit_remark[0] : "-";
          v.signature = v.audit_info.signature;
          v.identityCard_front = v.audit_info.identityCard_front;
          v.identityCard_reverse = v.audit_info.identityCard_reverse;
          v.userImg = v.audit_info.userImg;
        });
        this.total = res.pagination.total;
        this.list = data;
      }
      this.tableConfig.loading = false;
    },

    async handCheck(state) {
      let data
      if(state == 3 || (state == 2 && this.isShowDialog == 'agree')) {
        if(!this.form.remark) return this.$message.warning('请输入备注')
        data = {
          audit_state: state,
          audit_remark: {0: this.form.remark}
        }
      } else {
        data = {
          audit_state: state,
        }
      }
      
      let res = await editPayCheck(data, this.row.audit_id);
      if(res.code == 0) {
        this.$message.success("处理成功！")
        this.getList()
        this.closeDialog()
      } else {this.$message.error(`${res.error}`)}
    },

    remarkSureBtn() {
      if(this.isShowDialog == 'agree') {
         this.handCheck(2)
      } else if(this.isShowDialog == 'reject') {
        this.handCheck(3)
      }
    },

    async sure() {
      this.isShowDialog = ""
    },

    showDialog(index, data) {
      this.isShowDialog = 'detail';
    },
    closeDialog() {
      this.form.remark = ""
      this.isShowDialog = "";
    },
    search(param) {
      console.log(param.statusList, "param.statusList");
      this.query.page = 1;
      this.query.search = param.search;
      this.query.audit_state = param.statusList[0];
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
      if (item.key == "detail") this.showDialog();
      if(item.key == 'agreebtn') {
        if(row.payment_state == 3 || row.info_state != 2) {
          this.isShowDialog = 'agree'
        } else {
          this.handCheck(2)
        }
      } 
      if(item.key == 'rejectbtn')  this.isShowDialog = 'reject'
    },
    changePage(param) {
      this.query.limit = param.limit;
      this.query.page = param.page;
      this.getList();
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
