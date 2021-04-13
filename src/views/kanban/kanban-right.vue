<template>
  <!-- 看板 -->
  <div class="kanban-right">
    <el-row>
      <!-- 系统日志 -->
      <el-col :span="24">
        <div class="kanban-right-first">
          <p class="kanban-title"
             @click="kanbanSystem(0)">安全分区风险驾驶舱</p>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="kanban-right-second">
          <p class="kanban-title"
             @click="kanbanSystem(1)">企业生产全流程驾驶舱</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  created () {
  },
  methods: {
    kanbanSystem () {
      this.$router.push('/crew-position-cockpit')
    }
  }
}
</script>
<style lang='scss' scoped>
.kanban-right {
  position: absolute;
  right: 0;
  width: 33%;
  padding: 20px;
  z-index: 10;
  .kanban-right-first,
  .kanban-right-second {
    padding-top: 4px;
    padding-left: 10px;
    height: 46vh;
    background: linear-gradient(rgba(10, 25, 56, 0.6), rgba(18, 48, 104, 0.1));
    border-radius: 4px;
  }
}
.kanban-title {
  border-left: 3px solid #3cc5bd;
  color: #3cc5bd;
  text-align: left;
  padding-left: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}
</style>