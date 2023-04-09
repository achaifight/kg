<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div style="color: #1D74F1; font-weight: bold; text-align: left; font-size: 14px; margin-left: 16px">图谱概念设计</div>
        <div style="margin-top: 4px; color: #1D2129; font-weight: bold; text-align: left; font-size: 18px; margin-left: 16px; float: left">schema设计</div>
      </el-col>
      <el-col :span="6" :offset="8">
        <div class="grid-content bg-purple">
          <el-input placeholder="请输入内容" prefix-icon="el-icon-search"></el-input>
        </div>
      </el-col>
      <el-col :span="0.5" :offset="0.5" style="width: 30px">
        <el-button type="success" @click="handleMerge">合并</el-button>
      </el-col>
      <el-col :span="1.5" :offset="1">
        <div class="grid-content bg-purple">
          <el-button type="primary" @click="dialogBuildVisible = true">新建</el-button>
        </div>
        <div>
          <el-dialog title="新建Schema" :visible.sync="dialogBuildVisible" width="40%" @close="handleClose">
            <div>
              选择母版本：
              <el-select v-model="newSchema.schemaVersion" placeholder="请选择" style="width: 370px;">
                <el-option
                    v-for="(item, index) in schemaList"
                    :key="index"
                    :label="name(item.name)"
                    :value="item.name">
                </el-option>
              </el-select>
            </div>
            <div style="margin-top: 30px">
              添加备注：
              <el-input v-model="newSchema.schemaName" placeholder="备注" style="width: 370px; margin-left: 20px;"></el-input>
            </div>


            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogBuildVisible = false">取 消</el-button>
              <el-button type="primary" @click="handBuild">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <div>
          <el-dialog title="删除Schema" :visible.sync="dialogDeleteVisible" width="40%">
            <span style="font-size: 20px; color:red">您确定要删除Schema[{{ deleteForm.name }}]吗？删除后无法复原！</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogDeleteVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleDelete">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-scrollbar style="height: 55vh"  wrap-style="overflow-x:hidden;">
      <el-row>
        <el-col :span="6" v-for="(schemaCard, index) in schemaList" :key="schemaCard.name">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <div style="padding: 14px;">
              <div class="bottom clearfix">
                <el-button-group>
                  <el-button type="primary" icon="el-icon-upload2" size="small" @click="handleImportBegin(schemaCard)"></el-button>
                  <el-button type="primary" icon="el-icon-download" size="small" @click="handleDownload(schemaCard)"></el-button>
                  <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(schemaCard)"></el-button>
                  <el-button type="primary" icon="el-icon-close" size="small" @click="handleDeleteBegin(schemaCard)"></el-button>
                </el-button-group>
              </div>
              <br></br>
              <span>{{ name(schemaCard.name)}}</span><br></br>
              <span>{{ schemaCard.info }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-scrollbar>
    <div>
      <el-dialog title="导入Schema" :visible.sync="dialogImportVisible">
        <el-form :model="importForm">
          <el-form-item id="warningInfo">
            <span :style="{ color: 'red', 'font-size': '16px' }">注意！导入的Schema文件将覆盖原有Schema内容！</span>
          </el-form-item>
          <el-form-item label="Schema Name" :label-width="formLabelWidth">
            <el-input :disabled="true" placeholder="Schema Name" v-model="importForm.name" autocomplete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="Schema File" :label-width="formLabelWidth">
            <el-input :disabled = "true" v-model = "importForm.fileName">
              <el-upload action="#" class="avatar-uploader" slot="append" name="files" ref="upload" :on-exceed="handleExceed" :limit="1" :show-file-list = "false" :on-change="handleFileUpload"
                         accept=".owl" :auto-upload="false" >
                　　<el-button slot="trigger" icon = "el-icon-folder-add" size="small">选取文件</el-button>
              </el-upload>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleUploadClose">取 消</el-button>
          <el-button type="primary" @click="handleImport">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  deleteSchema,
  importSchemaFile,
  getSchemaList,
  downloadSchema,
  getNewSchemaName, mergeSchema
} from "@/actions/SchemaActions";

