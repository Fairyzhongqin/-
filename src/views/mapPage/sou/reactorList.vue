<!--
 * @Descripttion: 
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-12-03 11:48:47
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-12-03 14:22:58
 -->
<template>
  <div class="cesium-reactor-list-container">
    <message-layout height="calc(50vh - 45px)" name="反应装置设备">
      <el-table :data="dataList" class="com-map" style="width: 100%" width="338px" ref="singleTables" highlight-current-row height="100%" @cell-click="viewHandle" v-loading="dataListLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column prop="name" label="反应装置名称"></el-table-column>
        <el-table-column label="状态" width="70px">
          <template slot-scope="scope">
            <template v-if="scope.row.id != '0'">
              {{'正常'}}
            </template>
          </template>
        </el-table-column>
      </el-table>
    </message-layout>
  </div>
</template>

<script>
import messageLayout from '../components/messageLayout'
import { translateXyToLnglat } from '@/utils/cesiumMap'
import { reactorList } from '@/api/sou/equlpment'
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
      base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAErUlEQVRIS72Xa0ybVRjH/6cXaAuUQrkNB87hIBLGMhBwwywkC8gM2xj4ATWZ2YzJNLoPM1Fn4lc1Ji66mEhMdGGJOBOdF7KxS8zGBsSBoOJkwmQqsNEBpS+UXnnLMc/blvbt23bDGM63nvd5zu881/OU4T4W51wHYBeAOgDlAAoApAZU5wGMARgAcAFAJ2PMfa9jWTwBzrkZwKsADgFII1mHIMI+I8LrWpZUE/QqpGRqkGTSBI+yAWgF8D5jzBrr/Jhgzvl+AMcAmAWLF2N9DkwOu+Ba8EU9S29UY32xHgWVSTDlJJAMQY8wxk5GU1CAOefawI0POgURP58VMHHddS/Pyb7nleix9UkTDH4vfEYeY4wthQvJwAHo1wB2Tw47ce2rOSy5+aqgQWGtjqHqqXSsLzbQVgeA5nB4JPhTAAfH+hfR/60N+G/M0EUZUNGYhoKKZMlyxtjzwY8r4EBM28jS7s+tK9C8zTowBlj+9MDrjH4TTQIDUyG6dxjw+LPmoOXPBWMugQPZO+IURHPncUvoAAY0vp4lXfJquw3WcVmYpP2iagO2PJEiXe6Pbid+PW9XhIbcvutwDsWcEq6Isj0IfhvA0Z722VUlUoKBofFoFlSqUMQ6P5zF/LSogFPCVT+TQfvvMMbeZIHmcEeweNPOHb8rU9AbVdgbsLj3lIDx3+R9IdmsRsORTJnOxVYrrBNKz5BQ/eFsKjWq81wC7wNweuB7G27+uCg7hOJmMKqlPY9zGaI3FOOUDDXqXjJDm6ha0bk75sGlE7GTctNjySjfI/WhJgJ/THX23bt3FM3BmKlGVbNJOnik14HxoZDFaQ9oUPdiBlzzPvR+KUCtZZi+5QWPUwnUZPa+kUvHtRK4zyGIFR3vTSnikrlBi50vUNcEhi7aMXzZIZOhi3mcHB6Hv33ez9r92jpqr/0EtlpuutMvn5hR6OUWJWLHfsk1GO5axNCFRTyyIwnrChMVsoNnFiBMKZMqUrDmQCZyNunmCCyODznVvaeU/ZxquLrF7+qxfid+OWfHo3uMeHCLXgG+ctKGmX+8WBY5fHH421vMyC81+OKCN5brUdnkf/1mJ7z4e9CNDVt1yMiXHgHZGulxwD7rgyaRSa7/azB6fw8Hx3R14TYDyhqMEmDiuhs9Xwioak7FQ2VKi7va5jA16kWCnqFkZzJuXHHAtaCMfbirYyZXcU0SSmtTJPDUqAddbTZsbzEhfzPNBfLV3W6TLK5/2QwWaCh938zj1k9yy8OTK2Y5ldYmo7hGavBS/H74ZA41B9KQ87AyuQY6FjB3ewm1h/xVQIsSbrTXufI7spxiNpCyhhQUbkuSFG1TSzj/kRX1r5hhyqEnW75uXHVg8nd3XHBkAyG/RW2ZlU1GbCyX3lPYrSLOHJtF81tZ0OpC3SqIJyjB41ksa5mkyDmP+khUP21CXok/ni67D2c/IHC2wlraWJgWce30fEyw4pEIgCkwimcxNVuDRIPfuuVlDtvtJZjzlKUU/C5YRKTnhsJAXqLMjvksBuA03CkGgajmrWYz3iAQPIdzvvajT8Bq8tPaD3thcBrI1268DQ/dmg/0EfC1/wsTcYH//U/bvwvzdV9s5PQkAAAAAElFTkSuQmCC'
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
      this.cesiumMap.$refs.mapShow.flyTo(row.id)
    },
    getDataList (val, type) {
      this.dataListLoading = true
      reactorList({}).then(({ data }) => {
        if (data && data.code === 0) {
          data.page.list.map(vals => {
            this.showDevice(vals)
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
    showDevice (device, cameraType = 0) { // 在地图上展示储罐 1为启用摄像头跟踪，0为不跟踪
      let t = translateXyToLnglat(device.positionX, device.positionY)
      this.cesiumMap.$refs.mapShow.insertOrUpdateObjectLoc(
        'device',
        device.id,
        t.x,
        t.y,
        Number(device.positionZ),
        this.base64,
        device.name,
        {
          font: '16pt',
          fillColor: 'rgba(255,255,255,1)',
          backgroundColor: 'rgba(0,0,0,0.9)',
          showBackground: true,
          pixeLoffset: [-(device.name.length / 2) * 16, -25]
        },
        cameraType,
        [18, 18]
      )
    }
  }
}
</script>

<style lang="scss">
.cesium-reactor-list-container {
}
</style>
