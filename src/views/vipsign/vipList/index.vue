<template>
    <div>
        <custom-head :config="headConfig" @search="search"  @export="exportExcel"></custom-head>

        <custom-table :config="tableConfig" :data="list" :total="total" @modify="handleTableEvent"  @change="changePage"></custom-table>

        <el-dialog title="详情" :visible="isShowDialog == 'detail'" :before-close='closeDialog' width="50%">
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

                <div style="display: inline" v-if="item === 'phone'">
                  <el-input class="el-input" style="margin-left: 20px;width: 150px;" v-model="form.vip_phone" placeholder="修改手机号" clearable></el-input>
                </div>

                <div style="display: inline" v-if="item === 'address'">
                  <el-input class="el-input" style="margin-left: 20px;width: 150px;" v-model="form.vip_address" placeholder="修改地址" clearable></el-input>
                </div>
              </div>
            </div>
            <el-divider></el-divider>

            <el-form>
              <el-form-item label="注册时间：">{{row.union_auth_at}}</el-form-item>
              <el-form-item label="到期时间：">
                <el-date-picker v-model="form.activeTime" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="会员证编号：">
                {{row.union_no}}
              </el-form-item>
            </el-form>
            <el-divider></el-divider>

            <div>会员证发放记录</div>
            <!-- <custom-table  :config="tableDetail"  :data="listDetail"></custom-table> -->
             <el-table
              border
              :data="listDetail"
              style="width: 100%">
              <el-table-column align='center' prop="create_time" label="时间" width="180"></el-table-column>
              <el-table-column align='center' prop="Shipper" label="物流" width="180"></el-table-column>
              <el-table-column align='center' prop="LogisticCode" label="单号">
                <template slot-scope="scope">
                  {{scope.row.LogisticCode}} 
                  <span v-if="scope.row.express_state == 1" @click="changeShipper(scope.row)" class="wuliuxiugai">修改物流</span></span>
                </template>
              </el-table-column>
              <el-table-column align='center' prop="audit_type_temp" label="性质"></el-table-column>
              <el-table-column align='center' prop="express_state_temp" label="状态"></el-table-column>
            </el-table>

            <div class="footer-btn">
                <div>
                    <el-button @click="closeDialog">取消</el-button>
                    <el-button :loading="btnLoading" type="primary" @click="sure('time')">确定</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="物流" class="address-style" :visible="isShowDialog == 'putgoods'" width="500px" @close="closeDialog">
          <el-form>
            <custom-input :obj="post_data.post" @getList="getData"></custom-input>
            <custom-select :obj='post_data.postName'></custom-select>
            <custom-input :obj="post_data.certificate"></custom-input>
          </el-form>
          <div slot="footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="editAddress">确 定</el-button>
          </div>
        </el-dialog>

    </div>
</template>
<script>
import { getViplist, editUserInfo, vipputgoods, delete_vip, getVip } from "@/api/vipsign_api";
import customInput from "@/components/customInput";
import customTable from "@/components/customTable";
import customHead from "@/components/customHead";
import customImg from "@/components/customImg";
import customDate from "@/components/customDate";
import logistic from "@/utils/logistic.js";
import customSelect from "@/components/select";
import Moment from "@/utils/moment";