export default {
  name: "Design",
  data() {
    return {
      newSchema: {
        schemaVersion: '',
        schemaName:'',
      },
      schemaList: [],
      dialogBuildVisible: false,
      dialogImportVisible: false,
      dialogDeleteVisible: false,
      importForm: {
        name: '',
        file: null,
        fileName:"",
      },
      deleteForm: {
        name: '',
      },
      formLabelWidth: '120px',
      buildForm: {
        name: '',
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'change' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }
        ],
      }
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
    handleMerge(){
      mergeSchema().then(response => {
        if (response.status > 0) {
          this.$message({
            message: '合并成功',
            type: 'success'
          });
          this.init()
        } else {
          this.$message({
            message: '合并失败',
            type: 'error'
          });
        }
      })
    },
    handleClose() {
      this.newSchema.schemaVersion = '';
      this.newSchema.schemaName = '';
      this.dialogBuildVisible = false

    },
    handleImportBegin(SchemaCard) {
      this.dialogImportVisible = true
      this.importForm = { name: SchemaCard.name, file: null,fileName:"" }
    },
    handleDeleteBegin(SchemaCard) {
      this.dialogDeleteVisible = true
      this.deleteForm = { name: SchemaCard.name, filePath: SchemaCard.info }
    },
    // 当超出限制时，执行的钩子函数
    handleExceed(files, fileList) {
      console.log(files)
      this.$refs.upload.clearFiles()
      console.log(files)
      this.handleFileUpload({"raw":files[0]},fileList)
    },
    handleUploadClose(){
      this.$refs.upload.clearFiles()
      this.dialogImportVisible = false
    },
    handleFileUpload(file, fileList) {
      console.log("INNNNN", file)
      const isOwl = file.raw.name.split('.')[1] === 'owl'
      if (!isOwl) {
        this.$message.error({
          message: '只能上传.owl文件'
        });
        return false;
      }
      // 阻止发生默认行为
      this.importForm.file = file.raw
      this.importForm.fileName = file.raw.name
      console.log(this.importForm.file)
    },
    handBuild() {
      this.dialogBuildVisible = false
      if (this.sGetCharCount('_', this.newSchema.schemaName) > 0){
        this.$message({
          message: '备注中不能有下划线',
          type: 'error'
        });
        return
      }
      getNewSchemaName(this.newSchema.schemaVersion,this.newSchema.schemaName).then(response => {
        this.newSchema.schemaVersion = ''
        this.newSchema.schemaName = ''
        if (response.status > 0) {
          this.$message({
            message: '创建Schema成功!',
            type: 'success'
          });
          // this.$refs.schemaCard.resetFields()
          this.handleSchemaListFrash();
          this.init();
        } else if (result.message === "file already exites!") {
          this.$message({
            message: '创建Schema失败!！',
            type: 'error'
          });
        } else {
          this.$message({
            message: '创建失败，请重试。',
            type: 'error'
          });
        }
      })
    },

    handleDelete() {
      this.dialogDeleteVisible = false
      var res = deleteSchema(this.deleteForm.name)
      res.then((result) => {
        console.log(result.message);
        if (result.status > 0) {
          this.$message({
            message: '删除Schema成功！',
            type: 'success'
          });
          this.handleSchemaListFrash();
        } else if (result.message === "file not exites!") {
          this.$message({
            message: '需要删除文件不存在!',
            type: 'error'
          });
        } else {
          this.$message({
            message: '删除失败，请重试。',
            type: 'error'
          });
        }
      })

    },
    handleImport() {
      if (this.importForm.file === null) {
        return;
      }
      this.dialogImportVisible = false
      console.log(this.importForm.name, this.importForm.file)
      var res = importSchemaFile(this.importForm.name, this.importForm.file);
      res.then((result) => {
        console.log(result.message);
        if (result.status > 0) {
          this.$message({
            message: '导入Schema成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: '导入Schema失败,请重试',
            type: 'error'
          });
        }
      })
    },
    handleSuccess(response, file, fileList) {
      this.file = file.name
    },
    handleSchemaListFrash(){
      var res = getSchemaList();
      res.then(result => {
        console.log(result.data.SchemaInfoList)
        this.schemaList = result.data.SchemaInfoList
      })
    },
    handleEdit(schemaCard){
      this.$router.push({
        name:'SchemaEdit',
        query:{
          schemaName:schemaCard.name
        }
      })
    },
    handleDownload(schemaCard){
      downloadSchema(schemaCard.name)
    }
  },
  mounted() {
      this.handleSchemaListFrash();
    }
}
</script>

<style scoped>
  .el-dialog__header {
    font-weight: 600;
    text-align: left;
  }

  #pageTitle {
    align-self: center;
    font-size: 19px;
    color: #187adf;
    top: 4px;
    padding-bottom: 2px;
    height: 36px;
    position: relative;
  }

  #schemaTitle {
    background-color: aliceblue;
  }

  #warnInfo {
    position: relative;
    left: 0%;
  }
  /* .avatar-uploader{
    display: flex;
      flex-direction: row;
  } */
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
    padding-top: 10px;
    padding-left: 20px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>