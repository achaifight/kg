<template>
  <div>
    <div style="color: #1D74F1; font-weight: bold; text-align: left; font-size: 14px; margin-left: 16px">图谱构建管理</div>
    <div style="margin-top: 4px; color: #1D2129; font-weight: bold; text-align: left; font-size: 18px; margin-left: 16px; float: left">自定义导入</div>
    <div style="">
      <div style="margin-top: 150px; width: 500px; text-align: left; margin-left: calc(50% - 250px)">
        <div style="display: inline; font-weight: bold; text-align: left; width: 150px">选择导入文件:&nbsp&nbsp&nbsp</div>
        <div style="display: inline; width: 350px">
          <el-input :disabled = "true" v-model = "file.name" style="width: 350px">
            <el-upload action="#" class="avatar-uploader" slot="append" name="files" ref="upload":limit="1" :show-file-list = "false"
                       accept=".zip" :auto-upload="false" :on-change="handleChange" :on-exceed="handleExceed" >
              　　<el-button slot="trigger" icon = "el-icon-folder-add" size="small">选取文件</el-button>
            </el-upload>
          </el-input>
        </div>
      </div>
      <div style="margin-top: 60px">
        <el-button @click="cancel" plain style="color: white; background: #1C74F1; font-weight: bold; margin-right: 33%">Back</el-button>
        <el-button @click="submitUpload" plain style="color: white; background: #1C74F1; font-weight: bold">Next</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getSchemaList } from "@/actions/SchemaActions";
import { uploadTextFile } from "@/actions/TxtProjectAction";
export default {
  name: "Customize",
  data(){
    return{
      active: true,
      importForm:{
        name:'',
        filename:''
      },
      schemaList:[],
      file:{
        name: '',
        raw: null,
        schemaName: ''
      },
    }
  },
  methods:  {
    getSchemaList(){
      getSchemaList().then(response => {
        this.schemaList = response.data.SchemaInfoList
      })
    },
    handleChange(file, fileList){
      console.log(file)
      let isZip = file.name.split('.')[1] === 'zip'
      if (!isZip) {
        this.$message.error({
          message: '只能上传.zip文件'
        });
        return false;
      }
      this.file.name = file.name
      this.file.raw = file.raw
      if (file.raw == null){
        this.file.raw = file;
      }
    },
    handleExceed(files, fileList){
      this.handleChange(files[0], fileList)
    },
    cancel(){
      this.file.name = '';
      this.file.schemaName = '';
      this.file.raw = null;
      if (this.active === false){
        this.active = true;
      }
    },
    submitUpload() {
      if (this.active === false){
        this.active = true;
        return;
      }
      if (this.file.raw == null || this.file.name == '') {
        this.$message.error({
          message: '文件未上传或OWL模型未选择'
        });
        return;
      }
      uploadTextFile(this.file.name, this.file.raw).then(response => {
        if (response.status > 0) {
          this.$message({
            message: '导入包成功',
            type: 'success'
          });
          this.file.name = '';
          this.file.schemaName = '';
          this.file.raw = null;
          this.active = false;
        } else {
          this.$message({
            message: '导入包失败,请重试',
            type: 'error'
          });
        }
      })
    },
  },
  mounted() {
  },
}
</script>

<style scoped>

</style>