export default {
  mixins: [logistic],
  components: {
    customHead,
    customTable,
    customInput,
    customImg,
    customDate,
    customSelect
  },

  data() {
    return {
      headConfig: {
        showExport: true,
        placeHolder: "姓名/手机号查询",
        dateWidth: "300px",
        dateWidthTitle: "注册到期日",
        selectLabelList: ["账号状态", "会员证"],
        selectList: [
          [
            { id: null, name: "全部" },
            { id: 1, name: "正常" },
            { id: 2, name: "超期/冻结" }
          ],
          [
            { id: null, name: "全部", disabled: false },
            { id: 1, name: "未发放", disabled: false },
            { id: 2, name: "已发放", disabled: false }
          ]
        ],
        selectDefault: [null, null]
      },
      tableConfig: {
        
        showOperate: true,
        loading: false,
        btnList: [
          { key: "detail", value: "详情" },
          { key: "freeze", value: "冻结", type: "danger", status: 1 },
          { key: "unfreeze", value: "解除冻结", type: "danger", status: 1 },
          { key: "delete", value: "删除", type: "danger"},
          { key: "deliver", value: "寄送会员证", status: 1 }
        ],
        classList: [
          { key: "序号", value: "sort" },
          { key: "注册到期日", value: "union_auth_at" },
          { key: "会员到期日", value: "union_expire_at" },
          { key: "姓名", value: "username" },
          { key: "性别", value: "sex" },
          { key: "电话", value: "phone" },
          { key: "地址", value: "address" },
          { key: "账号状态", value: "union_member_freeze_temp" }
        ]
      },
      tableDetail: {
        classList: [
          { key: "时间", value: "create_time" },
          { key: "物流", value: "Shipper" },
          { key: "单号", value: "LogisticCode" },
          { key: "性质", value: "audit_type_temp" },
          { key: "状态", value: "express_state_temp" }
        ]
      },
      listDetail: [],
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
        signature: { title: "协议签名图", value: "1", alert: null, isImg: true },
        identityCard_front: { title: "身份证正面", value: "1", alert: null, isImg: true },
        identityCard_reverse: { title: "身份证反面", value: "1", alert: null, isImg: true },
        userImg: { title: "1寸冠冕照", value: "1", alert: null, isImg: true }
      },

      form: {
        activeTime: "",
        vip_phone: "",
        vip_address: ""
      },
      post_data: {
        post: {
          type: "string",
          title: "物流单号",
          value: "",
          alert: null,
          inputWidth: "80%",
        },
        postName: {
          title: "物流公司",
          value: "",
          alert: null,
          categories: [],
        },
        certificate: { title: '会员证编号', value: '', type: "string", alert: null,inputWidth: "77%", placeholder: '请输入会员证编号'},
      },
      logisticsDetail_data: {},
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
      row: {member:{}},
    };
  },
  created() {
    if(this.$store.getters.isSuper != 1) {
      this.query.express = 1; //未发放 非超级管理员只能查看未发放
      this.headConfig.selectDefault[1] = 1
      this.headConfig.selectList[1][0].disabled = this.headConfig.selectList[1][2].disabled = true
    }
    this.getList()

  },
  computed: {
    keys() {
      return this.baseFormData ? Object.keys(this.baseFormData) : [];
    },
    gogoName() {
      return this.row.member.member_nick || '-'
    },
    gogoAccount() {
      return this.row.member.member_mobile || '-'
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
      let res = await getViplist(this.query);
      let data = res.data;
      if(res.code == 0 && data) {
        data.forEach((v, i) => {
          v.union_member_freeze == 1 ? v.unfreeze = 1 : v.freeze = 1;
          v.oneExpress? v.deliver = 1 : v.deliver = 0
          v.sort = i + 1;
          v.username = v.union_info.username;
          v.sex = v.union_info.sex;
          v.phone = v.union_info.phone;
          v.address = v.union_info.address;
          v.union_member_freeze_temp = v.union_member_freeze == 1 ? "过期/冻结" : "正常";

          v.nation = v.union_info.nation;
          v.experience = v.union_info.experience;
          v.identity = v.union_info.identity;
          v.politics = v.union_info.politics;
          v.remark = v.union_info.remark;
          v.education = v.union_info.education;
          v.signature = v.union_info.signature;
          v.identityCard_front = v.union_info.identityCard_front;
          v.identityCard_reverse = v.union_info.identityCard_reverse;
          v.userImg = v.union_info.userImg;
        });
        this.total = res.pagination.total;
        this.list = data;
      }
      this.tableConfig.loading = false;
    },

    async sure(param) {
      this.btnLoading = true;
      let data = {}
      
      if(param == 'time') {
        let date = Moment(this.form.activeTime).format("yyyy-MM-dd HH:mm:ss");
        data.union_expire_at =  date

        data.union_info = {
          phone: this.form.vip_phone,
          address: this.form.vip_address,
        }
        
        if(!data.union_info.phone || !data.union_info.address || !data.union_expire_at)  return this.$message.warning('请填写完整信息！'), this.btnLoading = false;

        Object.keys(this.baseFormData).forEach(v => {
          if(!['activeTime', 'phone', 'address'].includes(v)) {
            data.union_info[v] = this.baseFormData[v].value
          }
        })
      } 
      if(param == 'freeze') data.union_member_freeze =  1
      if(param == 'unfreeze') data.union_member_freeze =  0
      let res = await editUserInfo(data, this.row.user_id);
      if (res.code == 1) {
        this.btnLoading = false;
        return this.$message({ message: res.error, type: "warning" });
      }
      this.$message.success("修改成功!");
      this.btnLoading = false;
      this.getList();
      this.closeDialog();
    },

    editAddress() {
      Object.keys(this.post_data).forEach(v => {
        if (this.post_data[v].value == "" && !this.post_data[v].isNotMust)
          this.post_data[v].alert = `${this.post_data[v].title}不能为空`;
      });
      try {
        Object.keys(this.post_data).forEach(v => {
          if (this.post_data[v].alert) throw Error("表单填写错误");
        });
      } catch (e) {
        console.log(e);
        return;
      }
      this.putgoodInfo();
    },

    putgoodInfo() {
      let company = this.post_data.postName
      let data = {
        ShipperCode: company.value,
        LogisticCode: this.post_data.post.value,
        Shipper: company.categories.filter(v => v.id == company.value)[0].name,
        union_no: this.post_data.certificate.value
      }

      let audit_id = JSON.stringify(this.logisticsDetail_data) == "{}"? this.row.oneExpress.audit_id : this.logisticsDetail_data.audit_id 
      let res = vipputgoods(data, audit_id)
      res.then(val => {
        if(val.code === 0) {
          this.getList()
          this.closeDialog();
          this.$message.success('发货成功')
        } else { this.$message.error(`${val.error}`) }
      }).catch(e => this.$message.error(e))
    },

    deleteVip(id) {
      let res = delete_vip(id)
        res.then(val => {
          if(val.code === 0) {
            this.getList()
            this.$message.success('删除成功')
          } else { this.$message.error(`${val.error}`) }
        }).catch(e => this.$message.error(e))
    },

     getDetailInfo() {
      let res = getVip(this.row.user_id)
      res.then(val => {
        if(val.code === 0) {
          let data = val.data
          if(data.manyExpress) {
            data.manyExpress.forEach(v => {
              v.Shipper = v.express_info.Shipper
              v.LogisticCode = v.express_info.LogisticCode
              v.express_state_temp = v.express_state == 1? '待发货' : v.express_state == 2? '已发货' : '已收货'
              v.express_state_temp_color = v.express_state == 1? 'black' : v.express_state == 2? 'green' : 'yellow'
              v.audit_type_temp = v.audit_type == 1? '工会报名' : '工会续费'
            })
            this.listDetail = data.manyExpress
          }
        }
      }).catch(e => this.$message.error(e))
    },

    handDetail() {
      this.hand();
      this.form.activeTime = this.row.union_expire_at
      this.form.vip_phone = this.row.phone
      this.form.vip_address = this.row.address
      this.getDetailInfo()
      this.showDialog();
    },

    changeShipper(dataRow) {
      this.logisticsDetail_data = dataRow
      this.isShowDialog = "putgoods";
    },

    showDialog(index, data) {
      this.isShowDialog = "detail";
    },

    closeDialog() {
      if(this.isShowDialog == "putgoods") {
        this.logisticsDetail_data = {}
        this.post_data.post.value = this.post_data.postName.value = ""
      }
      this.isShowDialog = "";
    },

    search(param) {
      console.log(param.statusList, "param.statusList");
      this.query.page = 1;
      this.query.search = param.search;
      this.query.user_state = param.statusList[0];
      if(this.$store.getters.isSuper != 1) {
        this.query.express = 1; //未发放 非超级管理员只能查看未发放
      } else {
        this.query.express = param.statusList[1];
      }
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
      if (item.key == "detail") this.handDetail()
      if (item.key == "freeze") this.sure('freeze')
      if (item.key == "unfreeze") this.sure('unfreeze')
      if (item.key == "delete") this.deleteVip(row.user_id) 
      if (item.key == "deliver") this.isShowDialog = "putgoods";
    },

    changePage(param) {
      this.query.limit = param.limit;
      this.query.page = param.page;
      this.getList();
    },

    async exportExcel() {
      // 接口请求数据
      let excelList = []
      let excelQuery = this.query
      excelQuery.page = null
      excelQuery.limit = null
      let res = await getViplist(excelQuery);
      let data = res.data;
      if(res.code == 0 && data) {
        data.forEach((v, i) => {
          v.union_member_freeze == 1 ? v.unfreeze = 1 : v.freeze = 1;
          v.oneExpress? v.deliver = 1 : v.deliver = 0
          v.sort = i + 1;
          v.username = v.union_info.username;
          v.sex = v.union_info.sex;
          v.phone = v.union_info.phone;
          v.address = v.union_info.address;
          v.union_member_freeze_temp = v.union_member_freeze == 1 ? "过期/冻结" : "正常";
          v.gogo_nick = v.member.member_nick
          v.gogo_mobile = v.member.member_mobile
        });
        excelList = data
        let loading = this.$loading({ fullscreen: true })
        import('@/utils/vendor/Export2Excel').then(excel => {
          const tHeader = this.tableConfig.classList.map(v => v.key)
          const filterVal = this.tableConfig.classList.map(v => v.value)
          tHeader.push("购购名称", "购购联系方式")
          filterVal.push("gogo_nick", "gogo_mobile")
          let data = excelList.map(v => filterVal.map(val => v[val] || '' ) )
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'list',
            autoWidth: true
          })
          loading.close()
        })
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.el-form-item.el-form-item--medium {
  margin-bottom: 10px !important;
}

.handel-btn {
  background-color: #409eff;
  color: #fff;
}

.wuliuxiugai {
  color: #ccc; 
  margin-left: 5px; 
  cursor: pointer; 
  text-decoration: underline;
  &:hover {
    color: red
  }
}
</style>

<style scoped>
  .address-style >>> .el-dialog__header {
    display: flex;
    justify-content: center;
    align-content: center;
    background-image: linear-gradient(237deg, #a10404, #e68b4f);
  }

  .address-style >>> .el-dialog__header .el-dialog__title {
    color: #fff !important;
  }
</style>
