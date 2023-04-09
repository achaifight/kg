<template>
  <div>
    <el-row class="graphName">
      <span class="characters">GraphName:New Knowledge Graph Create Progress</span>
    </el-row>
    <el-divider></el-divider>
    <el-row class="progress">
      <div v-show="show == 0">
        <el-button type="primary" @click="show = 1">Create a Knowledge Graph with exist CSV files</el-button>
        <el-button type="primary" @click="show = 2">Create a Knowledge Graph with Schema CSV structure</el-button>
        <el-button type="primary" @click="show = 3">Unstructured data import</el-button>
        <el-button type="primary" @click="show = 4">Continuous data acquisition</el-button>
      </div>
      <div>
        <Semistructured v-show="show == 2"></Semistructured>
        <Unstructured v-show="show == 3"></Unstructured>
        <ContinuousData v-show="show == 4"></ContinuousData>
      </div>
    </el-row>
  </div>
</template>

<script>
import Semistructured from "@/components/Semistructured.vue";
import Unstructured from "@/components/Unstructured";
import ContinuousData from "@/components/ContinuousData";

export default {
  name: "TaskBuild",
  components: {Unstructured, Semistructured, ContinuousData},
  data(){
    return{
      show: 0,
    }
  }
}
</script>

<style scoped>
  .graphName{
    text-align: left;
    padding-top: 1vh;
  }
  .characters{
    font-size: 20px;
    font-weight: 600;
  }
  .progress{
    height: 65vh;
    /*text-align: left;*/
  }
  .el-button{
    margin-top: 5vh;
  }
</style>