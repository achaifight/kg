<template>
    <div>
        <div>
          <el-dialog class="el-dialog__header" :title="farmeInfo[nowFarme].name" :visible.sync="dialogVisible">
            <el-form :model="farmeInfo[nowFarme]">
                <div class="dialogContainCss" style="display: flex;">
                    <div class="stateDivCss"><label class="labelCss" >当前运行:</label><span class="stateCss" style="color: #1D74F1;">{{farmeInfo[nowFarme].name}}</span></div>
                    <div class="stateDivCss"><label class="labelCss">运行状态:</label><span class="stateCss" style="color: greenyellow;">正常</span></div>
                    <div class="stateDivCss"> <el-link style="color: blue;"> 查看运行日志 </el-link> </div>
                </div>
                <div class="dialogContainCss">
                    <div style="padding: 5px; display: flex; margin-left: 20px;"><label class="labelCss" style="font-size: 15px; font-weight: 400px;">说明:</label><span class="stateCss">该模块主要用于处理用户上传的数据文件。</span> <el-link style="color: blue; margin-left: 50px;"> 说明文件下载 </el-link></div>
                    <div style="padding: 5px; display: flex; margin-left: 20px;"><label class="labelCss" style="font-size: 15px; font-weight: 400px;">对应下游接口:</label><span class="stateCss" style="color: #1D74F1;">知识质量管理，概念质量管理</span></div>
                </div>
                <br/>
              <el-form-item label="容器文件:" :label-width="formLabelWidth">
                <el-input :disabled = "true" v-model = "farmeInfo[nowFarme].packageFileName"  placeholder="容器文件"> 
                <el-upload action="#" class="avatar-uploader" slot="append" name="files" ref="upload" :on-exceed="handlePackageExceed" :limit="1" :show-file-list = "false" :on-change="handlePackageFileChange"
                 accept=".zip" :auto-upload="false" >
                  　　<el-button slot="trigger" icon = "el-icon-folder-add" size="small">选取文件</el-button>
                </el-upload>
                </el-input>
              </el-form-item>
              <el-form-item label="docker文件:" :label-width="formLabelWidth">
                <el-input :disabled = "true" v-model = "farmeInfo[nowFarme].ymlFileName"  placeholder="dockerCompose文件"> 
                <el-upload action="#" class="avatar-uploader" slot="append" name="files" ref="upload" :on-exceed="handleYamlExceed" :limit="1" :show-file-list = "false" :on-change="handleYamlFileChange"
                 accept=".yml" :auto-upload="false" >
                  　　<el-button slot="trigger" icon = "el-icon-folder-add" size="small">选取文件</el-button>
                </el-upload>
                </el-input>
              </el-form-item>
              <!-- <el-form-item label="运行指令:" :label-width="formLabelWidth">
                <el-input type="textarea" style="min-height: 80px;" placeholder="运行指令">
                </el-input>
              </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="handleClose">取 消</el-button>
              <el-button type="primary" @click="handleImportPackageFile">确 定</el-button>
            </div>
          </el-dialog>
        </div>
        <el-row :gutter="20">
            <el-col :span="6">
                <div style="color: #1D74F1; font-weight: bold; text-align: left; font-size: 14px; margin-left: 16px">架构管理页面</div>
                <div style="margin-top: 4px; color: #1D2129; font-weight: bold; text-align: left; font-size: 18px; margin-left: 16px; float: left">服务管理</div>
            </el-col>      
        </el-row>
        <div class="containCss">
            <div class="backCardCss">
                <button class = "buttonCardCss" style="padding: 20px 200px;" @click="handleOpen(0)">数据导入功能</button>
            </div>
            <el-row>
                <el-col :span="10" >
                    <img src="~@/assets/expand-v.svg" style="margin: 3px; width:40px"></img>
                </el-col>
                <el-col :span="10" :offset="4">
                    <img src="~@/assets/expand-v.svg" style="margin: 3px; width:40px"></img>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" >
                    <div class="backCardCss">
                        <button class = "buttonCardCss" @click="handleOpen(1)">知识质量管理</button>
                    </div>
                </el-col>
                <el-col :span="10" :offset="4">
                    <div class="backCardCss">
                        <button class = "buttonCardCss" style="background-color: red;" @click="handleOpen(4)">概念质量管理</button>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" >
                    <img src="~@/assets/expand-v.svg" style="margin: 3px; width:40px"></img>
                </el-col>
                <el-col :span="10" :offset="4">
                    <img src="~@/assets/expand-v.svg" style="margin: 3px; width:40px"></img>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" >
                    <div class="backCardCss">
                        <el-row>
                            <el-col :span="10">
                                <button class = "buttonCardCss" @click="handleOpen(3)">数据查询功能</button>
                            </el-col>
                            <el-col :span="10" :offset="4">
                                <button class = "buttonCardCss" @click="handleOpen(2)">数据编辑功能</button>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="10" :offset="4">
                    <div class="backCardCss">
                        <el-row>
                            <el-col :span="10">
                                <button class = "buttonCardCss" @click="handleOpen(6)">概念查询功能</button>
                            </el-col>
                            <el-col :span="10" :offset="4">
                                <button class = "buttonCardCss" @click="handleOpen(5)" style="background-color: gainsboro;">概念编辑功能</button>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" >
                    <img src="~@/assets/expand-v.svg" style="margin: 3px; width:40px"></img>
                </el-col>
                <el-col :span="10" :offset="4">
                    <img src="~@/assets/expand-v.svg" style="margin: 3px; width:40px"></img>
                </el-col>
            </el-row>
            <div class="basicCardCss">
                基础数据功能
            </div>
        </div>
    </div>
