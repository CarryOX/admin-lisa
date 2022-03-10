<template>
    <div>
        <custom-head :config="headConfig" @search="search"></custom-head>

        <custom-table :config="tableConfig" :data="list" :total="total" @modify="handleTableEvent" @change="changePage"></custom-table>

        <el-dialog :visible="isShowDialog == 'reject'" :before-close='closeDialog' width="50%">

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
    </div>
</template>
<script>
import { getPayCheckList, changePayCheck } from "@/api/vipsign_api";
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
            { id: 3, name: "一拒绝" }
          ]
        ]
      },
      tableConfig: {
        showOperate: true,
        loading: false,
        btnList: [
          { key: "agreebtn", value: "同意", status: 1 },
          { key: "rejectbtn", value: "拒绝", type: "danger", status: 1 },
        ],
        classList: [
          { key: "序号", value: "sort" },
          { key: "申请时间", value: "create_time" },
          { key: "工会信息", value: "group_info", textType: true },
          { key: "支付方式", value: "pay_type_temp" },
          { key: "支付凭证", value: "pay_voucher", isImg: true },
          { key: "支付金额", value: "pay_amount" },
          { key: "审核状态", value: "payment_state_temp" },
          { key: "操作人", value: "admin_name" }
        ]
      },
      list: [],
      btnLoading: false,
      total: 0,
      query: {
        page: 1,
        limit: 10
      },
      isLoading: false,
      row: {},
      form: {
        remark: '',
      },
      isShowDialog: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {

    async getList() {
      this.tableConfig.loading = true;
      let res = await getPayCheckList(this.query);
      if (res.code == 0 && res.data) {
        let data = res.data;
        data.forEach((v, i) => {
          if(v.payment_state == 1) v.agreebtn = v.rejectbtn = 1 
          v.sort = i + 1;
          v.group_info = [v.audit_info.username,  v.audit_info.phone]
          v.pay_type_temp = v.pay_type == 1? '线下' : v.pay_type == 2? '微信' : '-'
          v.pay_voucher = v.pay_info? v.pay_info.img : ''
          v.payment_state_temp = v.payment_state == 1 ? "待审核" : v.payment_state == 2? "已审核" : "已拒绝";
          v.payment_state_temp_color = v.payment_state == 1 ? "black" : v.payment_state == 2? "#42b983" : "red";

          v.admin_name = v.paymentAdmin?  v.paymentAdmin.admin_name : '-'
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
          payment_state: state,
          payment_remark: {0: this.form.remark}
        }
      } else {
        data = {
          payment_state: state,
        }
      }
      
      let res = await changePayCheck(data, this.row.audit_id);
      if(res.code == 0) {
        this.$message.success("处理成功！")
        this.getList()
        this.closeDialog()
      } else {this.$message.error(`${res.error}`)}
    },

    rejectSureBtn() {
      this.handCheck(3)
    },

    async sure() {
      this.btnLoading = true;
      let isNull = true;
      const infoKey = Object.keys(this.vip_edit);
      infoKey.forEach(v => {
        if (this.vip_edit[v].value == "") {
          this.btnLoading = false;
          this.$message({ message: "您有未填写的信息！", type: "warning" });
          isNull = false;
        }
      });
      if (isNull) {
        let res = await api.editAdminMember(
          {
            inviter: this.vip_edit[infoKey[0]].value,
            referrer_mobile: this.vip_edit[infoKey[1]].value
          },
          this.member_id
        );
        if (res.status == 1) {
          this.btnLoading = false;
          return this.$message({ message: res.error, type: "warning" });
        }
        this.$message.success("修改会员成功");
        this.getList();
        this.closeDialog();
      }
      this.btnLoading = false;
    },
    closeDialog() {
      this.isShowDialog = ""
      this.form.remark = ""
    },
    search(param) {
      console.log(param.statusList, "param.statusList");
      this.query.page = 1;
      this.query.search = param.search;
      this.query.payment_state = param.statusList[0];
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
      if(item.key == 'agreebtn') {
        this.handCheck(2)
      }
      if(item.key == 'rejectbtn') {
        this.isShowDialog = 'reject'
      }
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
