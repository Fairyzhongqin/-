<template>
  <el-dialog title="具体信息" :close-on-click-modal="false" width="540px" :visible.sync="visible" class="detail-style">
    <el-row>
      <el-col>
        风险点类型：{{rangeTypeName | matchType(rangeTypeList)}}
        <!-- {{matchTypeRangeName(rangeTypeName)}} -->
      </el-col>
      <el-col>
        所属区域：{{zoneName}}
      </el-col>
      <el-col>
        可能发生的风险类型：{{factorMainNameList}}
      </el-col>
      <el-col :span="7">
        主要风险危害因素：
      </el-col>
      <el-col :span="17">
        <p v-for="item in factorDangerList" :key="item.id">{{item}}</p>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getLabels } from '@/api/common/sys'

export default {
  data () {
    return {
      visible: false,
      rangeTypeName: '',
      zoneName: '',
      rangeTypeList: [],
      factorMainNameList: '',
      factorDangerList: ''
    }
  },
  created () {
    this.getRiskPoinType()
  },
  methods: {
    init (info) {
      this.visible = true
      console.log(info)
      this.$nextTick(() => {
        this.rangeTypeName = info.rangeType
        this.zoneName = info.zoneName
        this.factorMainNameList = this.handle(info.factorList)
        this.factorDangerList = this.handleDanger(info.factorList)
      })
    },
    // 从字典表获取风险点类型
    getRiskPoinType () {
      getLabels({
        type: 'RANGE_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log('lec', data.list)
          this.rangeTypeList = data.list
          console.log(this.rangeTypeList)
        }
      })
    },
    handle (val) {
      if (val.length > 0) {
        let factorMainNameList = []
        val.map(item => {
          if (factorMainNameList.indexOf(item.factorMainName) === -1) {
            factorMainNameList.push(item.factorMainName)
          }
        })
        return factorMainNameList.join(',')
      } else {
        return '暂无'
      }
    },
    handleDanger (val) {
      if (val.length > 0) {
        let factorDangerList = []
        val.map(item => {
          if (factorDangerList.indexOf(item.factorDangerList) === -1) {
            factorDangerList.push(item.factorDanger)
          }
        })
        factorDangerList = factorDangerList.map((item, index) => {
          item = (index + 1) + '.' + item
          return item
        })
        return factorDangerList
      } else {
        return '暂无'
      }
    }
    // matchTypeRangeName (val) {
    //   let rangeTypeName = ''
    //   this.rangeTypeList.map(item => {
    //     if (item.label === val) {
    //       rangeTypeName = item.value
    //     }
    //     return rangeTypeName
    //   })
    // }
  },
  filters: {
    matchType (type, value) {
      let typeName = ''
      value.map(item => {
        if (item.label === type) {
          typeName = item.value
        }
      })
      return typeName
    }
  }
}
</script>
<style lang="scss">
.detail-style {
}
</style>
