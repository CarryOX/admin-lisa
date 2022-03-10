<style scoped>
.input{
  width: 100px;
}
</style>
<template>
  <el-form-item :label="obj.title || obj.name || obj.label" :label-width="obj.width || obj.labelWidth">

    <el-checkbox-group v-model="obj.value" :disabled="obj.disabled" @change='multiSelect' v-if="obj.type == MULTI">

      <el-checkbox v-for="(item, index) in obj.list"
                   :disabled="item.disabled"
                   :label="value ? item[value] : item.id || item.value"
                   :key="index">{{key ? item[key] : item.name || item.title}}</el-checkbox>

    </el-checkbox-group>
    <el-radio-group v-model="obj.value" :disabled="obj.disabled" @change='select' v-else>

      <el-radio v-for='(item, index) in obj.list' 
                :label='value ? item[value] : item.id || item.value' 
                :key='index'>{{key ? item[key] : item.name || item.title}}</el-radio>

    </el-radio-group>

    <el-alert :title='obj.alert' :closable='false' type='error' show-icon v-if='obj.alert'></el-alert>

  </el-form-item>
</template>

<script>
export default {
  name: 'customRadio',

  props: {
    obj: {
      type: Object
    },
  },

  data() {
    return {
      MULTI: 'multi',
    }
  },

  computed: {
    key(){ return this.obj.titleKey || null; },
    value(){ return this.obj.valueKey || null; },
  },

  methods: {
    select(v){
      let obj = this.obj;
      obj.alert = typeof obj.value === 'number' ? null : `请选择${obj.title}`;

      this.$emit('change', v);
    },

    multiSelect(v, e){
      let obj = this.obj;

      obj.alert = obj.value.length ? null : `请选择${obj.title}`;

      this.$emit('change', v);
    },
  }
}
</script>


