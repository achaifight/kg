<template>
  <el-row>
    <el-col :span="6" v-for="(schemaCard, index) in schemaList" :key="schemaCard.name">
      <el-card :body-style="{ padding: '0px'}" shadow="always">
        <div style="padding: 12px;">
          <div class="schemaCard">
            <el-button-group>
              <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(schemaCard)"></el-button>
              <el-button type="primary" icon="el-icon-close" size="small" @click="handleDeleteBegin(schemaCard)">
              </el-button>
            </el-button-group>
            <div style="padding-top: 20px;"><span>{{ schemaCard.name }}</span><br></br></div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Card",
  data(){
    return{
      // schemaList: [{name: "1"},{name: "2"},{name: "3"},{name: "4"},{name: "5"},{name: "6"},{name: "7"},{name: "8"},
      //   {name: "9"},{name: "10"}],
      // schemaList: [{name: "localhost"},{name: "yue"},{name: "dao"},{name: "xuan"},{name: "yue2"}],
      schemaList: [{name: "qiye"},{name: "shequ"},{name: "sanguo"}],
    }
  },
  props:['type'],
  methods:{
    handleEdit(schemaCard){
      switch (this.type){
        case "sql":
          this.$bus.$emit('sqlEdit', schemaCard.name);
          break;
        case "structured":
          this.$bus.$emit('structuredEdit', schemaCard.name);
          break;
      }

    },
    handleDeleteBegin(SchemaCard) {
      this.dialogDeleteVisible = true,
          this.deleteForm = { name: SchemaCard.name, filePath: SchemaCard.info }
    },
  }
}
</script>

<style scoped>
.el-col {
  padding-top: 10px;
  padding-left: 20px;
}
.schemaCard{
  text-align: center;
  line-height: 3;
}
</style>