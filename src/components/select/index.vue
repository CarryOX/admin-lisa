<style scoped>
.input{
  width: 100px;
}
</style>
<template>
  <el-form-item :label="obj.titleKey ? obj[obj.titleKey] : obj.title">

      <el-select placeholder="请选择" v-model='obj.value' @change='search' :disabled="obj.disabled"> <!-- multiple  -->
        <el-option v-for="item in obj.list || obj.categories" :key="item.id" :label="item.title || item.name || item.label" :value="item.id"></el-option>
      </el-select>

      <el-alert type='error' show-icon :title='obj.alert' :closable='false' v-if='obj.alert'></el-alert>

  </el-form-item>
</template>

<script>
export default {
  name: 'customSelect',

  props: {
    obj: {
      type: Object
    },
  },

  data() {
    return {
    }
  },
  created(){
    console.log(this.obj,"obj")
  },
  computed: {

  },

  methods: {

    search(v){
      let obj = this.obj;
      console.error('search: ', v);
      obj.alert = typeof obj.value === 'number' || obj.value ? null : `请选择${obj.title}`;

      this.$emit('change', v);
    },

  }

}
</script>


