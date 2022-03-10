<template>
    <div>
        <custom-head :config="headConfig" @search="search"></custom-head>

        <custom-table :config="tableConfig" :data="list" :total="total" @modify="handleTableEvent" @change="changePage"></custom-table>

    </div>
</template>
<script>
import {refundCheck, refund} from '@/api/vipsign_api'
import customInput from "@/components/customInput";
import customTable from "@/components/customTable";
import customHead from "@/components/customHead";

export default {
    components: {
        customHead,
        customTable,
        customInput,
    },

    data() {
        return {
            headConfig: {
                placeHolder: "姓名/手机号查询",
                dateWidth: "300px",
                selectLabelList: ["处理状态", "退款类型"],
                selectList: [
                    [
                        {id: null, name: "全部"},
                        {id: 1, name: "待退款"},
                        {id: 2, name: "已退款"}
                    ],
                    [
                        {id: null, name: "全部"},
                        // {id: 1, name: "活动报名"},
                        {id: 1, name: "工会报名"},
                        // {id: 3, name: "股东报名"}
                    ]
                ],
            },
            tableConfig: {
                showOperate: true,
                loading: false,
                btnList: [
                    {key: "reback", value: "确认退款", status: 1},
                ],
                classList: [
                    {key: "序号", value: "sort"},
                    {key: "拒绝时间", value: "audit_at"},
                    {key: "姓名", value: "username"},
                    {key: "电话", value: "phone"},
                    {key: "支付方式", value: "pay_type_temp"},
                    {key: "退款类型", value: "audit_type_temp"},
                    {key: "退款金额", value: "pay_amount"},
                    {key: "处理状态", value: "refund_state_temp"},
                    {key: "操作人", value: "admin_name"},
                ],
            },
            form: {},
            list: [],
            btnLoading: false,
            member_id: "", // 每一行数据的id值
            total: 0,
            query: {
                page: 1,
                limit: 10
            },
            isLoading: false,
            audit_id: ''
        };
    },
    created() {
        this.getList()
    },
    methods: {
        async getList() {
          this.tableConfig.loading = true
          let res = await refundCheck(this.query);
          if(res.code == 0 && res.data) {
            let data = res.data
            data.forEach((v, i) => {
              if(v.refund_state !== 2) v.reback = 1
              v.sort = i + 1
              v.username = v.audit_info.username
              v.phone = v.audit_info.phone
              v.pay_type_temp = v.pay_type == 1? '线下' : v.pay_type == 2? '微信' : '-'
              v.audit_type_temp = v.audit_type == 1? '申请工会会员' : '-'
              v.refund_state_temp = v.refund_state == 0? '无' : v.refund_state == 1? '待退款' : '已退款'
              v.refund_fee = v.refund_info? v.refund_info.refund_fee : '-'
              v.admin_name = v.refundAdmin? v.refundAdmin.admin_name : '-'
            })
            this.total = res.pagination.total;
            this.list = data
          }
        this.tableConfig.loading = false
        },

        async refund() {
          let res = await refund(this.audit_id);
          if(res.code == 0) {
            this.$message.success("退款成功")
            this.getList()
          } else {this.$message.error(`${res.error}`)}
        },

        async sure() {
            this.btnLoading = true
            let isNull = true;
            const infoKey = Object.keys(this.vip_edit)
            infoKey.forEach(v => {
                if (this.vip_edit[v].value == '') {
                    this.btnLoading = false
                    this.$message({message: '您有未填写的信息！', type: 'warning'});
                    isNull = false
                }
            })
            if (isNull) {
                let res = await api.editAdminMember({
                    inviter: this.vip_edit[infoKey[0]].value,
                    referrer_mobile: this.vip_edit[infoKey[1]].value
                }, this.member_id)
                if (res.status == 1) {
                    this.btnLoading = false
                    return this.$message({message: res.error, type: 'warning'});
                }
                this.$message.success("修改会员成功")
                this.getList()
                this.closeDialog()
            }
            this.btnLoading = false
        },
        search(param) {
            console.log(param.statusList,"param.statusList")
            this.query.page = 1;
            this.query.search = param.search;
            this.query.refund_state = param.statusList[0];
            this.query.audit_type = param.statusList[1];
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
          console.log(arguments)
            if(item.key == 'reback') {
              this.audit_id = row.audit_id
              this.refund()
            }
        },
        changePage(param) {
            this.query.limit = param.limit;
            this.query.page = param.page;
            this.getList();
        },
    },
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
  display: flex
}

.form-right>div {
  margin-top: 20px;
}
</style>