</template>

<script>

import {importDockerFile} from "@/actions/DeployAction/"

export default {
    name:"FarmeWork",
    data(){
        return {
            dialogVisible:false,
            formLabelWidth: '120px',
            importForm:{
                name: '数据导入功能模块',
                file: null,
                fileName:"",
            },
            nowFarme:"knowledgeImportService",
            farmes:["knowledgeImportService","knowledgeQualityService","knowledgeDataService","knowledgeSearchService","ontologyQualityService","ontologyService","ontologySearchService"],
            farmeInfo:{
                knowledgeImportService:{
                    name:"数据导入功能模块",
                    packageFile:null,
                    packageFileName:"",
                    ymlFile:null,
                    ymlFileName:"",
                },
                knowledgeQualityService:{
                    name:"知识质量管理模块",
                    packageFile:null,
                    packageFileName:"",
                    ymlFile:null,
                    ymlFileName:"",
                },
                knowledgeDataService:{
                    name:"知识数据管理模块",
                    packageFile:null,
                    packageFileName:"",
                    ymlFile:null,
                    ymlFileName:"",
                },
                knowledgeSearchService:{
                    name:"知识查询管理模块",
                    packageFile:null,
                    packageFileName:"",
                    ymlFile:null,
                    ymlFileName:"",
                },
                ontologyQualityService:{
                    name:"概念质量管理模块",
                    packageFile:null,
                    packageFileName:"",
                    ymlFile:null,
                    ymlFileName:"",
                },
                ontologyService:{
                    name:"概念内容管理模块",
                    packageFile:null,
                    packageFileName:"",
                    ymlFile:null,
                    ymlFileName:"",
                },
                ontologySearchService:{
                    name:"概念查询管理模块",
                    packageFile:null,
                    packageFileName:"",
                    ymlFile:null,
                    ymlFileName:"",
                },
            }
        }
    },
    methods:{
        handleOpen(index){
            this.handleFrameChange(index)
            this.dialogVisible = true
        },
        handleClose(){
            this.dialogVisible = false
        },
        handleFrameChange(index){
            this.nowFarme = this.farmes[index]
            console.log(this.nowFarme)
        },
        handlePackageFileChange(file, fileList){
            console.log(file)
            let isZip = file.name.split('.')[1] === 'zip'
            if (!isZip) {
                this.$message.error({
                message: '只能上传.zip文件'
                });
                return false;
            }
            this.farmeInfo[this.nowFarme].packageFileName = file.name
            if (file.raw !== null){
                this.farmeInfo[this.nowFarme].packageFile = file.raw
            }
        },
        handlePackageExceed(files, fileList){
            this.handlePackageFileChange(files[0], fileList)
        },
        handleYamlFileChange(file, fileList){
            console.log(file)
            let isZip = file.name.split('.')[1] === 'yml'
            if (!isZip) {
                this.$message.error({
                message: '只能上传.yml文件'
                });
                return false;
            }
            this.farmeInfo[this.nowFarme].ymlFileName = file.name
            if (file.raw == null){
                this.farmeInfo[this.nowFarme].ymlFile = file.raw
            }
        },
        handleYamlExceed(files, fileList){
            this.handleYamlFileChange(files[0], fileList)
        },
        handleImportPackageFile(){
            let dockerFile = this.farmeInfo[this.nowFarme].packageFile
            let serviceName = this.nowFarme
            let yamlFile = this.farmeInfo[this.nowFarme].yamlFile
            importDockerFile(serviceName,dockerFile, yamlFile).then(response => {
            if (response.status > 0) {
            this.$message({
                message: '导入包成功',
                type: 'success'
            });
            this.dialogVisible = false;
            } else {
            this.$message({
                message: '导入包失败,请重试',
                type: 'error'
            });
            }
            })
        }
    }

}
</script>

<style scoped>

    .el-dialog__header{
        text-align: left;
        border-radius: 5px;
        font-size: 30px !important;
        font-weight: 600;
    }

    .dialogContainCss{
        margin: 10px ;
    }

    .stateDivCss{
        padding: 10px;
        margin: 10px;
    }

    .labelCss{
        font-size: 18px;
        vertical-align: middle;
        font-weight: 600;
    }

    .stateCss{
        margin-left: 10px;
        font-size: 16px;
        vertical-align: middle;
        font-weight: 400;
    }

    .containCss{
        background-color: #F0F0F0;
        padding: 10px;
        margin-top: 20px;
    }

    .backCardCss{
        /*矩形 2*/

        left: 0px;
        top: 0px;
        width: auto;
        height: 100px;
        opacity: 1;
        background: rgba(153, 228, 255, 1);

    }

    .basicCardCss{
        left: 0px;
        top: 0px;
        width: auto;
        height: 110px;
        opacity: 1;
        background: rgba(153, 228, 255, 1);
        font-size: 20px;
        vertical-align: middle;
        font-weight: 600;
        letter-spacing: 0px;
        line-height: 110px;
        color: rgb(0, 0, 0);
        text-align: center;
    }

    .buttonCardCss{
        /*矩形*/
    left: 1px;
    top: 0px;
    width: auto;
    height: 56px;
    opacity: 1;
    border-radius: 2px;
    margin: auto;
    margin-top: 20px;
    background: rgba(163, 255, 163, 1);
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);

    /** 文本1 */
    font-size: 18px;
    vertical-align: middle;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 0px;
    color: rgba(0, 0, 0, 1);
    text-align: center;
    
    padding: 10px 20px;

    border: 0px;
    }
</style>
