<template>
  <div class="company-info">
    <div class="header flex">
      <span>河北中煤旭阳焦化有限公司</span>
      <div class="flex">
        <span>完善度:</span>
        <el-progress :percentage="50" class="progress"></el-progress>
      </div>
    </div>
    <div class="body">
      <el-row class="table">
        <div v-for="(item,index) in dataTable" :key="index">
          <el-col :span="6" class="td bgcolor">
            <span>{{item.key}}</span>
          </el-col>
          <el-col :span="item.span" class="td">
            <span>{{item.value}}</span>
          </el-col>
        </div>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dataTable: [
        { key: '法定代表人', value: '刘生', span: 6 },
        { key: '手机号', value: '-', span: 6 },
        { key: '营业期限', value: '2008-10-22至2022-10-19', span: 6 },
        { key: '统一社会信用代码', value: '91139521755488392XG', span: 6 },
        { key: '邮政编码', value: '014300', span: 6 },
        { key: '成立日期', value: '2008-10-20', span: 6 },
        { key: '经济类型', value: '国有企业', span: 6 },
        { key: '注册资本(万元)', value: '10000', span: 6 },
        { key: '企业规模', value: '中型', span: 6 },
        { key: '生产经营场所面积(m2)', value: '863765', span: 6 },
        { key: '应缴纳工伤保险员工人数(人)', value: 0, span: 6 },
        { key: '实际缴纳员工人数(人)', value: 0, span: 6 },
        { key: '固定资产(万元)', value: 0, span: 6 },
        { key: '年营业收入(万元)', value: 0, span: 6 },
        { key: '经度', value: '114.5536', span: 6 },
        { key: '纬度', value: '37.1676', span: 6 },
        { key: '登录注册类型', value: '其他有限责任公司', span: 18 },
        { key: '公司地址', value: '邢台县十向西村', span: 18 }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.company-info {
  .flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .header {
    .progress {
      width: 300px;
    }
  }
  .body {
    margin-top: 10px;
    .table {
      border: 1px solid #ebeef5;
      border-bottom: 0;
      .td {
        padding: 10px 0 10px 20px;
        border-bottom: 1px solid #ebeef5;
      }
      .bgcolor {
        background: #e9f8ff;
      }
    }
  }
}
</style>