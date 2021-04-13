<!--
 * @Descripttion: 
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-12-03 11:48:31
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-12-03 14:02:21
 -->
<template>
  <div class="cesium-tank-list-container">
    <message-layout height="calc(50vh - 45px)" name="存储设备设施">
      <el-table :data="dataList" class="com-map" style="width: 100%" width="338px" ref="singleTables" highlight-current-row height="100%" @cell-click="viewHandle" v-loading="dataListLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column prop="name" label="储罐名称"></el-table-column>
        <el-table-column label="状态" width="70px">
          <template slot-scope="scope">
            <el-tag plain v-if="scope.row.alarm==='0'||!scope.row.alarm" size="mini" type="success">正常</el-tag>
            <el-tag plain v-else size="mini" type="danger">报警</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </message-layout>
  </div>
</template>

<script>
import messageLayout from '../components/messageLayout'
import { translateXyToLnglat } from '@/utils/cesiumMap'
import { tankList } from '@/api/sou/equlpment'
export default {
  inject: ['cesiumMap'], // 多级祖孙传值-接受方
  components: {
    messageLayout
  },
  data () {
    return {
      name: '',
      dataListLoading: false,
      dataList: [],
      base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADHElEQVRIS8WXW0yOYRzAf49QCakvh2IzQiZNE2Ns5MacJ43MIZOxbnIhNxpXjBtccKExTA4Tc5jz3IiNRWVZakLM1sGpEyKRx/7f+7729X6n+tjnufq+9/3/n9/zPz7/V9GNpbUOA+YDc4EUIB6INFVbgRqgDLgN3FRKtfvbVvkS0Fo7gFwgG4hyyjbXwoeX8LXFUO03CAaPgagR1lbNQD6wTynV6G1/r2CtdSawH3DQUAXFJ6HyBrQ2eN4rMhYSF8D0tRA7QWQEukUpVeBJwQ2ste5jnjiLljq4sgMqrvnzXNf3SYtgyU4YNFyeHxOPKaV+uAp1AZvQC8Bint6Ewhxo/9QzqCUdNhAyDsJESQ2uAumucDv4KJDFw1NwYSvoX4FBLS3VC9L3wrQ1TsuVUhv+vLJ+mDE94bS0YP3fQ13hmccty9dZMXdabGZvNS11DvbNDty93vwjbs+9KzGXhEuQbLfAu4FtFGR5T6SIaEicB45REB4JfSMMTEcbfGuFxtdQeQvamjzjJeEyJc/Yo5TKU2ZzqKehKor9qe5KvUNhVT4kLexevCuuw5ls+PndXX5LkZSa1HmcgNOAi1zaBg8kt2xLLBSFvuHdA3d8w2mAeMC+ZmyAtD3ydJmADzk7065kaK13F45wgFidshziZ8LQBBgwBHqFGLK/OuHze3hXDTX3oey8YW2bh6YVGQfby0UrX8CPaK6dyu7Jni2ashLm5MCTK/CmxGiXXz52le0fY7TNkVNh0hK4cxBKz3reL++xtNcSATfyvCiaIyu8gzMOuL+zalxq1b4KN3sHbzwH41KbBPyT8sshnN7UM7CviPsCrz4MyUs7/ys4MFcHarGLq/0nl6cYBwp2SS7f5SRZ/a/AtnLy3UCmZBjXW0+WXKelhX4biMxT3ltmRIzRY0dP7x76VTHOnt9mq3XRdm2Z8l9r7f+SiE2EsbNg2HiQMSe0v3GQ71+McejtM3hxDxoqPR/QfkmYYBnqgn8tmnAZ7oI7CFi+0VoHf/QxrZYJM/jDngtcBvLgjbeu6Rj0gd4GD/4njO0A//yj7Te1S5VQbd9hyAAAAABJRU5ErkJggg=='
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
      this.cesiumMap.$refs.mapShow.flyTo(row.id)
    },
    getDataList () {
      this.dataListLoading = true
      tankList({}).then(({ data }) => {
        if (data && data.code === 0) {
          data.page.list.map(vals => {
            this.showTank(vals, (vals.alarm && vals.alarm !== '0'))
          })
          this.dataList = data.page.list
          this.totalPage = data.page.count
        } else {
          this.dataList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    showTank (tank, alarm = false) { // 在地图上展示储罐 1为启用摄像头跟踪，0为不跟踪
      let t = translateXyToLnglat(tank.positionX, tank.positionY)
      this.cesiumMap.$refs.mapShow.insertOrUpdateObjectLoc(
        'tank',
        tank.id,
        t.x,
        t.y,
        Number(tank.positionZ),
        this.base64,
        tank.name,
        {
          font: '16pt',
          fillColor: 'rgba(255,255,255,1)',
          backgroundColor: 'rgba(0,0,0,0.9)',
          showBackground: true,
          pixeLoffset: [-(tank.name.length / 2) * 16, -25]
        },
        0,
        [18, 18],
        alarm
      )
    }
  }
}
</script>

<style lang="scss">
.cesium-tank-list-container {
}
</style>
