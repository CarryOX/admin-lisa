<style scoped>
.input{
  width: 100px;
}
</style>
<template>
  <el-form-item :label="obj.title || obj.name || obj.label" :label-width="obj.width || obj.labelWidth">

      <el-select :placeholder="obj.placeholder || PLACEHOLDER" :filterable='obj.search' :multiple="obj.type == MULTI" :disabled="obj.disabled" v-model='obj.value' @change='search' @visible-change="show">

        <el-option v-for="item in obj.list"
                   :label="key ? item[key] : item.title || item.name || item.label"
                   :key="value ? item[value] : item.id" :value="value ? item[value] : ('id' in item ? item.id : item.value)"></el-option>

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
      PLACEHOLDER: '请选择',
      MULTI: 'multi',
    }
  },

  computed: {
    key(){ return this.obj.titleKey || null; },
    value(){ return this.obj.valueKey || null; },
  },

  methods: {

    search(v){
      let obj = this.obj;
      // console.error('search: ', v, obj.value);

      obj.alert = typeof obj.value === 'number' || obj.value ? null : `请选择${obj.title}`;

      this.$emit('change', v);
    },

    show(v){
      this.$emit(v ? 'show' : 'hide');
    }

  }

}
</script>
