<template>
  <!-- 看板 -->
  <div class="kanban-left">
    <el-row>
      <el-col :span="24">
        <div class="kanban-left-second">
          <kanbanLeftSecond />
        </div>
      </el-col>
      <el-col :span="24">
        <div class="kanban-left-third">
          <kanbanLeftHazards />
        </div>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import kanbanLeftSecond from './components/kanban-left-second'
import kanbanLeftHazards from './components/kanban-left-hazards'
export default {
  data () {
    return {
      dataList: [{ lable: 860, icon: 'el-icon-user-solid', value: '访客总数' }, { lable: 143, icon: 'el-icon-tickets', value: '作业总数' }, { lable: 232, icon: 'el-icon-error', value: '报警总数' }]
    }
  },
  components: { kanbanLeftSecond, kanbanLeftHazards },
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
.kanban-left {
  .kanban-left-third {
    position: absolute;
    width: 100%;
    padding-top: 20px;
  }
}
// .kanban-title {
//   border-left: 3px solid #3cc5bd;
//   color: #3cc5bd;
//   text-align: left;
//   padding-left: 10px;
//   font-size: 16px;
//   font-weight: 500;
//   cursor: pointer;
// }
</style>