<template>
  <div>
    <el-row class="progress">
      <div>
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="Step 1" description="建立sql连接"></el-step>
          <el-step title="Step 2" description="映射实体表"></el-step>
          <el-step title="Step 3" description="映射关系表"></el-step>
          <el-step title="Step 4" description="提交"></el-step>
        </el-steps>
      </div>
      <div v-show="active == 0">
        <el-row :gutter="20"></el-row>
        <el-row :gutter="20">
          <el-col :span="10" :offset="3">
            <el-input v-model="input1" placeholder="input sql link"></el-input>
          </el-col>
          <el-col :span="5" :offset="3">
            <span>OWL模型：</span>
            <el-select placeholder="Schema File" v-model="file.schemaName">
              <el-option
                  v-for="item in schemaList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-button class="next" type="primary" @click="next">下一步</el-button>
        </el-row>
      </div>
      <div v-show="active == 1">
        <el-row>
          <el-col :span="3" :offset="2">
            <el-select v-model="csvName1">
              <el-option
                  v-for="item in csvList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button type="danger">{{"是否映射"}}</el-button>
          </el-col>
          <el-col :span="2" :offset="11">
            <el-button type="danger" @click="">全部重置</el-button>
          </el-col>
          <el-col :span="1">
            <el-button type="success" @click="">保存</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="19" :offset="2">
            <el-table
                :data="entityTable"
                :border="true"
                style="width: 100%"
                max-height="250">
              <el-table-column
                  fixed
                  prop="name"
                  label="列名"
                  width="200">
              </el-table-column>
              <el-table-column
                  prop="type"
                  label="类型"
              >
              </el-table-column>
              <el-table-column
                  prop="schema_name"
                  label="schema元素名称"
              >
              </el-table-column>
              <el-table-column
                  prop="is_composite_element"
                  label="复合元素"
              >
              </el-table-column>
              <el-table-column
                  prop="status"
                  label="状态"
              >
              </el-table-column>
              <el-table-column
                  fixed="right"
                  label="操作"
                  width="210">
                <template slot-scope="scope">
                  <el-button
                      @click=""
                      type="danger"
                      size="mini">重置</el-button>
                  <el-button
                      type="primary"
                      size="mini"
                      @click="">映射</el-button>
                  <el-button
                      size="mini"
                      type="warning"
                      @click="">条件</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button type="primary" @click="next">下一步</el-button>
          </el-col>
        </el-row>
      </div>
      <div v-show="active == 2">
        <el-row>
          <el-col :span="3" :offset="2">
            <el-select v-model="csvName2" @change="">
              <el-option
                  v-for="item in csvList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button type="danger">是否映射</el-button>
          </el-col>
          <el-col :span="2" :offset="9">
            <el-button type="primary" @click="relationRow.dialogVisible = true">映射添加</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="danger" @click="">全部删除</el-button>
          </el-col>
          <el-col :span="1">
            <el-button type="success" @click="">保存</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="19" :offset="2">
            <el-table
                :data="relationTable"
                :border="true"
                style="width: 100%"
                max-height="250">
              <el-table-column
                  fixed
                  prop=""
                  label="domain"
                  width="200">
              </el-table-column>
              <el-table-column
                  prop=""
                  label="关系列">
              </el-table-column>
              <el-table-column
                  prop=""
                  label="range">
              </el-table-column>
              <el-table-column
                  label="关系域">
                <template slot-scope="scope">
                  <el-select v-model="temp">
                    <el-option
                        v-for="item in relationTable[scope.$index].关系域"
                        :key="item.name"
                        :label="item.name+':'+item.key"
                        :value="item.name+':'+item.key">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  fixed="right"
                  label="操作"
                  width="80">
                <template slot-scope="scope">
                  <el-button
                      @click.native.prevent=""
                      type="danger"
                      size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button type="primary" @click="next">下一步</el-button>
          </el-col>
        </el-row>
      </div>
      <div v-show="active == 3">
        <el-button type="primary" @click="">提交</el-button>
      </div>
    </el-row>
    <div>
      <el-dialog title="映射添加" :visible.sync="relationRow.dialogVisible" width="30%" :before-close="handleClose">
        <el-row>
          <el-col :span="4" :offset="5">domain:</el-col>
          <el-col :span="10">
            <el-select v-model="relationRow.rowData.domain">
              <el-option
                  v-for="item in relationMapping.options"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select></el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :offset="5">关系列:</el-col>
          <el-col :span="10">
            <el-select v-model="relationRow.rowData.关系列">
              <el-option
                  v-for="item in relationMapping.options"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :offset="5">range:</el-col>
          <el-col :span="10">
            <el-select v-model="relationRow.rowData.range">
              <el-option
                  v-for="item in relationMapping.options"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :offset="5">关系域:</el-col>
          <el-col :span="10">
            <el-select v-model="relationRow.options" multiple @change="">
              <el-option
                  v-for="item in entityMapping.options['relation']"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13" :offset="6">
            <el-table :data="relationRow.rowData.关系域" :border="true" max-height="100">
              <el-table-column
                  prop="name"
                  label="关系名">
              </el-table-column>
              <el-table-column
                  prop="key"
                  label="对应字符">
                <template slot-scope="scope">
                  <el-input v-model="relationRow.rowData.关系域[scope.$index].key" size="mini"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="relationRow.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContinuousData",
  data() {
    return {
      active: 0,
      file:{
        name: '',
        raw: null,
        schemaName: ''
      },
      schemaList: [{"name":"1"}],
      csvList: [{
        "name": '1',
      }, {
        "name": '2',
      },],
      csvName1: '',
      csvName2: '',
      entityTable: [{"name":"1", "type":"2", "schema_name":"3", "is_composite_element":"False", "status":""}],
      relationTable: [],
      relationRow:{
        dialogVisible: false,
        rowData:{
          domain: '',
          关系列: '',
          range: '',
          关系域: [],
        },
        options: []
      },
      relationMapping:{
        type: 'danger',
        status: '未映射',
        options: []
      },
      entityMapping:{
        type: 'danger',
        status: "未映射",
        options: [],
      },
    }
  },
  methods:{
    next() {
      if (this.active++ > 3) this.active = 0;
    }
  }
}
</script>

<style scoped>
.el-col{
  margin-top: 5vh;
  /*background: blue;*/
}
.next{
  margin-top: 5vh;
}
</style>