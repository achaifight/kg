<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div id="schemaTitle" class="grid-content bg-purple"><span id="pageTitle">Schema细化</span></div>
      </el-col>
      <el-col :span="6" :offset="8">
        <div class="grid-content bg-purple">
          <el-input placeholder="请输入内容" prefix-icon="el-icon-search"></el-input>
        </div>
      </el-col>
      <el-col :span="2">
        <div>
          <el-button type="primary" @click="dialogBuildVisible = true">新建</el-button>
          <el-dialog title="新建Schema" :visible.sync="dialogBuildVisible" width="40%" @close="handleClose">
            <el-form :model="schemaCard" :rules="rules" ref="schemaCard" label-width="180px" >
              <el-form-item label="请选择版本：" label-width="auto">
                <el-select v-model="schemaCard.version" placeholder="请选择">
                  <el-option
                      v-for="(item, index) in schemaList"
                      :key="index"
                      :label="item"
                      :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogBuildVisible = false">取 消</el-button>
              <el-button type="primary" @click="handBuild">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <div>
          <el-dialog title="删除Schema" :visible.sync="dialogDeleteVisible" width="40%">
            <span style="font-size: 20px; color:red">您确定要删除Schema[{{ schemaCard.version }}]吗？删除后无法复原！</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogDeleteVisible = false">取 消</el-button>
              <el-button type="primary" @click="identityDelete">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </el-col>
      <el-col :span="2">
        <el-button type="success" @click="handleMerge">合并</el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-scrollbar style="height: 55vh"  wrap-style="overflow-x:hidden;">
      <el-row>
        <el-col :span="6" v-for="(item, index) in schemaList" :key="index">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <div style="padding: 14px;">
              <div class="bottom clearfix">
                <el-button-group>
                  <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(item)"></el-button>
                  <el-button type="primary" icon="el-icon-close" size="small" @click="handleDelete(item)"></el-button>
                </el-button-group>
              </div>
              <br></br>
              <span>{{ item }}</span><br></br>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script>
import {
  createSchema, deleteProject,
  deleteSchema,
  downloadSchema, getNewSchemaName,
  getProjectNameList,
  getSchemaList,
  importSchemaFile, mergeSchema
} from "@/actions/SchemaActions";

export default {
  name: "Specify",
  data() {
    return {
      schemaList: [],
      dialogBuildVisible: false,
      schemaCard: {
        version: '',
      },
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
    handleImportBegin(SchemaCard) {
      this.dialogImportVisible = true,
          this.importForm = { name: SchemaCard.name, file: null,fileName:"" }
    },
    handleDelete(item) {
      this.dialogDeleteVisible = true
      this.schemaCard.version = item
    },
    handBuild() {
      this.dialogBuildVisible = false
      getNewSchemaName(this.schemaCard.version).then(response => {
        console.log(response.message);
        if (response.status > 0) {
          this.$message({
            message: '创建Schema成功!',
            type: 'success'
          });
          this.$refs.schemaCard.resetFields()
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
    identityDelete() {
      this.dialogDeleteVisible = false
      deleteProject(this.schemaCard.version).then(response => {
        if (response.status > 0) {
          this.$message({
            message: '删除Schema成功！',
            type: 'success'
          });
          // this.$refs.schemaCard.resetFields()
          console.log(this.schemaCard)
          this.init();
        } else if (response.message === "file not exites!") {
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
    init(){
      getProjectNameList().then(result => {
        this.schemaList = result.data
      })
    },
    handleEdit(schemaCard){
      this.$router.push({
        name:'SchemaSpecify',
        query:{
          schemaName:schemaCard
        }
      })
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
    }
  },
  mounted() {
    this.init();
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