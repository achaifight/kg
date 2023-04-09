<template>
  <div>
    <div v-if="!this.create">
      <div style="color: #1D74F1; font-weight: bold; text-align: left; font-size: 14px; margin-left: 16px">图谱构建管理</div>
      <div style="margin-top: 4px; display: block; overflow: hidden">
        <div style="color: #1D2129; font-weight: bold; text-align: left; font-size: 18px; margin-left: 16px; display: inline; float: left">数据库导入</div>
        <div style="display: inline; float: right; height: 32px">
          <el-input
              v-model="search"
              style="font-weight: bold; font-size: 14px; width: 500px; height: 32px"
              placeholder="请输入"
              :clearable="true"
              rows="20"
          >
            <i slot="prefix" class="el-icon-search" style="font-size: 16px; margin-top: 8px; font-weight: bold"></i>
          </el-input>
          <el-button type="primary" style="margin-left: 18px; background: #1C74F1; font-size: 14px; font-weight: bold" size="mini" @click="createNew">新建</el-button>
        </div>
      </div>
      <el-scrollbar style="height: 55vh; margin-top: 20px"  wrap-style="overflow-x:hidden;">
        <el-row>
          <el-col :span="6" v-for="(projectCard, index) in projectList" :key="projectCard.name">
            <el-card :body-style="{ padding: '0px' }" shadow="hover">
              <div style="padding: 14px;">
                <div class="bottom clearfix">
                  <el-button-group>
