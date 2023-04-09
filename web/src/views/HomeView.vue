<template>
  <div>
    <el-container>
      <el-header style="background: #E5EAF7; height: 60px" ref="init">
        <h1 style="margin-top: 4px; color: #425049; font-size:20px; background: #FFFFFF; margin-left: -0.9%; margin-right: -0.9%">
          <img src="~@/assets/image.png" style="margin-bottom: 0px; margin-left: 10px">
          <h1 style="font-size: 20px; margin-top: -70px; margin-left: 60px">集团企业全要素知识图谱平台</h1>
        </h1>
      </el-header>
      <el-container style="color: #E5EAF7; background: #E5EAF7">
        <el-aside style="background: #E5EAF7; margin-top: 0.3vh; height: calc(99.7vh - 60px); width: 195px;">
          <el-menu style="margin-left: 6px; overflow-y: hidden; overflow-x: hidden; width: 183.17px; text-align: left; height: calc(99vh - 60px)"
            @select="handleSelect"
          >
            <el-submenu index="1" style="left: auto">
              <template slot="title">
                <img src="~@/assets/icon_应用.png">
                <span slot="title" style="margin-left: 12px">首页</span>
              </template>
              <el-menu-item index="1-1" style="background: #F2F3F5">&nbsp&nbsp&nbsp 首页</el-menu-item>
            </el-submenu>
            <el-submenu index="2" style="left: auto">
              <template slot="title">
                <img src="~@/assets/展开备份.png">
                <span slot="title" style="margin-left: 12px">架构管理页面</span>
              </template>
              <el-menu-item index="2-1" style="background: #F2F3F5">&nbsp&nbsp&nbsp 服务管理</el-menu-item>
            </el-submenu>
            <el-submenu index="3" style="left: auto">
              <template slot="title">
                <img src="~@/assets/icon_tab.png">
                <span slot="title" style="margin-left: 12px">概念设计页面</span>
              </template>
              <el-menu-item index="3-1" style="background: #F2F3F5">&nbsp&nbsp&nbsp schema管理</el-menu-item>
            </el-submenu>
            <el-submenu index="4" style="left: auto">
              <template slot="title">
                <img src="~@/assets/icon_任务.png">
                <span slot="title" style="margin-left: 12px">数据导入页面</span>
              </template>
              <el-menu-item index="4-1" style="background: #F2F3F5">&nbsp&nbsp&nbsp 结构化导入</el-menu-item>
              <el-menu-item index="4-2" style="background: #F2F3F5">&nbsp&nbsp&nbsp 半结构化导入</el-menu-item>
              <el-menu-item index="4-5" style="background: #F2F3F5">&nbsp&nbsp&nbsp 半结构化导入2</el-menu-item>
              <el-menu-item index="4-3" style="background: #F2F3F5">&nbsp&nbsp&nbsp 非结构化导入</el-menu-item>
              <el-menu-item index="4-4" style="background: #F2F3F5">&nbsp&nbsp&nbsp 自定义导入</el-menu-item>
              <el-menu-item index="4-6" style="background: #F2F3F5">&nbsp&nbsp&nbsp 数据库导入</el-menu-item>
            </el-submenu>
            <el-submenu index="7" style="left: auto">
              <template slot="title">
                <img src="~@/assets/icon_list.png">
                <span slot="title" style="margin-left: 12px">任务管理页面</span>
              </template>
              <el-menu-item index="7-1" style="background: #F2F3F5">&nbsp&nbsp&nbsp 任务管理</el-menu-item>
            </el-submenu>
            <el-submenu index="5" style="left: auto">
              <template slot="title">
                <img src="~@/assets/icon_提示.png">
                <span slot="title" style="margin-left: 12px">图谱内容管理</span>
              </template>
              <el-menu-item index="5-1" style="background: #F2F3F5" @click="handleGraphJump">&nbsp&nbsp&nbsp 图谱编辑与查看</el-menu-item>
              <!-- <el-menu-item index="5-1" style="background: #F2F3F5">&nbsp&nbsp&nbsp 图谱编辑与查看</el-menu-item> -->
            </el-submenu>
            <el-submenu index="6" style="left: auto">
              <template slot="title">
                <img src="~@/assets/icon_仪表盘.png">
                <span slot="title" style="margin-left: 12px">系统日志管理</span>
              </template>
              <el-menu-item index="6-1" style="background: #F2F3F5">&nbsp&nbsp&nbsp 图谱日志</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main style="background: #FFFFFF; height: calc(99.7vh - 60px); margin-top: 0.3vh; margin-right: 0.4%">
          <HomePage v-show="this.chooseComponents=='1-1'" />
          <StructuredImport ref="StructuredImport" v-show="this.chooseComponents=='4-1'" />
          <Semistructured ref="Semistructured" v-show="this.chooseComponents=='4-2'" />
          <Unstructured ref="Unstructured" v-show="this.chooseComponents=='4-3'" />
          <Customize v-show="this.chooseComponents=='4-4'"/>
          <Diary v-show="this.chooseComponents=='6-1'" />
          <Design v-show= "this.chooseComponents== '3-1'" />
          <FrameWork v-show= "this.chooseComponents== '2-1'" />
          <Semistructured2 ref="Semistructured2" v-show="this.chooseComponents=='4-5'" />
          <Database ref="Database" v-show="this.chooseComponents=='4-6'" />
          <TaskManage v-show="this.chooseComponents=='7-1'"/>
          <!-- <Visual v-show="this.chooseComponents == '5-1'" /> -->
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<script>
  import {linkTest,getSchemaList} from "@/actions/SchemaActions";
  import router from "@/router";
  import Design from "@/components/Design";
  import Visual from "@/components/Visual";
  import TaskBuild from "@/components/TaskBuild";
  import Log from "@/components/Log";
  import Specify from "@/components/Specify";
  import HomePage from "@/components/HomePage";
  import Diary from "@/components/Diary";
  import StructuredImport from "@/components/StructuredImport";
  import Unstructured from "@/components/Unstructured";
  import Semistructured from "@/components/Semistructured.vue";
  import Customize from "@/components/Customize";
  import FrameWork from "./FrameWork.vue";
  import Semistructured2 from "@/components/Semistructured2.vue";
  import Database from "@/components/Database.vue";
  import TaskManage from "@/components/TaskManage.vue";
  export default {
    components: {
      Semistructured2, Semistructured, Database, Customize, TaskManage,
      Unstructured, StructuredImport, HomePage, Specify, TaskBuild, Design, Visual, Log, Diary, FrameWork},
    data() {
      return{
        chooseComponents: this.$route.params.chooseComponents?this.$route.params.chooseComponents:'1-1',
      }
    },
    provide(){
      return{
        jumpImport: this.jumpImport,
      }
    },
    methods: {
      jumpImport(type, schemaName, url, day, time, table, tableList){
        this.chooseComponents = type
        switch (type){
          case '4-1':
            this.$refs.StructuredImport.create = true;
            this.$refs.StructuredImport.file.schemaName = schemaName;
            this.$refs.StructuredImport.file.zip = url;
            break
          case '4-2':
            this.$refs.Semistructured.create = true;
            this.$refs.Semistructured.file.schemaName = schemaName;
            this.$refs.Semistructured.file.zip = url;
            break
          case '4-5':
            this.$refs.StructuredImport.file.schemaName = schemaName;
            this.$refs.StructuredImport.file.zip = url;
            break
          case '4-3':
            this.$refs.StructuredImport.file.name = url;
            break
          case '4-6':
            this.$refs.Database.create = true;
            this.$refs.Database.database.url = url;
            this.$refs.Database.database.day = day;
            this.$refs.Database.database.time = time;
            this.$refs.Database.database.table = table;
            this.$refs.Database.database.schemaName = schemaName;
            this.$refs.Database.databaseTableList = tableList;
            break
        }
      },
      handleSelect(key) {
        this.chooseComponents = key

      },
      handleGraphJump(){
        this.$router.push({
        name:'KnowledgeGraph',
      })
      }
    }
  }
</script>

<style>
  .el-container{
    padding: 0px;
    margin: 0px;
    height: 100%;
  }
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: left;
    line-height: 60px;
    height: 10vh;
    /*min-height: 5vh;*/
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    /*line-height: 160px;*/
    transition: all 1s;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
    transition: all 1s;
  }
  .el-menu-vertical-demo{
    width: 18vw;
    height: 90vh;
    text-align: left;
  }
  .el-icon-s-operation{
    font-size:30px;
    padding-top: 15px
  }
  .el-icon-s-operation:hover{
    color: #5cb6ff;
  }
  .el-submenu .el-menu-item {
    height: 50px;
    line-height: 50px;
    padding: 0 45px;
    max-width: 16vw !important;
    min-width: 15vw !important;
  }
  .el-menu--collapse{
    width: 64px !important;
  }

</style>
