<template>
  <div>
    <div v-if="!this.create">
      <div style="color: #1D74F1; font-weight: bold; text-align: left; font-size: 14px; margin-left: 16px">图谱构建管理</div>
      <div style="margin-top: 4px; display: block; overflow: hidden">
        <div style="color: #1D2129; font-weight: bold; text-align: left; font-size: 18px; margin-left: 16px; display: inline; float: left">半结构化导入</div>
        <div style="display: inline; float: right; height: 32px">
          <el-input
              v-model="search"
              style="font-weight: bold; font-size: 14px; width: 500px; height: 32px"
              placeholder="请输入"
              clearable=True
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
                    <el-button type="primary" icon="el-icon-edit" size="small" @click="handleImportBegin(projectCard)">
                    </el-button>
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
    <div v-else-if="this.create">
      <div style="color: #1D74F1; font-weight: bold; text-align: left; font-size: 14px; margin-left: 16px">图谱构建管理</div>
      <div style="margin-top: 4px; color: #1D2129; font-weight: bold; text-align: left; font-size: 18px; margin-left: 16px; float: left">半结构化导入</div>
      <el-steps :active=this.steps align-center style="margin-top: 60px">
        <el-step title="上传半结构化文件，选择Schema" icon="el-icon-my-export"></el-step>
        <el-step title="映射schema元素" :icon=this.icon2></el-step>
        <el-step title="映射关系" :icon=this.icon3></el-step>
        <el-step title="提交" :icon=this.icon4></el-step>
      </el-steps>
      <div v-show="this.steps==1">
        <div style="margin-top: 50px; width: 560px; margin-left: calc(50% - 280px)">
          <div style="display: inline; font-weight: bold; margin-left: -80px">输入规则名称:&nbsp&nbsp&nbsp</div>
          <el-input
              v-model="file.name"
              style="font-weight: bold; font-size: 14px; width: 350px; height: 32px"
              placeholder="请输入"
              clearable=True
              rows="20"
          >
          </el-input>
        </div>
        <div style="margin-top: 50px; width: 560px; text-align: left; margin-left: calc(50% - 280px)">
          <div style="display: inline; font-weight: bold; text-align: left; width: 150px">选择导入文件:&nbsp&nbsp&nbsp</div>
          <div style="display: inline; width: 350px">
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
        <div style="margin-top: 60px; margin-left: -60px">
          <div style="display: inline; font-weight: bold">选择OWL文件:&nbsp&nbsp&nbsp</div>
          <el-select
              style="font-weight: bold; font-size: 14px; width: 380px; height: 32px"
              placeholder="请选择" v-model="file.schemaName"
          >
            <el-option
                v-for="item in schemaList"
                :key="item.name"
                :label="item.name"
                :value="item.name">
            </el-option>
          </el-select>
        </div>
      </div>
      <div v-show="this.steps==2">
        <div style="text-align: left; margin-left: 60px; margin-top: 20px">
          <div style="display: inline-block; font-size: 16px; font-weight: bold">选择json文件:&nbsp&nbsp&nbsp</div>
          <el-select v-model="jsonFile" placeholder="请选择" @change="handleEntitySituation">
            <el-option
                v-for="item in jsonList"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
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
              prop="json"
              label="json元素名">
          </el-table-column>
          <el-table-column
              prop="schema"
              label="schema元素名">
            <template slot-scope="scope">
              <el-select v-model="scope.row.schema" filterable>
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
            </template>
          </el-table-column>
          <el-table-column
              prop="operation"
              label="操作">
            <template slot-scope="scope">
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
      <div v-show="this.steps == 4">
        <img src="~@/assets/success.png" style="height: 250px; margin-top: 250px; clear: both; display: block; margin: auto;" />
        <div style="font-size: 24px; color: #2A82E4">已完成所有模板创建，请点击确认提交，模板可以在任务管理中使用。</div>
      </div>
      <div style="margin-top: 60px">
        <el-button @click="cancel" plain style="color: white; background: #1C74F1; font-weight: bold; margin-right: 33%">Back</el-button>
        <el-button @click="submitUpload" plain style="color: white; background: #1C74F1; font-weight: bold">Next</el-button>
      </div>
    </div>
    <div>
      <el-dialog title="关系映射" :visible.sync="relationRow.dialogVisible" width="30%" :before-close="handleClose">
        <el-row>
          <el-col :span="6" :offset="5">Domain:</el-col>
          <el-col :span="10">
            <el-select v-model="relationRow.rowData.Domain" @change="handleDomainData">
              <el-option
                  v-for="item in this.jsonList"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select></el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="6" :offset="5">DomainData:</el-col>
          <el-col :span="10">
            <el-select v-model="relationRow.rowData.DomainData" filterable>
              <el-option
                  v-for="item in relationRow.DomainData"
                  :key="item['json']"
                  :label="item['json']"
                  :value="item['json']">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="6" :offset="5">relation:</el-col>
          <el-col :span="10">
            <el-select v-model="relationRow.rowData.relation" filterable>
              <el-option
                  v-for="item in entityMapping.relation"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="6" :offset="5">Range:</el-col>
          <el-col :span="10">
            <el-select v-model="relationRow.rowData.Range" @change="handleRangeData">
              <el-option
                  v-for="item in this.jsonList"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="6" :offset="5">RangeData:</el-col>
          <el-col :span="10">
            <el-select v-model="relationRow.rowData.RangeData" filterable>
              <el-option
                  v-for="item in relationRow.RangeData"
                  :key="item['json']"
                  :label="item['json']"
                  :value="item['json']">
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
import {getSchemaList} from "@/actions/SchemaActions";
import {
  getExistJsonFileList,
  getJsonMappingSituation,
  getJsonRelationMappingSituation, getJsonRuleList,
  handlingOpenData,
  updateJsonMappingSituation,
  updateJsonRelationMappingSituation,
  uploadJsonFile,
} from "@/actions/JsonProjectAction";
import {downloadJsonSample, getSchemaElementList} from "@/actions/UserInteractionProjectAction";