<!--                    <el-button type="primary" icon="el-icon-edit" size="small" @click="handleImportBegin(projectCard)">-->
<!--                    </el-button>-->
                    <!--                    <el-button type="primary" icon="el-icon-download" size="small" @click="handleDownload(projectCard)"></el-button>-->
                    <el-button type="primary" icon="el-icon-close" size="small" @click="handleDeleteBegin(projectCard)">
                    </el-button>
                  </el-button-group>
                </div>
                <br></br>
                <span>{{ projectCard.name }}</span><br></br>
                <span>{{ projectCard.info }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
    <div v-else-if="create">
      <div style="color: #1D74F1; font-weight: bold; text-align: left; font-size: 14px; margin-left: 16px">图谱构建管理</div>
      <div style="margin-top: 4px; color: #1D2129; font-weight: bold; text-align: left; font-size: 18px; margin-left: 16px; display: inline; float: left">数据库导入</div>
      <el-steps :active=this.steps align-center style="margin-top: 60px">
        <el-step title="连接数据库" icon="el-icon-my-export"></el-step>
        <el-step title="映射实体表" :icon=this.icon2></el-step>
        <el-step title="映射关系表" :icon=this.icon3></el-step>
        <el-step title="提交" :icon=this.icon4></el-step>
      </el-steps>
      <div v-show="this.steps==1">
        <div style="margin-top: 20px">
          <div style="display: inline; font-weight: bold">输入规则名称:&nbsp&nbsp&nbsp</div>
          <el-input
              v-model="database.name"
              style="font-weight: bold; font-size: 14px; width: 280px; height: 32px"
              placeholder="请输入"
              :clearable="true"
              rows="20"
          >
          </el-input>
        </div>
        <div style="margin-top: 40px; margin-left: 30px">
          <div style="display: inline; font-weight: bold">输入链接:&nbsp&nbsp&nbsp&nbsp</div>
          <el-input
              v-model="database.url"
              style="font-weight: bold; font-size: 14px; width: 280px; height: 32px"
              placeholder="请输入"
              :clearable="true"
              rows="20"
          >
          </el-input>
          <el-button type="text" style="margin-left: 20px; width: 40px" @click="testConnect">测试链接</el-button>
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
        <div style="margin-top: 40px">
          <div style="display: inline; font-weight: bold">选择OWL文件:&nbsp&nbsp&nbsp</div>
          <el-select
              style="font-weight: bold; font-size: 14px; width: 280px; height: 32px"
              placeholder="请选择" v-model="database.schemaName"
          >
            <el-option
                v-for="item in schemaList"
                :key="item.name"
                :label="name(item.name)"
                :value="item.name">
            </el-option>
          </el-select>
        </div>
        <div style="margin-top: 40px; margin-left: 30px">
          <div style="display: inline; font-weight: bold">设定间隔时间:&nbsp&nbsp&nbsp&nbsp</div>
          <el-input
              v-model="database.day"
              style="font-weight: bold; font-size: 14px; width: 90px; height: 32px"
              placeholder="请输入"
              :clearable="true"
              rows="3"
          >
          </el-input>
          天
          <el-time-picker
              v-model="database.time"
              placeholder="选择时间">
          </el-time-picker>
        </div>
      </div>
      <div v-show="this.steps==2">
        <div style="text-align: left; margin-left: 60px; margin-top: 20px">
          <div style="display: inline-block; font-size: 16px; font-weight: bold">选择table:&nbsp&nbsp&nbsp</div>
          <el-select v-model="collectionName1" placeholder="请选择" @change="handleEntitySituation" filterable>
            <el-option
                v-for="item in tableList"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
          <div style="display: inline-block; font-size: 16px; font-weight: bold">&nbsp&nbsp&nbsp{{this.status}}</div>
          <div style="float: right; margin-right: 60px; display: inline-block">
            <el-button @click="handleEntityTableSave" type="" size="14px" style="background: #1C74F1; color: #FFFFFF; font-weight: bold">保存</el-button>
          </div>
        </div>
        <el-table
            :data="entityTable"
            :header-cell-style='{"text-align": "center", "background-color": "#E7E7E7", "color": "#1D2129", "font-size": "14px", "font-weight": "bold"}'
            :cell-style= '{"text-align": "center", "color": "#1D2129", "font-size": "14px", "font-weight": "bold"}'
            style="width: calc(100% - 120px); margin-left: 60px; margin-top: 20px">
          <el-table-column
              prop="name"
              label="列名">
          </el-table-column>
          <el-table-column
              prop="type"
              label="类型">
          </el-table-column>
          <el-table-column
              prop="schema_name"
              label="schema元素名称">
          </el-table-column>
          <el-table-column
              prop="status"
              label="状态">
          </el-table-column>
          <el-table-column
              prop="operation"
              label="操作">
            <template slot-scope="scope">
              <el-button @click="mappingRow(scope.$index, entityTable)" type="text" size="14px" style="color: #1C74F1; font-weight: bold">映射</el-button>
              <el-button type="text" size="14px" style="color: #F53F3F; font-weight: bold" @click="resetRow(scope.$index, entityTable)">重置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="this.steps == 3">
        <div style="text-align: left; margin-left: 60px; margin-top: 20px">
          <div style="float: right; margin-right: 60px; display: inline-block">
            <el-button type="" size="14px" style="background: #A5D63F; color: #FFFFFF; font-weight: bold" @click="relationRow.dialogVisible = true">添加</el-button>
            <el-button type="" size="14px" style="background: #1C74F1; color: #FFFFFF; font-weight: bold" @click="handleRelationTableSave">保存</el-button>
            <el-button type="" size="14px" style="background: #F53F3F; color: #FFFFFF; font-weight: bold" @click="relationTable = []">全部删除</el-button>
          </div>
        </div>
        <el-table
            :data="relationTable"
            :header-cell-style='{"text-align": "center", "background-color": "#E7E7E7", "color": "#1D2129", "font-size": "14px", "font-weight": "bold"}'
            :cell-style= '{"text-align": "center", "color": "#1D2129", "font-size": "14px", "font-weight": "bold"}'
            style="width: calc(100% - 120px); margin-left: 60px; margin-top: 20px">
          <el-table-column
              prop="relationFile"
              label="relationFile">
          </el-table-column>
          <el-table-column
              prop="DomainColumn"
              label="DomainColumn">
          </el-table-column>
          <el-table-column
              prop="RangeColumn"
              label="RangeColumn">
          </el-table-column>
          <el-table-column
              prop="Domain"
              label="Domain">
          </el-table-column>
          <el-table-column
              prop="DomainData"
              label="DomainData">
          </el-table-column>
          <el-table-column
              prop="relation"
              label="relation">
          </el-table-column>
          <el-table-column
              prop="Range"
              label="Range">
          </el-table-column>
          <el-table-column
              prop="RangeData"
              label="RangeData">
          </el-table-column>
          <el-table-column
              prop="operation"
              label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="14px" style="color: #F53F3F; font-weight: bold" @click.native.prevent="deleteRow(scope.$index, relationTable)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="this.steps==4">
        <img src="~@/assets/success.png" style="height: 250px; margin-top: 20px" />
        <div style="font-size: 24px; color: #2A82E4">提交完成，在模板库中使用该映射模板。</div>
      </div>
      <div style="margin-top: 60px">
        <el-button @click="lastStep" plain style="color: white; background: #1C74F1; font-weight: bold; margin-right: 33%">Back</el-button>
        <el-button @click="nextStep" plain style="color: white; background: #1C74F1; font-weight: bold">Next</el-button>
      </div>
    </div>
    <div>
      <el-dialog :title="entityRow.name" :visible.sync="entityRow.dialogVisible" width="30%" :before-close="handleClose">
        <el-select v-model="entityRow.value" filterable placeholder="类型选择">
          <el-option-group
              v-for="(group, index) in entityMapping.options"
              :key="index"
              :label="index">
            <el-option
                v-for="item in group"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-option-group>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="entityRow.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="identityEntityRow">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="关系映射" :visible.sync="relationRow.dialogVisible" width="40%" :before-close="handleClose">
        <el-row>
          <el-col :span="10" :offset="2">relationFile:</el-col>
          <el-col :span="10">
            <el-select v-model="relationRow.rowData.relationFile" @change="handleRelationFile" filterable>
              <el-option
                  v-for="item in this.tableList"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select></el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="10" :offset="2">DomainColumn:</el-col>
          <el-col :span="10">
            <el-select v-model="relationRow.rowData.DomainColumn" filterable>
              <el-option
                  v-for="item in this.relationRow.FileColumn"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select></el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="10" :offset="2">RangeColumn:</el-col>
          <el-col :span="10">
            <el-select v-model="relationRow.rowData.RangeColumn" filterable>
              <el-option
                  v-for="item in this.relationRow.FileColumn"
                  ::key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select></el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="10" :offset="2">Domain:</el-col>
          <el-col :span="10">
            <el-select v-model="relationRow.rowData.Domain" @change="handleDomainData" filterable>
              <el-option
                  v-for="item in this.tableList"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select></el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="10" :offset="2">DomainData:</el-col>
          <el-col :span="10">
            <el-select v-model="relationRow.rowData.DomainData" filterable>
              <el-option
                  v-for="item in relationRow.DomainData"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="10" :offset="2">relation:</el-col>
          <el-col :span="10">
            <el-select v-model="relationRow.rowData.relation" filterable>
              <el-option
                  v-for="item in entityMapping.options.relation"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="10" :offset="2">Range:</el-col>
          <el-col :span="10">
            <el-select v-model="relationRow.rowData.Range" @change="handleRangeData" filterable>
              <el-option
                  v-for="item in this.tableList"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="10" :offset="2">RangeData:</el-col>
          <el-col :span="10">
            <el-select v-model="relationRow.rowData.RangeData" filterable>
              <el-option
                  v-for="item in relationRow.RangeData"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="relationRow.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="identityRelationRow">确 定</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import {getSchemaElementList} from "@/actions/UserInteractionProjectAction"
import { getSchemaList } from "@/actions/SchemaActions";
import {
  testConnectURL,
  uploadDatabase,
  getDatabaseClassMappingSituation,
  updateDatabaseClassMappingSituation,
  getKeyList,
  updateDatabaseRelationMappingSituation,
  getDatabaseRelationMappingSituation, getDatabaseRuleList, saveDatabaseDataRule
} from "@/actions/DataBaseProjectAction"
import log from "@/components/Log";
export default {
  name: "Database",
  data() {
    return{
      projectList: [],
      databaseTableList: [],
      database:{
        url: '',
        day: '',
        name: '',
        table: '',
        schemaName: '',
        time: null,
      },
      entityRow:{
        dialogVisible: false,
        name: '',
        index: '',
        value: '',
      },
      entityMapping:{
        type: 'danger',
        status: "未映射",
        options: [],
      },
      relationMapping:{
        type: 'danger',
        status: '未映射',
        options: []
      },
      relationRow:{
        dialogVisible: false,
        DomainData: [],
        RangeData: [],
        FileColumn: [],
        rowData:{
          relationFile: '',
          DomainColumn: '',
          RangeColumn: '',
          Domain: '',
          DomainData: '',
          relation: '',
          Range: '',
          RangeData: '',
        },
        options: []
      },
      schemaList: [],
      temp: '',
      value: '',
      icon2: "",
      icon3: "",
      icon4: "",
      steps: 1,
      create: this.$route.params.create?this.$route.params.create:false,
      tableList: [],
      collectionName1: '',
      csvName2: '',
      status: '未映射',
      entityTable: [],
      relationTable: [],
    }
  },
  methods: {
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
    handleDomainData(){
      getKeyList(this.relationRow.rowData.Domain, this.database.name).then(response => {
        this.relationRow.DomainData = response.data
      })
    },
    handleRangeData(){
      getKeyList(this.relationRow.rowData.Range, this.database.name).then(response => {
        this.relationRow.RangeData = response.data
      })
    },
    handleRelationFile(){
      getKeyList(this.relationRow.rowData.relationFile, this.database.name).then(response => {
        this.relationRow.FileColumn = response.data
      })
    },
    testConnect(){
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
    handleDownload(projectCard){
      // downloadProject(projectCard.name)
    },
    handleImportBegin(ProjectCard) {
      // this.dialogImportVisible = true,
      // this.importForm = { name: ProjectCard.name, file: null,fileName:"" }
    },
    handleDeleteBegin(ProjectCard) {
      // this.dialogDeleteVisible = true,
      // this.deleteForm = { name: ProjectCard.name, filePath: ProjectCard.info }
    },
    getSchemaList(){
      getSchemaList().then(response => {
        this.schemaList = response.data.SchemaInfoList
      })
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
    submitUpload() {
      if (this.database.name == '' || this.database.schemaName == '' || this.database.table == '' || this.database.time == null || this.database.day == '') {
        this.$message.error({
          message: '数据填写不完全'
        });
        this.steps = this.steps -1;
        this.icon2 = "";
        return;
      }
      uploadDatabase(this.database.name, this.database.schemaName, this.database.table, this.database.url, this.database.day, this.database.time).then(response => {
        if (response.status > 0) {
          this.$message({
            message: '数据库连接成功',
            type: 'success'
          });
          this.tableList = response.data
          getSchemaElementList(this.database.schemaName).then(result => {
            this.entityMapping.options = result.data
          })
        } else {
          this.steps = this.steps -1;
          this.icon2 = "";
          this.$message({
            message: '导入包失败,请重试',
            type: 'error'
          });
        }
      })
    },
    handleEntitySituation(){
      getDatabaseClassMappingSituation(this.database.name, this.collectionName1).then(response => {
        console.log(this.collectionName1)
        this.entityTable = response.data.data
        this.entityMapping.status = response.data.status
        if(response.data.status != "未映射"){
          this.status = "已映射"
        }
        else{
          this.status = "未映射"
        }
      })
      getSchemaElementList(this.database.schemaName).then(result => {
        this.entityMapping.options = result.data
      })
    },
    identityEntityRow(){
      this.entityTable[this.entityRow.index]["schema_name"] = this.entityRow.value
      this.entityTable[this.entityRow.index]["status"] = "已映射"
      if(this.entityMapping.options["class"].indexOf(this.entityRow.value) != -1){
        this.entityTable[this.entityRow.index]["type"] = "class"
      }
      else if(this.entityMapping.options["data"].indexOf(this.entityRow.value) != -1){
        this.entityTable[this.entityRow.index]["type"] = "data"
      }
      else{
        this.entityTable[this.entityRow.index]["type"] = "relation"
      }
      // 待优化
      // this.$refs.entityRow.resetFields()
      this.entityRow.dialogVisible = false
      this.entityRow.name = ''
      this.entityRow.index = ''
      this.entityRow.value = ''
    },
    mappingRow(index, rows){
      this.entityRow.index = index
      this.entityRow.name = rows[index]["name"]
      this.entityRow.dialogVisible = true
    },
    resetRow(index, rows) {
      rows[index]["type"] = '';
      rows[index]["schema_name"] = '';
      rows[index]["is_composite_element"] = '';
      rows[index]["status"] = "未映射";
    },
    handleEntityTableSave(){
      updateDatabaseClassMappingSituation(this.collectionName1, this.database.name, this.entityTable).then(response => {
        console.log("实体表映射成功")
        this.handleEntitySituation()
      })
    },
    handleRelationSituation(){
      getDatabaseRelationMappingSituation(this.database.name).then(response => {
        this.relationTable = response.data
      })
    },
    deleteRow(index, rows){
      rows.splice(index, 1);
    },
    handleRelationTableSave(){
      updateDatabaseRelationMappingSituation(this.database.name, this.relationTable).then(response => {
        console.log("成功了")
        this.handleRelationSituation()
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    identityRelationRow(){
      if(typeof(this.relationTable) == "undefined"){
        this.relationTable = []
      }
      this.relationTable.push({...this.relationRow.rowData})
      this.relationRow.dialogVisible = false
      // TODO
      this.relationRow.DomainData = []
      this.relationRow.RangeData = []
      this.relationRow.FileColumn = []
      this.relationRow.rowData.relationFile = ''
      this.relationRow.rowData.DomainColumn = ''
      this.relationRow.rowData.RangeColumn = ''
      this.relationRow.rowData.Domain = ''
      this.relationRow.rowData.DomainData = ''
      this.relationRow.rowData.relation = ''
      this.relationRow.rowData.Range = ''
      this.relationRow.rowData.RangeData = ''
    },
    createNew(){
      this.create = true
    },
    submit(){
      saveDatabaseDataRule(this.database.name).then(response => {
        console.log("成功了")
        Object.assign(this.$data, this.$options.data.call(this))
        this.handleProjectListFrash();
        this.getSchemaList();
      })
    },
    nextStep(){
      if (this.steps < 4){
        this.steps = this.steps + 1;
        if (this.steps == 2){
          this.icon2 = "el-icon-my-export";
          this.submitUpload();
        }
        if (this.steps == 3){
          this.collectionName1 = '';
          this.status = '未映射';
          this.entityTable = [];
          this.icon3 = "el-icon-my-export";
          this.handleRelationSituation();
        }
        if (this.steps == 4){
          this.csvName2 = '';
          this.status = '未映射';
          this.relationTable = [];
          this.icon4 = "el-icon-my-export";
        }
      }
      else if (this.steps == 4){
        this.submit();
      }
    },
    lastStep(){
      if (this.steps > 1){
        this.steps = this.steps - 1;
        if (this.steps == 1){
          console.log(this.steps)
          this.collectionName1 = '';
          this.status = '未映射';
          this.entityTable = [];
          this.icon2 = "";
        }
        if (this.steps == 2){
          this.csvName2 = '';
          this.status = '未映射';
          this.relationTable = [];
          this.icon3 = "";
        }
        if (this.steps == 3){
          this.handleRelationSituation();
          this.icon4 = "";
        }
      }
      else if (this.steps == 1){
        this.database.name = '';
        this.database.url = '';
        this.database.day = '';
        this.database.time = null;
        this.database.table = '';
        this.database.schemaName = '';
        this.create = false;
        this.handleProjectListFrash();
      }
    },
    handleProjectListFrash(){
      var res = getDatabaseRuleList();
      res.then(result => {
        console.log(result.data)
        this.projectList = result.data
      })
    },
  },
  mounted() {
    this.getSchemaList();
    this.handleProjectListFrash();
  },
}
</script>

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
