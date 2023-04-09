<template>
  <div class="log">
    <el-table
        :data="logTable"
        height="500"
        border
        style="width: 100%"
        :header-cell-style="{background:'#F2F3F5',color:'#1D2129'}"
    >
      <el-table-column
          prop="logId"
          label="logId"
          width="180">
      </el-table-column>
      <el-table-column
          prop="type"
          label="日志类型"
          width="180">
      </el-table-column>
      <el-table-column
          prop="status"
          label="状态">
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开始时间">
      </el-table-column>
      <el-table-column
          prop="endTime"
          label="结束时间">
      </el-table-column>
      <el-table-column
          prop="autoOrManual"
          label="自动/手动">
      </el-table-column>
      <el-table-column
          prop="setting"
          label="操作">
        <template slot-scope="scope">
          <el-button
              @click=""
              type="text"
              style="color: #F53F3F; size: letter">删除</el-button>
          <el-button
              type="text"
              style="color: #1C74F1"
              @click="">详细信息</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Log",
  data(){
    return{
      logTable:[{"logId":"1111","type":"add","status":"finish","startTime":"2022/10/28 10:32","endTime":"2022/10/28 10:34","autoOrManual":"手动","setting":"无需其他操作"}]
    }
  }
}
</script>

<style scoped>
  .log{
    height: 75vh;
  }
</style>