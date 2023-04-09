<template>
  <div>
    <div v-if="!this.create">
      <div style="color: #1D74F1; font-weight: bold; text-align: left; font-size: 14px; margin-left: 16px">系统任务管理</div>
      <div style="color: #1D2129; font-weight: bold; text-align: left; font-size: 18px; margin-left: 16px">任务管理</div>
      <div style="margin-top: 4px; display: block; overflow: hidden">
        <div style="float: left; display: inline; margin-left: 16px">
          <el-button type="primary" @click="createTask">创建任务</el-button>
        </div>
        <div style="float: right; margin-right: 16px; display: inline">
          <el-button type="success" @click="getTask">刷新</el-button>
        </div>
      </div>
      <el-table
          :data="tableData.slice((data.pageNum - 1) * data.pageSize, data.pageNum * data.pageSize)"
          :header-cell-style='{"text-align": "center", "background-color": "#E7E7E7", "color": "#1D2129", "font-size": "14px", "font-weight": "bold"}'
          :cell-style= '{"text-align": "center", "color": "#1D2129", "font-size": "14px", "font-weight": "bold"}'
          class="testbox"
      >
        <el-table-column
            fixed
            prop="task_id"
            :width="flexColumnWidth('task_id',tableData)"
            label="任务ID">
        </el-table-column>
        <el-table-column
            :width="flexColumnWidth('task_target',tableData)"
            prop="task_target"
            label="任务目标">
        </el-table-column>
        <el-table-column
            :width="flexColumnWidth('executor',tableData)"
            prop="executor"
            label="执行人">
        </el-table-column>
        <el-table-column
            :width="flexColumnWidth('task_status',tableData)"
            prop="task_status"
            label="任务状态">
        </el-table-column>
        <el-table-column
            :width="flexColumnWidth('task_results',tableData)"
            prop="task_results"
            label="任务结果">
        </el-table-column>
        <el-table-column
            :width="flexColumnWidth('task_step',tableData)"
            prop="task_step"
            label="任务流程">
        </el-table-column>
        <el-table-column
            :width="flexColumnWidth('start_time',tableData)"
            prop="start_time"
            label="开始时间">
        </el-table-column>
        <el-table-column
            :width="flexColumnWidth('run_time',tableData)"
            label="执行时间">
          <template slot-scope="scope">
            {{ run_time(scope.row.start_time) }}
          </template>
        </el-table-column>
        <el-table-column
            :width="200"
            fixed="right"
            prop="operation"
            label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="14px" style="color: #1C74F1; font-weight: bold">日志</el-button>
            <!--          <el-button type="text" size="14px" style="color: #58bd3f; font-weight: bold">暂停</el-button>-->
            <el-button @click="stop(scope.row)" type="text" size="14px" style="color: #8d7d7d; font-weight: bold">终止</el-button>
            <el-button @click="start(scope.row)" type="text" size="14px" style="color: #F53F3F; font-weight: bold">启动</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="data.pageNum" :page-size="data.pageSize" layout="prev, pager, next, jumper" :total="tableData.length">
      </el-pagination>
    </div>
    <div v-if="this.create">
      <div style="color: #1D74F1; font-weight: bold; text-align: left; font-size: 14px; margin-left: 16px">图谱构建管理</div>
      <div style="margin-top: 4px; color: #1D2129; font-weight: bold; text-align: left; font-size: 18px; margin-left: 16px; display: inline; float: left">数据库导入</div>
      <el-steps :active=this.steps align-center style="margin-top: 60px">
        <el-step title="选择schema" icon="el-icon-my-export"></el-step>
        <el-step title="上传数据" :icon=this.icon2></el-step>
        <el-step title="选择规则" :icon=this.icon3></el-step>
        <el-step title="后续" :icon=this.icon4></el-step>
      </el-steps>
      <div v-show="this.steps === 1">
        <div style="margin-top: 40px">
          <div style="display: inline; font-weight: bold">选择OWL文件:&nbsp&nbsp&nbsp</div>
          <el-select
              style="font-weight: bold; font-size: 14px; width: 280px; height: 32px"
              placeholder="请选择" v-model="schemaName"
          >
            <el-option
                v-for="item in schemaList"
                :key="item.name"
                :label="name(item.name)"
                :value="item.name">
            </el-option>
          </el-select>
        </div>
      </div>
      <div v-show="this.steps === 2">
        <div style="margin-top: 40px">
          <div style="display: inline; font-weight: bold">选择数据类型:&nbsp&nbsp&nbsp</div>
          <el-select
              style="font-weight: bold; font-size: 14px; width: 280px; height: 32px"
              placeholder="请选择" v-model="taskType"
          >
            <el-option
                v-for="item in taskTypeList"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </div>
        <div v-show="this.taskType === '结构化数据导入' || this.taskType === '半结构化数据导入1' || this.taskType === '半结构化数据导入2' || this.taskType === '非结构化数据导入'">
          <div style="margin-top: 60px; margin-left: 30px">
            <div style="display: inline; font-weight: bold">上传数据:&nbsp&nbsp&nbsp&nbsp</div>
            <el-input
                :disabled="true"
                style="font-weight: bold; font-size: 14px; width: 280px; height: 32px; background: white; color:white;"
                :placeholder=file.zip
            >
              <el-upload action="#" slot="append" :multiple="false" :limit="1" :show-file-list = "false" accept=".zip"
                         :auto-upload="false" :on-change="handleChange" :on-exceed="handleExceed" style="">
                　　<el-button slot="trigger" icon = "el-icon-folder-add" size="small" style="">选取文件</el-button>
              </el-upload>
            </el-input>
            <el-button type="text" style="margin-left: 20px; width: 40px" @click="downloadJsonSample">下载示例文件</el-button>
          </div>
        </div>
        <div v-show="this.taskType === '实时数据导入'">
          <div style="margin-top: 20px; margin-left: 30px">
            <div style="display: inline; font-weight: bold">输入链接:&nbsp&nbsp&nbsp&nbsp</div>
            <el-input
                v-model="database.url"
                style="font-weight: bold; font-size: 14px; width: 280px; height: 32px"
                placeholder="请输入"
                clearable=True
                rows="20"
            >
            </el-input>
            <el-button type="text" style="margin-left: 20px; width: 40px" @click="this.testDatabaseConnect">测试链接</el-button>
          </div>
          <div style="margin-top: 40px; margin-left: 30px">
            <div style="display: inline; font-weight: bold">选择数据库:&nbsp&nbsp&nbsp&nbsp</div>
            <el-select
                style="font-weight: bold; font-size: 14px; width: 280px; height: 32px"
                placeholder="请选择" v-model="database.table"
            >
              <el-option
                  v-for="item in databaseTableList"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </div>
          <div style="margin-top: 10px; margin-left: 30px; text-align: center">
            <div style="display: inline; font-weight: bold">设定间隔时间:&nbsp&nbsp&nbsp&nbsp</div>
            <el-input
                v-model="database.day"
                style="font-weight: bold; font-size: 14px; width: 90px; height: 32px"
                placeholder="请输入"
                clearable=True
                rows="3"
            >
            </el-input>
            天
            <el-time-picker
                style="width: 200px"
                v-model="database.time"
                placeholder="选择时间">
            </el-time-picker>
          </div>
        </div>
      </div>
      <div v-show="this.steps === 3">
        <div style="margin-top: 20px">
          <div style="display: inline; font-weight: bold">选择规则名称:&nbsp&nbsp&nbsp</div>
          <el-select
              style="font-weight: bold; font-size: 14px; width: 280px; height: 32px"
              placeholder="请选择" v-model="ruleName"
          >
            <el-option
                v-for="item in ruleList"
                :key="item.name"
                :label="item.name"
                :value="item.name">
            </el-option>
          </el-select>
          <div>
            <el-button type="text" @click="jumpTemplate" style="margin-top: 30px">
              没有找到合适的模板？点击创建
            </el-button>
          </div>
        </div>
      </div>
      <div v-show="this.steps === 4">
        后续流程尚在开发 点击Next返回任务列表
      </div>
      <div style="margin-top: 60px">
        <el-button @click="backSteps" plain style="color: white; background: #1C74F1; font-weight: bold; margin-right: 33%">Back</el-button>
        <el-button @click="nextSteps" plain style="color: white; background: #1C74F1; font-weight: bold">Next</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import "v-fit-columns";