export default {
  name: "Semistructured",
  data(){
    return{
      search: "",
      projectList: [],
      create: false,
      relationTable: [],
      entityTable: [],
      jsonList: [],
      jsonFile: '',
      relationMapping:{
        type: 'danger',
        status: '未映射',
        options: []
      },
      file: {
        zip: '',
        raw: null,
        name: '',
        schemaName: '',
      },
      this_file: {
        zip: '',
        schemaName: '',
      },
      steps: 1,
      schemaList: [],
      icon2: "",
      icon3: "",
      icon4: "",
      entityMapping:{
        type: 'danger',
        status: "未映射",
        options: [],
        relation: [],
      },
      relationRow:{
        dialogVisible: false,
        DomainData: [],
        RangeData: [],
        rowData:{
          Domain: '',
          DomainData: '',
          relation: '',
          Range: '',
          RangeData: '',
        },
        options: []
      },
    }
  },
  methods:{
    createNew(){
      this.create = true
    },
    handleProjectListFrash(){
      var res = getJsonRuleList(1);
      res.then(result => {
        this.projectList = result.data
      })
    },
    handleRelationTableSave(){
      updateJsonRelationMappingSituation(this.this_file.zip, this.relationTable).then(response => {
        console.log("成功了")
      })
      this.handleRelationSituation()
    },
    identityRelationRow(){
      this.relationTable.push({...this.relationRow.rowData})
      this.relationRow.dialogVisible = false
      // TODO
      this.relationRow.rowData.Domain = ''
      this.relationRow.rowData.DomainData = ''
      this.relationRow.rowData.relation = ''
      this.relationRow.rowData.RangeData = ''
      this.relationRow.rowData.Range = ''
    },
    handleRangeData(){
      getJsonMappingSituation(this.relationRow.rowData.Range, this.this_file.zip).then(response => {
        this.relationRow.RangeData = response.data
      })
    },
    handleDomainData(){
      getJsonMappingSituation(this.relationRow.rowData.Domain, this.this_file.zip).then(response => {
        this.relationRow.DomainData = response.data
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    deleteRow(index, rows){
      rows.splice(index, 1);
    },
    handleEntityTableSave(){
      updateJsonMappingSituation(this.jsonFile, this.this_file.zip, this.entityTable).then(response => {
        console.log("实体表映射成功")
        this.handleEntitySituation()
      })
    },
    resetRow(index, rows) {
      rows[index]["schema"] = '';
    },
    handleEntitySituation(){
      getJsonMappingSituation(this.jsonFile, this.this_file.zip).then(response => {
        console.log(response.data)
        this.entityTable = response.data
      })
    },
    getSchemaList(){
      getSchemaList().then(response => {
        this.schemaList = response.data.SchemaInfoList
      })
    },
    downloadJsonSample(){
      downloadJsonSample(2);
    },
    handleExceed(files, fileList){
      this.handleChange(files[0], fileList)
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
    cancel(){
      if (this.steps > 1){
        this.steps = this.steps - 1;
        if (this.steps == 1){
          this.jsonFile = '';
          this.csvName1 = '';
          this.file.name = '';
          this.file.raw = null;
          this.file.schemaName = '';
          this.entityTable = [];
          this.icon2 = "";
        }
        else if (this.steps == 2){
          this.csvName2 = '';
          this.status = '未映射';
          this.relationTable = [];
          this.icon3 = "";
        }
        else if (this.steps == 3){
          this.relationTable = [];
          getJsonRelationMappingSituation(this.this_file.zip).then(response => {
            console.log(response.data)
            this.relationTable = response.data
            console.log(this.relationTable)
          })
          this.icon4 = "";
        }
      }
      else {
        this.file.name = '';
        this.file.raw = null;
        this.file.schemaName = '';
        this.create = false;
        this.getSchemaList();
        this.handleProjectListFrash()
      }
    },
    submitUpload() {
      if (this.steps === 1){
        if (this.file.raw == null || this.file.name === '') {
          this.$message.error({
            message: '文件未上传或OWL模型未选择'
          });
          return;
        }
        uploadJsonFile(this.file.name, this.file.raw).then(response => {
          if (response.status > 0) {
            this.steps = 2;
            this.icon2 = "el-icon-my-export";
            this.this_file.schemaName = this.file.schemaName;
            this.this_file.zip = this.file.name;
            this.file = {
              raw: null,
              name: '',
              schemaName: '',
            }
            getSchemaElementList(this.this_file.schemaName).then(result => {
              this.entityMapping.options = result.data
              this.$delete(this.entityMapping.options, "relation")
            })
            getSchemaElementList(this.this_file.schemaName).then(result => {
              this.entityMapping.relation = result.data["relation"]
            })
            getExistJsonFileList(this.this_file.zip).then(response => {
              this.jsonList = response.data
            })
            console.log(this.jsonList)
          } else {
            this.$message({
              message: '导入包失败,请重试',
              type: 'error'
            });
          }
        })
      }
      else if (this.steps == 2){
        this.jsonFile = '';
        this.entityTable = [];
        this.icon3 = "el-icon-my-export";
        this.steps = 3;
        getJsonRelationMappingSituation(this.this_file.zip).then(response => {
          console.log(response.data)
          this.relationTable = response.data
          console.log(this.relationTable)
        })
      }
      else if (this.steps == 3){
        this.icon4 = "el-icon-my-export";
        this.steps = 4;
        this.relationTable = []
      }
      else if (this.steps == 4){
        handlingOpenData(this.this_file.zip, this.this_file.schemaName, 1).then(response => {
          console.log(response.data)
          this.relationTable = response.data
          console.log(this.relationTable)
          this.steps = 1;
          this.icon2 = "";
          this.icon3 = "";
          this.icon4 = "";
          this.file.name = '';
          this.file.raw = null;
          this.file.schemaName = '';
          this.create = false
          this.getSchemaList();
          this.handleProjectListFrash()
        })
      }
    },

  },
  mounted() {
    this.getSchemaList();
    this.handleProjectListFrash()
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
