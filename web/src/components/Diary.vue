<template>
  <div>
    <div style="color: #1D74F1; font-weight: bold; text-align: left; font-size: 14px; margin-left: 16px">系统日志管理</div>
    <div style="color: #1D2129; font-weight: bold; text-align: left; font-size: 18px; margin-left: 16px">图谱日志</div>
    <div style="text-align: right; margin-right: 16px">
      <div style="display: inline-block; font-size: 16px; font-weight: bold">类型选择:&nbsp&nbsp&nbsp</div>
      <el-select v-model="value" placeholder="请选择">
        <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
    </div>
    <el-table
        :data="tableData"
        :header-cell-style='{"text-align": "center", "background-color": "#E7E7E7", "color": "#1D2129", "font-size": "14px", "font-weight": "bold"}'
        :cell-style= '{"text-align": "center", "color": "#1D2129", "font-size": "14px", "font-weight": "bold"}'
        style="width: calc(100% - 32px); margin-left: 16px; margin-top: 10px">
      <el-table-column
          prop="log_id"
          label="日志ID">
      </el-table-column>
      <el-table-column
          prop="log_type"
          label="日志类型">
      </el-table-column>
      <el-table-column
          prop="status"
          label="状态">
      </el-table-column>
      <el-table-column
          prop="start_time"
          label="开始时间">
      </el-table-column>
      <el-table-column
          prop="end_time"
          label="结束时间">
      </el-table-column>
      <el-table-column
          prop="manual_or_auto"
          label="自动/手动">
      </el-table-column>
      <el-table-column
          prop="operation"
          label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="14px" style="color: #1C74F1; font-weight: bold">详细信息</el-button>
          <el-button type="text" size="14px" style="color: #F53F3F; font-weight: bold">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getLog} from "@/actions/LogProjectAction";

export default {
  name: "Diary",
  data(){
    return{
      options: ["导入schema", "导出schema", "创建schema", "删除schema", "创建映射规则", "导入半结构化数据", "导入非结构化数据"],
      value: '',
      tableData: [{
        "log_id": "2210281756",
        "log_type": "创建schema",
        "status": "已完成",
        "start_time": "2022-10-28 17:56",
        "end_time": "2022-10-28 18:34",
        "manual_or_auto": "手动",
      },
        {
          "log_id": "2211052144",
          "log_type": "创建映射规则",
          "status": "已完成",
          "start_time": "2022-11-05 21:44",
          "end_time": "2022-11-05 21:49",
          "manual_or_auto": "手动",
        },
        {
          "log_id": "2210281756",
          "log_type": "导入半结构化数据",
          "status": "已完成",
          "start_time": "2022-11-13 12:08",
          "end_time": "2022-11-13 12:08",
          "manual_or_auto": "手动",
        }
      ],
    }
  },
  methods: {
    handleClick(){
      console.log()
    },
    getLogs(){
      getLog().then(response => {
        this.tableData = response.data
      })
    },
  },
  mounted() {
    this.getLogs()
  }
}
</script>

<style scoped>

</style>