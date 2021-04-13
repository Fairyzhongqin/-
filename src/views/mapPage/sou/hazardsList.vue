<!--
 * @Descripttion: 
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-12-03 10:46:47
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-12-03 14:16:03
 -->
<template>
  <div class="cesium-hazards-list-container">
    <message-layout height="calc(50vh - 45px)" name="重大危险源">
      <el-table :data="dataList" class="com-map" style="width: 100%" width="338px" ref="singleTables" highlight-current-row height="100%" @current-change="handleCurrentChange" v-loading="dataListLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column prop="businessName" label="危险源名称"></el-table-column>
        <el-table-column label="危险等级" width="70px">
          <template slot-scope="scope">
            {{scope.row.level | formatType(levelList)}}
          </template>
        </el-table-column>
      </el-table>
    </message-layout>
  </div>
</template>

<script>
import messageLayout from '../components/messageLayout'
import { translateXyToLnglat, getPointer } from '@/utils/cesiumMap'

import { dangerSourceList } from '@/api/sou/baseInfo'
// import { ZoneInfo } from '@/api/pos/region'
// import { tankInfo, reactorInfo } from '@/api/sou/equlpment'
import { dangerSource } from '@/api/cesiumMap'
export default {
  inject: ['cesiumMap'], // 多级祖孙传值-接受方
  props: {
    value: {
      type: Boolean,
      default: false

    }
  },
  components: {
    messageLayout
  },
  data () {
    return {
      dataList: [], // 表格数据更新
      typeList: [{
        value: '0',
        label: '库区'
      }, {
        value: '1',
        label: '库房'
      }, {
        value: '2',
        label: '生产场所'
      }, {
        value: '3',
        label: '罐区'
      }, {
        value: '4',
        label: '储罐'
      }, {
        value: '5',
        label: '反应装置'
      }],
      levelList: [{
        value: '0',
        label: '一级'
      }, {
        value: '1',
        label: '二级'
      }, {
        value: '2',
        label: '三级'
      }, {
        value: '3',
        label: '四级'
      }],
      icons: {
        tank: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADHElEQVRIS8WXW0yOYRzAf49QCakvh2IzQiZNE2Ns5MacJ43MIZOxbnIhNxpXjBtccKExTA4Tc5jz3IiNRWVZakLM1sGpEyKRx/7f+7729X6n+tjnufq+9/3/n9/zPz7/V9GNpbUOA+YDc4EUIB6INFVbgRqgDLgN3FRKtfvbVvkS0Fo7gFwgG4hyyjbXwoeX8LXFUO03CAaPgagR1lbNQD6wTynV6G1/r2CtdSawH3DQUAXFJ6HyBrQ2eN4rMhYSF8D0tRA7QWQEukUpVeBJwQ2ste5jnjiLljq4sgMqrvnzXNf3SYtgyU4YNFyeHxOPKaV+uAp1AZvQC8Bint6Ewhxo/9QzqCUdNhAyDsJESQ2uAumucDv4KJDFw1NwYSvoX4FBLS3VC9L3wrQ1TsuVUhv+vLJ+mDE94bS0YP3fQ13hmccty9dZMXdabGZvNS11DvbNDty93vwjbs+9KzGXhEuQbLfAu4FtFGR5T6SIaEicB45REB4JfSMMTEcbfGuFxtdQeQvamjzjJeEyJc/Yo5TKU2ZzqKehKor9qe5KvUNhVT4kLexevCuuw5ls+PndXX5LkZSa1HmcgNOAi1zaBg8kt2xLLBSFvuHdA3d8w2mAeMC+ZmyAtD3ydJmADzk7065kaK13F45wgFidshziZ8LQBBgwBHqFGLK/OuHze3hXDTX3oey8YW2bh6YVGQfby0UrX8CPaK6dyu7Jni2ashLm5MCTK/CmxGiXXz52le0fY7TNkVNh0hK4cxBKz3reL++xtNcSATfyvCiaIyu8gzMOuL+zalxq1b4KN3sHbzwH41KbBPyT8sshnN7UM7CviPsCrz4MyUs7/ys4MFcHarGLq/0nl6cYBwp2SS7f5SRZ/a/AtnLy3UCmZBjXW0+WXKelhX4biMxT3ltmRIzRY0dP7x76VTHOnt9mq3XRdm2Z8l9r7f+SiE2EsbNg2HiQMSe0v3GQ71+McejtM3hxDxoqPR/QfkmYYBnqgn8tmnAZ7oI7CFi+0VoHf/QxrZYJM/jDngtcBvLgjbeu6Rj0gd4GD/4njO0A//yj7Te1S5VQbd9hyAAAAABJRU5ErkJggg==',
        device: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAErUlEQVRIS72Xa0ybVRjH/6cXaAuUQrkNB87hIBLGMhBwwywkC8gM2xj4ATWZ2YzJNLoPM1Fn4lc1Ji66mEhMdGGJOBOdF7KxS8zGBsSBoOJkwmQqsNEBpS+UXnnLMc/blvbt23bDGM63nvd5zu881/OU4T4W51wHYBeAOgDlAAoApAZU5wGMARgAcAFAJ2PMfa9jWTwBzrkZwKsADgFII1mHIMI+I8LrWpZUE/QqpGRqkGTSBI+yAWgF8D5jzBrr/Jhgzvl+AMcAmAWLF2N9DkwOu+Ba8EU9S29UY32xHgWVSTDlJJAMQY8wxk5GU1CAOefawI0POgURP58VMHHddS/Pyb7nleix9UkTDH4vfEYeY4wthQvJwAHo1wB2Tw47ce2rOSy5+aqgQWGtjqHqqXSsLzbQVgeA5nB4JPhTAAfH+hfR/60N+G/M0EUZUNGYhoKKZMlyxtjzwY8r4EBM28jS7s+tK9C8zTowBlj+9MDrjH4TTQIDUyG6dxjw+LPmoOXPBWMugQPZO+IURHPncUvoAAY0vp4lXfJquw3WcVmYpP2iagO2PJEiXe6Pbid+PW9XhIbcvutwDsWcEq6Isj0IfhvA0Z722VUlUoKBofFoFlSqUMQ6P5zF/LSogFPCVT+TQfvvMMbeZIHmcEeweNPOHb8rU9AbVdgbsLj3lIDx3+R9IdmsRsORTJnOxVYrrBNKz5BQ/eFsKjWq81wC7wNweuB7G27+uCg7hOJmMKqlPY9zGaI3FOOUDDXqXjJDm6ha0bk75sGlE7GTctNjySjfI/WhJgJ/THX23bt3FM3BmKlGVbNJOnik14HxoZDFaQ9oUPdiBlzzPvR+KUCtZZi+5QWPUwnUZPa+kUvHtRK4zyGIFR3vTSnikrlBi50vUNcEhi7aMXzZIZOhi3mcHB6Hv33ez9r92jpqr/0EtlpuutMvn5hR6OUWJWLHfsk1GO5axNCFRTyyIwnrChMVsoNnFiBMKZMqUrDmQCZyNunmCCyODznVvaeU/ZxquLrF7+qxfid+OWfHo3uMeHCLXgG+ctKGmX+8WBY5fHH421vMyC81+OKCN5brUdnkf/1mJ7z4e9CNDVt1yMiXHgHZGulxwD7rgyaRSa7/azB6fw8Hx3R14TYDyhqMEmDiuhs9Xwioak7FQ2VKi7va5jA16kWCnqFkZzJuXHHAtaCMfbirYyZXcU0SSmtTJPDUqAddbTZsbzEhfzPNBfLV3W6TLK5/2QwWaCh938zj1k9yy8OTK2Y5ldYmo7hGavBS/H74ZA41B9KQ87AyuQY6FjB3ewm1h/xVQIsSbrTXufI7spxiNpCyhhQUbkuSFG1TSzj/kRX1r5hhyqEnW75uXHVg8nd3XHBkAyG/RW2ZlU1GbCyX3lPYrSLOHJtF81tZ0OpC3SqIJyjB41ksa5mkyDmP+khUP21CXok/ni67D2c/IHC2wlraWJgWce30fEyw4pEIgCkwimcxNVuDRIPfuuVlDtvtJZjzlKUU/C5YRKTnhsJAXqLMjvksBuA03CkGgajmrWYz3iAQPIdzvvajT8Bq8tPaD3thcBrI1268DQ/dmg/0EfC1/wsTcYH//U/bvwvzdV9s5PQkAAAAAElFTkSuQmCC'
      },
      openedCache: null, // 缓存点击的危险源
      dataListLoading: false
    }
  },
  created () {
    this.init()
  },
  methods: {
    // 页面初始化
    async init () {
      this.dataListLoading = true
      await dangerSourceList({
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
        } else {
          this.dataList = []
          this.totalPage = 0
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
      this.dataListLoading = false
    },
    // 点击展示危险源
    handleCurrentChange (item) {
      if (this.openedCache === item.businessId) { // 点击的重复的危险源 不做任何处理 直接return
        return
      }
      let colors = ['rgba(250,0,0,0.5)', 'rgba(255,125,0,0.5)', 'rgba(255,255,0,0.5)', 'rgba(0,0,255,0.5)']
      this.clearObject() // 清除地图已经显示的东西
      this.openedCache = item.businessId
      // 缺少区域坐标
      switch (item.type) {
        case '1': // 库区
        case '2': // 区域
        case '3': // 罐区
          dangerSource({
            type: item.type,
            businessId: item.businessId
          }).then(({ data }) => {
            if (data.code === 0 && data.data) {
              if (data.data.fencingList) {
                let area = []
                data.data.fencingList.map((r, index) => {
                  area.push({
                    fenceID: data.data.id + ',' + index,
                    points: getPointer(r.coordinate),
                    minH: r.minHeight || '2',
                    maxH: r.maxHeight || '30',
                    color: colors[Number(item.level)]
                  })
                })
                this.cesiumMap.$refs.mapShow.initAreaObjectLoc(
                  data.data.code,
                  'dangerSource',
                  'description',
                  area,
                  -1,
                  1
                )
              }
            }
          }).catch(err => {
            console.log(err)
          })
          break
        case '4': // 储罐
          dangerSource({
            type: item.type,
            businessId: item.businessId
          }).then(({ data }) => {
            if (data.code === 0 && data.data) {
              let point = translateXyToLnglat(data.data.positionX, data.data.positionY)
              this.cesiumMap.$refs.mapShow.insertOrUpdateObjectLoc(
                'tank',
                item.businessId,
                point.x,
                point.y,
                Number(data.data.positionZ),
                this.icons.tank,
                item.businessName,
                {
                  font: '16pt',
                  fillColor: 'rgba(255,255,255,1)',
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  showBackground: true,
                  pixeLoffset: [-(item.businessName.length / 2) * 16, -25]
                },
                1,
                [18, 18]
              )
              this.cesiumMap.$refs.mapShow.flyTo(item.businessId)
            }
          }).catch(err => {
            console.log(err)
          })
          break
        case '5': // 反应装置
          dangerSource({
            type: item.type,
            businessId: item.businessId
          }).then(({ data }) => {
            let point = translateXyToLnglat(data.data.positionX, data.data.positionY)
            this.cesiumMap.$refs.mapShow.insertOrUpdateObjectLoc(
              'device',
              item.businessId,
              point.x,
              point.y,
              Number(data.data.positionZ),
              this.icons.device,
              item.businessName,
              {
                font: '16pt',
                fillColor: 'rgba(255,255,255,1)',
                backgroundColor: 'rgba(0,0,0,0.9)',
                showBackground: true,
                pixeLoffset: [-(item.businessName.length / 2) * 16, -25]
              },
              1,
              [18, 18]
            )
            this.cesiumMap.$refs.mapShow.flyTo(item.businessId)
          }).catch(err => {
            console.log(err)
          })
          break
        default:
          break
      }
    },
    clearObject () {
      this.cesiumMap.$refs.mapShow.removeAreaObjectLoc('dangerSource')
      this.cesiumMap.$refs.mapShow.deleteObjectLoc('tank')
      this.cesiumMap.$refs.mapShow.deleteObjectLoc('device')
    }
  },
  filters: {
    formatType (value, map) {
      let optionName = ''
      map.map((val) => {
        if (value === val.value) {
          optionName = val.label
        }
      })
      return optionName
    }
  }
}
</script>

<style lang="scss">
.cesium-hazards-list-container {
  color: #fff;
  .el-form-item__label {
    color: #fff;
  }
  .el-form-item__content {
    font-size: 12px;
  }
  .hazardsLeftIndex {
    height: 120px;
    line-height: 120px;
    font-size: 20px;
    font-weight: bold;
    color: aqua;
  }
  .hazardsLeftBorder {
    border-bottom: 1px solid #fff;
  }
  .hazards_card {
    padding-top: 10px;
    background: rgba($color: #000000, $alpha: 0.3);
    margin-bottom: 10px;
    cursor: pointer;
  }
}
</style>