import {createCsvTask, createDatabaseTask, getTaskList, startTask, stopTask} from "@/actions/TaskProjectAction";
import {getDatabaseRuleList, testConnectURL} from "@/actions/DataBaseProjectAction";
import {getSchemaList} from "@/actions/SchemaActions";
import {downloadJsonSample} from "@/actions/UserInteractionProjectAction";
import {getRuleList} from "@/actions/CsvProjectAction";
import {createJsonTask, getJsonRuleList} from "@/actions/JsonProjectAction";

export default {
  name: "TaskManage",
  inject:['jumpImport'],
  data(){
    return{
      icon2: "",
      icon3: "",
      icon4: "",
      steps: 1,
      schemaList: [],
      ruleName: "",
      ruleList: [],
      databaseTableList: [],
      schemaName: '',
      database:{
        url: '',
        day: '',
        table: '',
        time: null,
      },
      file:{
        zip: '',
        raw: null,
      },
      taskType: "",
      taskTypeList: ["结构化数据导入", "半结构化数据导入1", "半结构化数据导入2", "非结构化数据导入", "实时数据导入"],
      chooseType: false,
      create: false,
      options: [],
      value: '',
      tableData: [],
      data: {
        pageNum: 1,
        pageSize: 10,
      },
    }
  },
  created: function () {
    setInterval(this.timer, 1)
  },
  methods:{
    sGetCharCount(SubChar, StrTemp) {
      let count, i;
      count = 0;
      for (i = 0; i < StrTemp.length; i++) {
        if (StrTemp.substr(i, 1) === SubChar) {
          count = count + 1;
        }
      }
      return count;
    },
    name(n){
      if (n === '0'){
        return "元模型";
      }
      else {
        if (this.sGetCharCount('_', n) <2)
          return "概念版本" + n;
        else {
          let names = n.split('_');
          return "概念模型" + names[1] + "_" + names[2] + "_" + names[0]
        }
      }
    },
    jumpTemplate(){
      switch (this.taskType){
        case "结构化数据导入":
          this.jumpImport('4-1', this.schemaName, this.file.zip)
          break
        case "半结构化数据导入1":
          this.jumpImport('4-2', this.schemaName, this.file.zip)
          break
        case "半结构化数据导入2":
          this.jumpImport('4-5', this.schemaName, this.file.zip)
          break
        case "非结构化数据导入":
          this.jumpImport('4-3', "", this.file.zip)
          break
        case "实时数据导入":
          this.jumpImport('4-6', this.schemaName, this.database.url, this.database.day, this.database.time, this.database.table, this.databaseTableList);
          break
      }
    },
    downloadJsonSample(){
      let sample = 0
      switch (this.taskType){
        case "结构化数据导入":
          sample = 1;
          break
        case "半结构化数据导入1":
          sample = 2;
          break
        case "半结构化数据导入2":
          sample = 3;
          break
        case "非结构化数据导入":
          sample = 4;
          break
      }
      downloadJsonSample(sample);
    },
    handleChange(file, fileList){
      let isZip = file.name.split('.')[1] === 'zip'
      if (!isZip) {
        this.$message.error({
          message: '只能上传.zip文件'
        });
        return false;
      }
      this.file.raw = file.raw;
      this.file.zip = file.name.split('.')[0];
    },
    handleExceed(files, fileList){
      this.handleChange(files[0], fileList)
    },
    nextSteps(){
      switch (this.steps){
        case 1:
          if (this.schemaName === "") {
            this.$message.error({
              message: '未选择schema'
            });
            return;
          }
          this.steps = 2;
          this.icon2 = "el-icon-my-export";
          break
        case 2:
          if (this.taskType === "实时数据导入") {
            if (this.database.table === '' || this.database.time == null || this.database.day === ''){
              this.$message.error({
                message: '数据填写不完全'
              });
              return;
            }
          }
          else if (this.file.zip === ''){
            this.$message.error({
              message: '数据填写不完全'
            });
            return;
          }
          this.steps = 3;
          this.icon3 = "el-icon-my-export";
          this.getRuleList()
          break
        case 3:
          switch (this.taskType){
            case "结构化数据导入":
              var res = createCsvTask(this.file.raw, this.file.zip, this.schemaName, this.ruleName, "暂未开发");
            case "半结构化数据导入1":
              var res = createJsonTask(this.file.raw, this.file.zip, this.schemaName, this.ruleName, "暂未开发", 1);
              break
            case "半结构化数据导入2":
              var res = createJsonTask(this.file.raw, this.file.zip, this.schemaName, this.ruleName, "暂未开发", 2);
              break
            case "非结构化数据导入":

              break
            case "实时数据导入":
              var res = createDatabaseTask(this.database.url, this.database.table, this.schemaName, this.ruleName, this.database.day, this.database.time, "暂未开发");
              break
          }
          res.then(result => {
            if(result.message === "save success!"){
              this.steps = 4;
              this.icon4 = "el-icon-my-export";
            }
            else {
              this.$message.error({
                message: '创建失败'
              });
            }
          })
          break
        case 4:
          Object.assign(this.$data, this.$options.data.call(this))
          this.getTask()
          break
      }
    },
    backSteps(){
      switch (this.steps) {
        case 1:
          this.create = false
          this.getTask()
          break
        case 2:
          this.taskType = ""
          this.file.zip = ""
          this.databaseTableList = []
          this.database.url = ''
          this.database.day = ''
          this.database.table = ''
          this.database.time = null
          this.steps = 1
          this.icon2 = ""
          break
        case 3:
          this.ruleName = "";
          this.ruleList = [];
          this.steps = 2;
          this.icon3 = "";
          break
        case 4:
          break
      }
    },
    getRuleList(){
      switch (this.taskType){
        case "结构化数据导入":
          var res = getRuleList();
          res.then(result => {
            this.ruleList = result.data
          })
          break
        case "半结构化数据导入1":
          var res = getJsonRuleList(1);
          res.then(result => {
            this.ruleList = result.data
          })
          break
        case "半结构化数据导入2":
          var res = getJsonRuleList(2);
          res.then(result => {
            this.ruleList = result.data
          })
          break
          break
        case "非结构化数据导入":
          break
        case "实时数据导入":
          var res = getDatabaseRuleList();
          res.then(result => {
            console.log(result.data)
            this.ruleList = result.data
          })
          break
      }
    },
    getSchemaList(){
      getSchemaList().then(response => {
        this.schemaList = response.data.SchemaInfoList
      })
    },
    testDatabaseConnect(){
      testConnectURL(this.database.url).then(response => {
        console.log(response.status)
        if (response.status > 0){
          this.$message({
            message: '测试连接成功',
            type: 'success'
          });
          this.databaseTableList = response.data
        }
        else {
          this.$message.error({
            message: '测试失败'
          });
        }
      })
    },
    createTask(){
      this.create = true
      this.getSchemaList()
    },
    formatGap(start, end) {
      // let staytimeGap = new Date().getTime() - new Date(start).getTime();
      let staytimeGap = new Date(end).getTime() - new Date(start).getTime();
      let stayHour = Math.floor(staytimeGap / (3600 * 1000));  // 小时
      let leave1 = staytimeGap % (3600 * 1000);
      let stayMin = Math.floor(leave1 / (60 * 1000));  // 分钟
      let leave2 = leave1 % (60 * 1000);
      let staySec = Math.floor(leave2 / 1000);   // 秒
      // return stayHour * 60 + stayMin
      return stayHour + ":" + stayMin + ":" + staySec;
    },
    run_time(val){
      if(val == ""){
        return ""
      }
      let aData = new Date();
      let now_time = aData.getFullYear() + "-" + (aData.getMonth() + 1) + "-" + aData.getDate() + " " +  aData.getHours() + ":" + aData.getMinutes() + ":" + aData.getSeconds();
      aData = new Date(val);
      let start_time = aData.getFullYear() + "-" + (aData.getMonth() + 1) + "-" + aData.getDate() + " " +  aData.getHours() + ":" + aData.getMinutes() + ":" + aData.getSeconds();
      let time = this.formatGap(start_time, now_time)
      return time
    },
    start(val){
      console.log(val)
      startTask(val).then(response => {
        console.log(response)
        this.getTask()
      })
    },
    stop(val){
      stopTask(val).then(response => {
        console.log(response)
        this.getTask()
      })
    },
    timer: function (){
      this.updateTime()
    },
    handleCurrentChange(val) {
      this.pageNum = val;
    },
    // 自适应表格列宽
    flexColumnWidth(str, tableData, flag = 'max') {
      // str为该列的字段名(传字符串);tableData为该表格的数据源(传变量);
      // flag为可选值，可不传该参数,传参时可选'max'或'equal',默认为'max'
      // flag为'max'则设置列宽适配该列中最长的内容,flag为'equal'则设置列宽适配该列中第一行内容的长度。
      str = str + ''
      let columnContent = ''
      if (!tableData || !tableData.length || tableData.length === 0 || tableData === undefined) {
        return
      }
      if (!str || !str.length || str.length === 0 || str === undefined) {
        return
      }
      if (flag === 'equal') {
        // 获取该列中第一个不为空的数据(内容)
        for (let i = 0; i < tableData.length; i++) {
          if (tableData[i][str].length > 0) {
            // console.log('该列数据[0]:', tableData[0][str])
            columnContent = tableData[i][str]
            break
          }
        }
      } else {
        // 获取该列中最长的数据(内容)
        let index = 0
        for (let i = 0; i < tableData.length; i++) {
          if (tableData[i][str] === null) {
            return
          }
          const now_temp = tableData[i][str] + ''
          const max_temp = tableData[index][str] + ''
          if (now_temp.length > max_temp.length) {
            index = i
          }
        }
        columnContent = tableData[index][str]
      }
      // console.log('该列数据[i]:', columnContent)
      // 以下分配的单位长度可根据实际需求进行调整
      let flexWidth = 0
      for (const char of columnContent) {
        if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
          // 如果是英文字符，为字符分配8个单位宽度
          flexWidth += 8
        } else if (char >= '\u4e00' && char <= '\u9fa5') {
          // 如果是中文字符，为字符分配15个单位宽度
          flexWidth += 15
        } else {
          // 其他种类字符，为字符分配8个单位宽度
          flexWidth += 8
        }
      }

      if (flexWidth < 90) {
        // 设置最小宽度
        flexWidth = 90
      }
      // if (flexWidth > 250) {
      //   // 设置最大宽度
      //   flexWidth = 250
      // }
      console.log(flexWidth)
      return flexWidth * 1.4
    },
    updateTime(){
      let update = this.tableData
      this.tableData = []
      this.tableData = update
    },
    getTask(){
      getTaskList().then(response => {
        this.tableData = response.data
      })
    }
  },
  mounted() {
    this.getTask()
  }
}
</script>

