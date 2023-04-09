<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div style="color: #1D74F1; font-weight: bold; text-align: left; font-size: 14px; margin-left: 16px">图谱内容管理</div>
        <div style="margin-top: 4px; color: #1D2129; font-weight: bold; text-align: left; font-size: 18px; margin-left: 16px; float: left">知识图谱可视化</div>
      </el-col>
      <el-col :span="6" :offset="10">
        <div class="grid-content bg-purple">
          <el-input placeholder="请输入内容" prefix-icon="el-icon-search"></el-input>
        </div>
      </el-col>
      <el-col :span="1.5">
        <div class="grid-content bg-purple">
          <el-button type="primary" @click="">新建</el-button>
          <el-dialog title="新建知识图谱项目" :visible.sync="dialogBuildVisible" width="40%" @close="handleClose">
            <el-form :model="buildForm" :rules="rules" ref="buildForm" label-width="120px" class="demo-ruleForm">
              <el-form-item label="Project Name" prop="name">
                <el-input v-model="buildForm.name"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogBuildVisible = false">取 消</el-button>
              <el-button type="primary" @click="handBuild">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <div>
          <el-dialog title="删除Project" :visible.sync="dialogDeleteVisible" width="40%">
            <span style="font-size: 20px; color:red">您确定要删除Project[{{ deleteForm.name }}]吗？删除后无法复原！</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogDeleteVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleDelete">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <div>
          <el-dialog title="导入Project" :visible.sync="dialogImportVisible">
            <el-form :model="importForm">
              <el-form-item id="warningInfo">
                <span :style="{ color: 'red', 'font-size': '16px' }">注意！导入的Project文件将覆盖原有Project内容！</span>
              </el-form-item>
              <el-form-item label="Project Name" :label-width="formLabelWidth">
                <el-input :disabled="true" placeholder="Project Name" v-model="importForm.name" autocomplete="off">
                </el-input>
              </el-form-item>
              <el-form-item label="Project File" :label-width="formLabelWidth">
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
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-scrollbar style="height: 55vh"  wrap-style="overflow-x:hidden;">
      <el-row>
        <el-col :span="6" v-for="(projectCard, index) in projectList" :key="projectCard.name">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <div style="padding: 14px;">
              <div class="bottom clearfix">
                <el-button-group>
                  <el-button type="primary" icon="el-icon-upload2" size="small" @click="handleImportBegin(projectCard)">
                  </el-button>
                  <el-button type="primary" icon="el-icon-download" size="small" @click="handleDownload(projectCard)"></el-button>
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
</template>

<script>
import { createSchema, deleteSchema, importSchemaFile,downloadSchema } from "@/actions/SchemaActions";
import { getProjectList } from "@/actions/GraphProjectAction"

export default {
  name: "GraphProjects",
  data() {
    return {
      projectList: [],
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
    handleClose() {
      this.$refs.buildForm.resetFields()
    },
    handleImportBegin(ProjectCard) {
      // this.dialogImportVisible = true,
      // this.importForm = { name: ProjectCard.name, file: null,fileName:"" }
    },
    handleDeleteBegin(ProjectCard) {
      // this.dialogDeleteVisible = true,
      // this.deleteForm = { name: ProjectCard.name, filePath: ProjectCard.info }
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
      var res = createSchema(this.buildForm.name)
      res.then((result) => {
        console.log(result.message);
        if (result.status > 0) {
          this.$message({
            message: '创建Project成功',
            type: 'success'
          });
          this.handleProjectListFrash();
        } else if (result.message === "file already exites!") {
          this.$message({
            message: '创建Project失败，请检查是否存在重复Project！',
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
          this.handleProjectListFrash();
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
            message: '导入Project成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: '导入Project失败,请重试',
            type: 'error'
          });
        }
      })
    },
    handleSuccess(response, file, fileList) {
      this.file = file.name
    },
    handleProjectListFrash(){
      var res = getProjectList();
      res.then(result => {
        console.log(result.data.projectInfoList)
        this.projectList = result.data.projectInfoList
      })
    },
    // handleEdit(projectCard){
    //   this.$router.push({
    //     name:'SchemaEdit',
    //     query:{
    //       projectName:projectCard.name
    //     }
    //   })
    // },
    handleDownload(projectCard){
      // downloadProject(projectCard.name)
    }
  },
  mounted() {
      this.handleProjectListFrash();
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

  #projectTitle {
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