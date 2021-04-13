<!--
 * @Descripttion: 
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-12-03 11:29:06
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-12-03 11:32:23
 -->
<template>
  <div class="cesium-high-risk-tech-container">
    <message-layout height="calc(50vh - 45px)" name="危险化工工艺">
      <el-table :data="dataList" class="com-map" style="width: 100%" width="338px" ref="singleTables" highlight-current-row height="100%" v-loading="dataListLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column prop="name" label="工艺名称"></el-table-column>
        <el-table-column prop="typeEntity.name" label="工艺类型"></el-table-column>
      </el-table>
    </message-layout>
  </div>
</template>

<script>
import messageLayout from '../components/messageLayout'
import { highRiskProcessList } from '@/api/sou/highRisk'
export default {
  components: {
    messageLayout
  },
  data () {
    return {
      name: '',
      dataListLoading: false,
      dataList: []
    }
  },
  created () {
    this.getDataList()
  },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    // 点击区域table单行
    viewHandle (row) {
      // this.$emit('handleClick', 'view', row)
      this.showTank(row)
    },
    getDataList () {
      this.dataListLoading = true
      highRiskProcessList({}).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
        } else {
          this.dataList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
.cesium-high-risk-tech-container {
}
</style>
