<template>
    <div class="wrap">

      <!-- 添加class='form'属性会不显示 -->
      <el-form :inline="true">

        <el-form-item v-if='config.title'>
          <el-button type="primary" icon="el-icon-edit-outline" @click="showForm">{{config.title}}</el-button>
        </el-form-item>

        <el-form-item v-if='config.showKeywordSearch || config.placeHolder'>
            <el-input :style="{ width: config.width || '300px' }" :placeholder="config.placeHolder" v-model="keyword" clearable>
                <el-button slot="append" icon="el-icon-search" type="primary" @click="search">{{ config.showKeywordSearchText || '查询' }}</el-button>
            </el-input>
<!--            <el-button type="primary" :icon="config.showKeywordSearchText ? '' : 'el-icon-search'" @click="search">{{ config.showKeywordSearchText || '查询' }}</el-button>-->
        </el-form-item>

        <el-form-item :label="config.dateWidthTitle?config.dateWidthTitle:'日期查询'" v-if='config.dateWidth' class="data-deep-style">
            <el-date-picker :style="{ width: config.dateWidth }" value-format="timestamp" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="date" @change="search">
            </el-date-picker>
<!--            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>-->
        </el-form-item>
        <el-form-item label="月份查询" v-if='config.mathWidth'>
            <el-date-picker :style="{ width: config.mathWidth }" value-format="timestamp" type="monthrange" range-separator="——" start-placeholder="开始月份" end-placeholder="结束月份" v-model="math">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>

        <el-form-item :label="config.selectLabel" :label-width="config.selectWidth" v-if='config.categories'>
          <el-select placeholder="请选择" v-model='config.status || status' @change='search'> <!-- multiple  -->
            <el-option v-for="item in config.categories" :key="item.id" :label="item.title || item.name || item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="config.selectLabelList && config.selectLabelList[selectIndex]"
                      :label-width="config.selectWidth"
                      v-for='(select, selectIndex) in config.selectList' :key='selectIndex' v-if='config.selectList'>
          <el-select placeholder="请选择"  v-model='statusList[selectIndex]' @change='search($event, selectIndex)'> <!-- multiple  -->
            <el-option v-for="item in select" :disabled="item.disabled" :key="item.id" :label="item.title || item.name || item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="" v-if='config.showExport'>
          <el-button  type="primary" icon="document" @click="exportFile">导出</el-button>
        </el-form-item>

        <!-- btnList -->
        <el-form-item label="" v-if='config.btnList'>
          <el-button class='btn_wrap' type="primary" :disabled="item.disabled" @click="emit(index, $event)" v-for='(item, index) in config.btnList' :key='index'>{{item.titleKey ? item[item.titleKey] : item.title}}</el-button>
        </el-form-item>

        <!-- switch -->
        <el-form-item label="" v-if="'switchList' in config">
          <el-switch v-model="item.value"
             v-for="(item, index) in config.switchList" :key="index"
             :disabled="item.disabled"
             :active-text="item.title || item.activeText || '开关'"
             :active-color="item.color || item.activeColor || '#13ce66'" :inactive-color="item.inactiveColor || '#C0CCDA'" @change="change('switch', index, $event)"></el-switch>
        </el-form-item>

        <el-form-item v-if="'otherData' in config" style="margin-left: 20px;">
          <span v-for="item in config.otherData" style="margin-left: 20px;">
            {{item.key}}: {{item.value}}
          </span>
        </el-form-item>

      </el-form>
    </div>

</template>

<script>
export default {
  name: 'customHead',
  props: {
    config: {
      type: Object,
      default: function() {
        return {
          inputWidth: '340px',
          dateWidth: '400px',
          placeholder: '请输入联系方式',
          selectLabel: '订单状态',
        }
      }
    },

  },

  data() {
    return {
      keyword: '',
      date: '',
      math:'',
      status: '',
      statusList: [],
      param: {
        statusList: [],
      },
    }
  },

  watch: {
  },

  mounted(){
    console.log(this.config,"config")
    let selectList = this.config.selectList;
    // console.error(JSON.stringify(this.config.selectList));
    // init statusList
    if(selectList) this.statusList = selectList.map(v => v[0].id);
    if(selectList && this.config.selectDefault) {
      this.statusList = this.config.selectDefault
    }
  },

  methods: {
    showForm(){
      this.$emit('add');
    },

    emit(index, e){
      console.log(index,e)
      this.$emit('emit', index);
    },

    search(index, selectIndex){
      // console.log(index,selectIndex)
      let param = this.param,
          date = this.date,
          math = this.math;

      param.search = this.keyword;

      // date search
      param.date = this.date
      ? { startDate: new Date(this.date[0]).toLocaleDateString(), endDate: new Date(this.date[1]+86400000).toLocaleDateString(), }
      : null;
      param.math = this.math
      ? { startDate: new Date(this.math[0]).toLocaleDateString(), endDate: new Date(this.math[1]+86400000).toLocaleDateString(), }
      : null;

      // single status search
      if(typeof index === 'number' && typeof selectIndex !== 'number'){
        param.status = index;
      }else{
        param.status = null;
      }

      if(typeof selectIndex === 'number'){
        param.statusList[selectIndex] = index;
      }

      this.$emit('search', param);
    },

    change(type, index, e){
      this.$emit('change', type, index, e);
    },

    async exportFile() {
      // let loading = this.$loading({ fullscreen: true })
      // this.$emit('export', loading);
      this.$emit('export');

        // import('@/vendor/Export2Excel').then(excel => {
        //   const tHeader = this.classList.map(v => v.key)
        //   const filterVal = this.classList.map(v => v.value)

        //   let data = this.tableData.map(v => filterVal.map(val => v[val] || '' ) )

        //   excel.export_json_to_excel({
        //     header: tHeader,
        //     data,
        //     filename: 'list',
        //     autoWidth: true
        //   })
        //   loading.close()
        // })
    },
  },

}
</script>

<style scoped>
.wrap {
  margin: 0 15px;
}
.btn_wrap{
  margin-right: 20px;
}
.el-form-item{
  margin: 20px 15px 30px;
}
.custom-theme .el-form-item{
  margin: 0
}
.data-deep-style >>> .el-date-editor .el-range-separator {
    width: 50px;
}
.data-deep-style >>> .el-date-editor .el-range__close-icon {
    font-size: 20px;
}
>>> .el-input .el-icon-circle-close {
    font-size: 20px;
}
>>> .el-input .el-button--medium:hover {
    background-color: #f1f2f3;
}
</style>
