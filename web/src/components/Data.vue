<template>
  <div style="margin-left: -60px">
    <div style="float: left; font-weight: bolder; display: block; font-size: large; height: 20px; margin-bottom: 5px; width: 200px">基础属性:</div>
    <div style="float: left; margin-left: 60px; margin-top: 20px; height: 20px">节点类型：数据（Data）</div>
    <div style="float: left; margin-left: 60px; margin-top: 20px; height: 20px; display: inline">
      <div style="height: 20px; float: left; display: inline; width: 80px">节点名称：</div>
      <el-input v-model="dataForm.label" size="mini" :disabled="!editable"></el-input>
    </div>
    <div style="float: left; font-weight: bolder; display: block; font-size: large; height: 20px; margin-bottom: 5px; margin-top: 40px; width: 200px">类型属性:</div>
    <div style="float: left; margin-left: 60px; margin-top: 20px; height: 10px; display: inline;">
      <div style="height: 20px; float: left; display: inline; width: 80px">数据类型：</div>
      <el-select v-model="dataForm.dataRange" size="mini" style="height: 20px;" transfer="true" :popper-append-to-body="false" :disabled="!editable">
        <el-option
            style=""
            v-for="item in dataRangeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div style="float: left; margin-left: 60px; margin-top: 30px; height: 20px; display: inline">
      <div style="height: 20px; float: left; display: inline; width: 50px">描述：</div>
      <textarea v-model="dataForm.comment" type="textarea" :rows="10" :disabled="!editable" style="width: 140px; margin-top: 95px; background-color: #FFFFFF"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: "Data",
  data(){
    return{
      dataForm: {},
      dataRangeOptions: [{
          value: 'integer',
          label: 'integer'
        }, {
          value: 'float',
          label: 'float'
        }, {
          value: 'string',
          label: 'string'
        }, {
          value: 'dateTime',
          label: 'date'
        }],
    }
  },
  props: ['editable'],
  watch:{
    editable(newValue, oldValue){
      if(!newValue && oldValue){
        this.$bus.$emit('EditView', this.dataForm)
      }
    }
  },
  mounted() {
    this.$bus.$on("Data", (dataForm) => {
      this.dataForm = dataForm
    })
  },
  beforeDestroy() {
    this.$bus.$off("Data")
  }
}
</script>

<style scoped>
  .el-form-item{
    margin-bottom: 0px;
    padding-left: 10px;
  }
  >>> .el-input{
    width: 120px;
    color: #1D2129;
    border-color: #FFFFFF;
  }
  >>> .el-input__inner {
    color: #1D2129 !important;
    font-weight: bolder !important;
    cursor: pointer;
    background-color: #FFFFFF !important;
  }
  >>> .el-select-dropdown {
    position: absolute !important;
    top: 100px !important;
    left: 0 !important;
  }
</style>