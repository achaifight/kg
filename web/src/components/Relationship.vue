<template>
  <div style="margin-left: -60px">
    <div style="float: left; font-weight: bolder; display: block; font-size: large; height: 20px; margin-bottom: 5px; width: 200px">基础属性:</div>
    <div style="float: left; margin-left: 32px; height: 20px; width: 270px">节点类型：关系(Relationship)</div>
    <div style="float: left; margin-left: 60px; margin-top: 5px; height: 20px; display: inline">
      <div style="height: 20px; float: left; display: inline; width: 80px">节点名称：</div>
      <el-input v-model="relationForm.label" size="mini" ></el-input>
    </div>
    <div style="float: left; font-weight: bolder; display: block; font-size: large; height: 20px; margin-bottom: 5px; margin-top: 50px; width: 200px">类型属性:</div>
    <div style="float: left; margin-left: 60px; margin-top: 5px; height: 10px; display: inline;">
      <div style="height: 20px; float: left; display: inline; width: 50px">父类：</div>
      <el-input v-model="relationForm.subPropertyOf" size="mini" :disabled="!editable" style="width: 150px"></el-input>
    </div>
    <div style="float: left; margin-left: 60px; margin-top: 20px; height: 10px; display: inline;">
      <div style="height: 20px; float: left; display: inline; width: 70px">反关系：</div>
      <el-input v-model="relationForm.inverseOf" size="mini" :disabled="!editable" style="width: 130px"></el-input>
    </div>
    <div style="float: left; margin-left: 60px; margin-top: 20px; height: 10px; display: inline;">
      <div style="height: 20px; float: left; display: inline; width: 80px">不相交类：</div>
      <el-input v-model="relationForm.propertyDisjointWith" size="mini" :disabled="!editable" style="width: 120px"></el-input>
    </div>
    <div style="float: left; margin-left: 60px; margin-top: 20px; height: 10px; display: inline;">
      <div style="height: 20px; float: left; display: inline; width: 80px">功能关系：</div>
      <el-select v-model="relationForm.FunctionalProperty" size="mini" style="height: 20px;" transfer="true" :popper-append-to-body="false" :disabled="!editable">
        <el-option
            style=""
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div style="float: left; margin-left: 60px; margin-top: 20px; height: 10px; display: inline;">
      <div style="height: 20px; float: left; display: inline; width: 80px">传递关系：</div>
      <el-select v-model="relationForm.TransitiveProperty" size="mini" style="height: 20px;" transfer="true" :popper-append-to-body="false" :disabled="!editable">
        <el-option
            style=""
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div style="float: left; margin-left: 60px; margin-top: 20px; height: 10px; display: inline;">
      <div style="height: 20px; float: left; display: inline; width: 80px">自反关系：</div>
      <el-select v-model="relationForm.ReflexiveProperty" size="mini" style="height: 20px;" transfer="true" :popper-append-to-body="false" :disabled="!editable">
        <el-option
            style=""
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div style="float: left; margin-left: 60px; margin-top: 20px; height: 10px; display: inline;">
      <div style="height: 20px; float: left; display: inline; width: 80px">对称关系：</div>
      <el-select v-model="relationForm.SymmetricProperty" size="mini" style="height: 20px;" transfer="true" :popper-append-to-body="false" :disabled="!editable">
        <el-option
            style=""
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div style="float: left; margin-left: 60px; margin-top: 20px; height: 20px; display: inline">
      <div style="height: 20px; float: left; display: inline; width: 50px">描述：</div>
      <textarea v-model="relationForm.comment" type="textarea" :rows="10" :disabled="!editable" style="width: 140px; margin-top: 95px; background-color: #FFFFFF"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: "Relationship",
  data(){
    return{
      relationForm: {},
      options:[
        {
          value: 'None',
          label: 'None'
        },
        {
          value: 'True',
          label: 'True'
        },
        {
          value: 'False',
          label: 'False'
        }
      ]
    }
  },
  props: ['editable'],
  watch:{
    editable(newValue, oldValue){
      if(!newValue && oldValue){
        this.$bus.$emit('EditView', this.relationForm)
      }
    }
  },
  mounted() {
    this.$bus.$on("Relationship", (relationForm) => {
      this.relationForm = relationForm
    })
  },
  beforeDestroy() {
    this.$bus.$off("Relationship")
  }
}
</script>

<style scoped>
  .el-form-item{
    margin-bottom: 0;
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