<style lang="css">
.el-input {
  width: 20%;
}
</style>

<template>
    <div>
        <el-dialog
            :title="isAddItem?'新增管理员':'编辑管理员'"
            :visible.sync="addNewShow"
            width="80%"
        >
            <el-form :model="formForNotive" ref="ruleForm" :rules="rules">
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="username">
                    <el-input v-model="formForNotive.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="账号" :label-width="formLabelWidth" prop="account" style="margin-top:20px">
                    <el-input v-model="formForNotive.account"
                              :disabled="!isAddItem" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth" prop="password" style="margin-top:20px">
                    <el-input v-model="formForNotive.password" auto-complete="off" style="width:250px"
                              :placeholder="(!isAddItem)&&'编辑权限需填写密码（或修改密码）'"></el-input>
                </el-form-item>

                <el-form-item label="权限" v-if="!isAddItem" :label-width="formLabelWidth">
                    <div v-for="(firstItem, firstIndex) of routeList" :key="firstIndex">
                        <div>{{ firstItem.meta.desc }}</div>

                        <el-checkbox-group v-model="role"
                                           :disabled="Boolean(formForNotive.super)">
                            <el-checkbox v-for="(secondItem, secondIndex) of firstItem.children"
                                         :label="secondItem.meta.roles" :key="secondIndex">{{ secondItem.meta.desc }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addNewShow=false">取消</el-button>
                <el-button v-if="isAddItem" type="primary" @click="addAuth('ruleForm')" :disabled="waitAddNotice" :loading="waitAddNotice">确 定</el-button>
                <el-button v-else type="primary" @click="editAuth('ruleForm')" :disabled="waitAddNotice" :loading="waitAddNotice">确认修改</el-button>
            </span>
        </el-dialog>
        <el-container class="notice">
            <el-header class="header">
                <el-form :inline="true" :model="formInline" class="form">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">新增管理员</el-button>
                    </el-form-item>
                </el-form>
            </el-header>
            <el-main>
                <el-table
                    :data="tableData"
                    stripe
                    v-loading="listLoading" element-loading-text="给我一点时间"
                    style="width: 100%">
                    <el-table-column
                        label="姓名"
                        prop="username"
                    >
                    </el-table-column>
                    <el-table-column
                        label="账号"
                        prop="account"
                    >
                    </el-table-column>
                    <el-table-column
                        label="超级管理员"
                        prop="super"
                    >
                        <template slot-scope="scope">
                            <el-tag size="medium" :type="scope.row.super=='1'?'':'info'">
                                {{ scope.row.super == '1' ? '是' : '否' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        min-width='200px'
                    >
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="primary"
                                @click="editItem(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                @click="deleteItem(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer>
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                               layout="total, sizes, prev, pager, next" :total="total">
                </el-pagination>
            </el-footer>
        </el-container>
    </div>
</template>
<script>
// getList 接口 获取
// addNotice 接口 添加

import {
  getAuthList_api,
  deleteAuth_api,
  addAuth_api,
  editAuth_api
} from "@/api/user";
// import { getSellerAuth } from "@/api/login";
import { routeList } from "@/router";
import { getRoles, setRoles } from "@/utils/auth";

const formForNotive = {
  //此页面 静态数据
  username: "",
  account: "",
  password: "",
  checkboxGroup1: []
};
export default {
  created() {
    let rules = getRoles();
    this.getList();
  },

  data() {
    return {
      role: [],
      //状态层
      waitAddNotice: false,
      addNewShow: false,
      isAddItem: true,
      rolesList: [
        { label: "commodityManagement", text: "商品管理" },
        { label: "orderManagement", text: "订单管理" },
        { label: "memberList", text: "人员列表" },
        { label: "authorityManagement", text: "权限管理" },
        { label: "infoManagement", text: "运营" }
      ],
      formLabelWidth: "140px", //弹框1 左侧文字默认宽度
      formForNotive: Object.assign({}, formForNotive),
      rules: {
        username: [
          { required: true, message: "请输入昵称", trigger: "blur", min: 1 }
        ],
        account: [
          {
            required: true,
            message: "请输入账号，长度至少5位",
            trigger: "blur",
            min: 5
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码，长度至少6位",
            trigger: "blur",
            min: 6
          }
        ]
      },
      //body

      tableData: [{}],
      //header
      industry: "",
      industryList: [
        {
          value: "edu",
          label: "教育"
        },
        {
          value: "others",
          label: "其他"
        }
      ],
      formInline: {},
      // body
      listLoading: false,

      // footer
      listQuery: {
        page: 1,
        limit: 20
      },
      total: 1
    };
  },

  computed: {
    routeList() {
      return routeList;
    },
    baseAuth() {
      return this.routeList.map(route => route.meta.roles);
    },
    allAuth() {
      let arr = [],
        routeList = this.routeList;

      for (var i = routeList.length - 1; i >= 0; i--) {
        var item = routeList[i];

        if (item.children)
          item.children.forEach(
            v => (v.meta && v.meta.roles ? arr.push(v.meta.roles) : null)
          );

        if (item.meta && item.meta.roles) arr.push(item.meta.roles);
      }

      return arr;
    }
  },

  methods: {
    // out
    async addAuth(formName) {
      let res = await new Promise((res, rej) => {
        this.$refs[formName].validate(valid => {
          if (valid) {
            res(true);
          } else {
            res(false);
          }
        });
      });
      if (!res) {
        return;
      }
      this.waitAddNotice = true;
      let sendData = {
        admin_name: this.formForNotive.username,
        admin_account: this.formForNotive.account,
        admin_password: this.formForNotive.password,
        admin_auth: []
      };
      addAuth_api(sendData)
        .then(data => {
          this.waitAddNotice = false;
          this.addNewShow = false;
          if (data.code === 0) {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success"
            });
            this.getList();
          } else {
            this.$notify({
              title: "失败",
              message: "操作失败",
              type: "error"
            });
          }
        })
        .catch(e => {
          this.waitAddNotice = false;
          this.addNewShow = false;
          console.error("appointmentShop:addIndustry_api 接口错误");
        });
    },
    addItem() {
      //显示 弹框
      // this.editLoading = false
      this.isAddItem = true;
      this.addNewShow = true;
      this.formForNotive = Object.assign({}, formForNotive);
    },
    async editAuth(formName) {
      // console.log('role', this.role)
      let res = await new Promise((res, rej) => {
        this.$refs[formName].validate(valid => {
          valid ? res(true) : res(false);
        });
      });

      if (!res) return;
      let authList = this.role;
      // this.baseAuth.forEach(v => authList.indexOf(v) === -1 ? authList.push(v) : null);

      this.waitAddNotice = true;
      let sendData = {
        // 前段统一
        admin_name: this.formForNotive.username,
        // admin_account: this.formForNotive.account,
        admin_password: this.formForNotive.password,
        admin_auth: authList
      };
      if (this.formForNotive.password.trim() !== "") {
        sendData.admin_password = this.formForNotive.password;
      }
      console.log("sendData", sendData);
      editAuth_api(sendData, this.formForNotive.id)
        .then(data => {
          this.waitAddNotice = false;
          this.addNewShow = false;
          if (data.code === 0) {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success"
            });
            this.getList();
          } else {
            this.$notify({ title: "失败", message: data.error, type: "error" });
          }
        })
        .catch(e => {
          this.waitAddNotice = false;
          this.addNewShow = false;
          console.error("editAuth_api 接口错误");
        });
    },
    editItem(index, rowData) {
      this.rules.password[0].required = false;
      this.role = rowData.admin_auth;
      // this.editLoading = true
      rowData.password = "";
      this.formForNotive = Object.assign({}, rowData);
      console.log("rowData", rowData);
      this.isAddItem = false;
      this.addNewShow = true;
    },
    // body
    getList() {
      let allAuth = this.allAuth;

      //获取列表
      this.listLoading = true;
      let sendData = Object.assign({}, this.listQuery);

      getAuthList_api(sendData).then(response => {
        if (response && response.code == 0) {
          let result = response.data;
          let tempTableData = [];
          result.forEach(aData => {
            tempTableData.push({
              //后端生成
              id: aData.admin_id,
              //前后统一
              username: aData.admin_name,
              password: aData.admin_password,
              account: aData.admin_account,
              // admin_auth: aData.admin_is_super ? allAuth : aData.admin_auth.filter(v => allAuth.indexOf(v) !== -1),
              admin_auth: aData.admin_is_super ? allAuth : aData.admin_auth,
              //超级管理员标识
              super: aData.admin_is_super
            });
          });
          this.tableData = tempTableData;
          this.total = response.pagination.total
            ? response.pagination.total
            : 1;
        }
        this.listLoading = false;
      });
    },
    deleteItem(index, row) {
      let id = row.id;
      this.$confirm(`此操作将删除该条目, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteNewNotice(id);
        })
        .catch(() => {
          this.$notify.info({
            title: "消息",
            message: "已取消"
          });
        });
    },
    deleteNewNotice(id) {
      let sendData = {
        admin_id: id
      };

      deleteAuth_api(sendData)
        .then(res => {
          if (res && res.code === 0) {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success"
            });
            this.getList();
          } else {
            this.$notify({
              title: "错误",
              message: "操作失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          console.error("deleteseller_api");
        });
    },
    searchByDate() {
      if (
        !this.dataRange ||
        !this.dataRange.length ||
        this.dataRange.length !== 2
      ) {
        return console.log("日期错误");
      }
      let dateS = this.dataRange[0];
      let dateE = this.dataRange[1];
      let Sstr =
        dateS.getFullYear() +
        "-" +
        (dateS.getMonth() + 1 > 9
          ? dateS.getMonth() + 1
          : "0" + dateS.getMonth()) +
        "-" +
        (dateS.getDate() + 1 > 9 ? dateS.getDate() + 1 : "0" + dateS.getDate());
      let Estr =
        dateE.getFullYear() +
        "-" +
        (dateE.getMonth() + 1 > 9
          ? dateE.getMonth() + 1
          : "0" + dateE.getMonth()) +
        "-" +
        (dateE.getDate() + 1 > 9 ? dateE.getDate() + 1 : "0" + dateE.getDate());
      this.listQuery.time = Sstr + "," + Estr;
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    }
  }
};
</script>