<style scoped>
  .log{
    height: 75vh;
  }
  >>>.el-table{
    margin-top: 15px;
    margin-left: 16px;
    width: calc(100% - 32px);
  }
  >>>.el-pagination{
    margin-right: 16px;
    float: right;
  }
  .testbox {
    /deep/ .el-table--scrollable-x .el-table__body-wrapper
    {
      overflow: auto !important;
    }
    /deep/.el-table__fixed-right-patch
    {
      background-color: #f5f7fa !important;
    }
  }
</style>
<style scoped>
.stepInfo{
  display: inline-block;
  text-align: left;
  padding-top: 5vh;
  line-height: 5vh;
}
.longInput{
  margin-top: 20px;
  width: 60vw;
}
.el-input{
  margin-top: 5vh;
  width: 65vw;
}
</style>

<style scoped>
>>> .el-input__inner{
  height: 32px;
  font-weight: bold;
  text-align: -moz-center;
  font-size: 14px;
}
>>> .el-step__line {
  margin-left: 10px;
  margin-right: 10px;
  background: transparent;
  border-top: 1px solid;
  color: #F2F3F5;
}
>>> .el-step__title.is-finish{
  color: #C0C4CC;
  font-weight: 500;
}
>>> .el-step__title.is-process{
  color: #C0C4CC;
  font-weight: 500;
  margin-top: 7px;
}
>>> .el-step__title.is-wait{
  color: #C0C4CC;
  font-weight: 500;
  margin-top: 7px;
}
>>> .el-step__line-inner{
  border-width: 0 !important;
}
>>> .el-step__head.is-finish{
  color: #165DFF;
  border-color: #165DFF;
}
>>> .el-step__head.is-process {
  color: #4E5969;
  border-color: #E5EAF7;
}
>>> .el-step__head.is-wait{
  color: #4E5969;
  border-color: #E5EAF7;
}
>>> .el-step__icon-inner{
  font-size: 16px;
}
</style>

<style scoped id="1">
>>> .el-step__icon{
  background: #E5EAF7;
}
</style>

<style>
.el-icon-my-export {
  background: url('../assets/blue.jpg') center no-repeat;
  background-size: contain;
  background-color: white;
  border-color: #FFFFFF;
}
.el-icon-my-export:before {
  content: "\66ff";
  font-size: 40px;
  visibility: hidden;
}
</style>