<template>
  <div class="map-page-container">
    <!--报警铃声-->
    <audio id="myAudio" ref="myAudio" :src="require('@/assets/video/alarm.mp3')" preload="load" controls="controls" loop="true" hidden="true"></audio>
    <div class="aside-container" v-if="true">
      <!-- ---------菜单--------- -->
      <menu-list></menu-list>
    </div>
    <div class="map-container">
      <!-- ---------用户头像--------- -->
      <div class="user-bar">
        <el-dropdown trigger="click">
          <div>
            <img src="~@/assets/img/avatar.png" alt="用户头像" class="user-icon">
          </div>
          <el-dropdown-menu class="map-user-menu" slot="dropdown">
            <el-dropdown-item @click.native="changeMode()">前往后台</el-dropdown-item>
            <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- ---------地图加载--------- -->
      <map-show :personDistributionData="personDistributionData" @gisloadEnd="gisloadEnd" @clickObject="clickObject" class="map-content" ref="mapShow"></map-show>
      <!-- ---------SOS报警--------- -->
      <alert-box v-model="alertStatus" :twinkle="true" :data="alertData"></alert-box>
      <!--人员进出记录-->
      <div class="message-bar">
        <message-box v-model="comegoStatus" :showMore="true" title="人员进出记录" class="message-item">
          <wheel-list :dataList="comegoList"></wheel-list>
        </message-box>
      </div>

      <!-- ---------地图下方图标--------- -->
      <tool-bar @toolItemClick="toolItemClick"></tool-bar>

      <!------------二期修改------------>
      <cesium-content ref="cesiumContent" :comegoList="comegoList"></cesium-content>
    </div>
  </div>
</template>

<script>
// type : 类型
// fence(围栏)，area(区域)，person_distribution(人员分布)，four_area(四色区，安全风险分布)，equipment(设备)，hazards(危险源)  // 块级
// car(车辆)，checkpoint(卡口)，camera(摄像头)，beacon(信标)，base_station(基站)，person(人员)                    // 单级
// inspection(巡检)，homework(作业)
// beacon(信标)---person(人员)---car(车辆)  通过deveui(胸卡编号)做定位id
// checkpoint(卡口)---camera(摄像头)---base_station(基站)  通过id做定位id
// 地图
import mapShow from '@/components/cesiumMap'
// 菜单
import menuList from './components/menuList'
// 右侧组件弹框
import messageBox from './components/messageBox'
// sos报警
import alertBox from './components/alertBox'
// 底部
import toolBar from './components/toolBar'

import Stomp from 'stompjs' // websocket

import { translateXyToLnglat } from '@/utils/cesiumMap'
import { clearLoginInfo } from '@/utils' // 清除登录信息

import { positionInit } from '@/api/cesiumMap'

import car from '@/assets/img/cesiumMap/car.png'

import wheelList from './components/wheelList'
import cesiumContent from './content'
var audio = null
export default {
  provide () { // 多级祖孙传值-发送方
    return {
      cesiumMap: this
    }
  },
  components: {
    mapShow,
    menuList,
    messageBox,
    alertBox,
    toolBar,
    wheelList,
    cesiumContent
  },
  data () {
    return {
      stompClient: null, // websocket订阅实体
      alertStatus: false, // 警示框状态
      alertData: [], // 警示框数据
      searchBarStatus: false, // 搜索框状态
      comegoStatus: false,
      comegoList: [],
      personDistributionData: {},
      historyPlayerStatus: false, // 轨迹播放状态（因为轨迹在播放的时候,websocket推送的新增的人/车还会渲染到地图上）
      personLockCache: null, // 目标跟踪的人的id
      personIcons: [ // 人物图标base64
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADkklEQVRIS8WX20tUURSHv+NkzaCZJqiUQ1FQRlZmGdmF7GZkFKQRFFR0IymC6PJQf0A9ZNFLZlFGBQVRPhQo3S9khWYlml0oqYxQwXLSdGouO/Y5nuaMOnPOPGT7bZi117fX2r+19joKFpY4i50UliLIBaYBY4FhPVtdwAegBoWbNFOhbMRt5lYJZyDKSMTBHgSFQIJqa3dCzHiIjte2etrh51twN+muvqNQQjdHlHzaQvkPCRblrAeOAonEpoNzCySvAHtq/77cX6DlGjSdhs56aSOhu5U8zve3oQ9YnCQaJyXAJhWSdhiS80EJm5yAbyGgpQze7AN5GCiliUJlGx7jAYK89UCvAstJWg6TzgRSanZpvf+XV1C3GVqvy3+u00SBER4MLueMGmnqJph4HBRbpLhge+GDVzvgS6kauZLHZt3gL7jnTs+pkU69HB7a9QHqtoKrBuJnwKTT4BjV/yEl/MVqPfIN+p2rYFW9dt5iT01k9nPz9D6ZA66qAGj4PJhxK3R2ZNorM+Wdt+FmvFS7Bq7gIIL9ZFyClILw6ZUR3HAE20Q5IFeWc5jVfBVergGFQ8pSDihqc0jmK7HpCcyusabeyizoqA1Q4rNh5gOTAwuonCZL7TstjFBEBSsRlDHhGIzabk1MnQ1Quw466iBuKky5ADHjzPd+KobXu2TU+Yoo5wRQSE5j6OYQyqX/N0QNNgfqFrKu74+Rv0okuAq7M4sc2W4trp/v4cksiBoCwgMJc2BCEThGmzu4P1a212oJbiNx0XCyys036RZSJFIsxiUFNrnUXJzVedB2+5sEe0lZZSPjojVwYxG8O9C/7aChsKAZoqJD+3q5Fpqv+KyBhR8eZUBXI4jffZ2mn4L6bbIwYWFr+D5gAJun2u+Be07wfAP7SIjL1DuRdojFP+BhGvi6YP4nsPWqc+NRDam2Ji7/L/B1g0zn07ngehZwJ8F6es36u0FckZVTR73W/qSY/N2BiG12c40ElVOkDaRhJ3w+CWlF8GZvZOCgBhJpy7yTpI07OR81wXnbIfsxDJseWcuU1pYfCZ8bbsVpgCW/tPb3+QQMToLMKxA/MzS89yOhgq0+i8ILd1NBlteiVvB2wrM8aH8KthhYKGt4SF94qGdRhWvDnfkgINUtlw7wuqB6GcRNhonFfaHhBgHdWvyP0UeNWpswB37YM8AHdrw1XtCAD/RB8P/xCRN0gH/w0fYHzVmmxF/XreAAAAAASUVORK5CYII=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAEU0lEQVRIS8WXa2wUVRTH/3dmX3W7few29AFJH6glVSG1K8ZAglpSQYGmGCppiA/qh36pgpjoNlVCUykoiAYS+gGJEIWEh6YSUbFFKfFDa5uIjdY2pQ95Vrrd3c5u2Z2dmWvuNLvu2n1MTaT32+See373nHvu/54h0DBGCgpMFitdSzm+AkAZAV1MgXS2lAAeCnIVQC9R5AvCJPmmcHTUn8wtSWRwfclCm8Fs3MGB1lFCMpktl5MLPr8QxKJyQQUP5LERKLdvqd+EUpcC0ir6AvsX/XHDGc9/XPCEvfBFBfiQgNj4xQ/CVFUNw6rV4LNzYvqSx29DvNQO/5enIF8dBAV1csAbWT0jx2MtmAXuKYO+gBS1UmArl50L87a3YXy6AiAJk/OPb0oRuHgBvo/2QBm/xY7i6CgdrrP3Ihi5gShvDJpPis4CWG9YVY7Ud1vAWdKSHVfMeUWYgrfJAfFSB5s/N0aHn4+ER4En7EWfsEhNlZtgduwC4bj/BA0toooCX8tO+NtOq5Fn9QzXhubCYHamFOQYi9Sy92BCqHz9TwhNDZD6+6B/eJmaGT53YcxNMrjwVr0aOQF9KXTmKlit3lTDAJ+dZ8s40ZY0ve5XqiH99msYpC9bjvTDMWtItWFpd9dUQh6/6RS9YjGrdhX8V1nRbkLgsLR8DGP5MwnTS2UZziceirYxGpF1+UrCdYGO7yA4XgelaFnQO9xAVHGwkZvc/cWZmSfaNFWva0sV5MH+MEi3tBQZR04mrgdK4aqphDI04BKcNI9MPJpfRTn+C/ObjUip3qKpmKThIQiNOyAPDYAvLkFa835VVJKNu6c+g29fM4gibyR37EWHAdRlnvsxrjjEc0iDQRC9PhkvPM9ExrX+SfbdysDdXE7uY9avftDu4NoY3C9vAtEbQKUg9KV2mLc7wOctSupjcsNTTF5/JhP2Qqfu8RXW9INHky4KGUw5tkHs+Dba3mSCZeceGMvXJPTjqd8KqeunSXLHXigZVj/Lp+0+oAk8ffwIpg/ti2lLzGZYv+8C0eni+ppq2A6x/bysCcxEwL15HeQb14BglOSqgNR33oO3uRHsrlg7uhPqQBisJdVUkjC5diWoxw1uQQ50S0ogdl4MR2W7fAWujRWg/ruwnu8EMZriRhyRam3FRUURNOAHuc8MT+1mSL/3RYHBqptSEJ5PeGTh4prrdZKGBuGu2QCwqAIzjQaLmBiNSWsk6jrNVUC8e3fBf/aken18B1rmBI4SkLlKprN8OagwBevXnXC98ByoV0DGp6ehK3lkbpLJrLU+ElQMwLlymQrI6uqH94Nm+M98DmK1Ie39Q9AvLY0Ln/VIMEutzyJ7mSbXrAAUBbaObtBpHzz1tZD6fgFSUmBr71LV7N8j7rPIDLU2AjQozlSvYaaYFK+Aqddehe6BYqQ6mmZBEzYCIet5aX0YfN6avRD8nre3kQd0zxv6SPi8/MJEbuD/+Gn7G7picUEX1Q4IAAAAAElFTkSuQmCC',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAEK0lEQVRIS8VXXWwUVRT+7uzf7E/a3dbYdrcNMX2wWNDWBpA0MbVQGipoxCcx0aAx1PgkmhiJBokJhgfkSWljsIFEfTCS+LdNAZUQGpSCVGlpJdYKZWtrst0u7c7O7szOMXe2u92lO/vzIL2vc+757jnnO985w1DM6ZsUa6rd2wWibQBrAVBPoHJ+lYGFAUwAdEVj7PQ/M/P92POAXMgty2fgO3W7EnbHGyB0A/BwW5/IUO8UUG5JXg0rhImIhoBMKVchMPQgKh0J7KoNGvk3BPb5Qy8A9CGAygaXgOfrzOisMsMrCjl9TcsaBmZVfDalYnxR4zZBgO0LdHlO5rqwEriXLN66+R4GeskrMhxosKGrygyWNzfLrokA/6yKg+MxTMsEAvt0esrdjb1MyXxAtrtesvjq5r8CaGfn/SYcXS+ibCmlhWp29/c7CuH1azIG/k1wJnwbmHI/mwmeBez1h47zSJ+rteBwow1CkVEaPUoj4K3RGL64rSQj7/K8nLJNu16q6Qke6SfN9rygf0sa9l2T8XtYQ7ObZ8aGWnvu2nPwV65GU5G/mKq5DqyzV3T84RVZ5dlWR8H07rwo4WpYJ5B+NleY8OVGu2E1eNq3Dkq85kHI0oOc7Ung/rlDILzd2yTiyWpz3nImCFgzsJhlw4n+5zZX3nvfz6jYOyzzxv8gsL1iP0PfpOirKp9ucAmeM62OotjbOShhdGE54ha3gK8fc+QF5mzvGJR4q4UCs2Evq+kPPSMQnXp/rRV71liLIu+NRQ2v/SZjbEHDujIBHz0i6qJS6PTdjOPdsTg0xnYxn3/uGIDuS20OQ3EwcqhoBEsJ1Ocis/GcxN31MJ8/dMknYsMvbc5CD05/n4xo2HExCqsAKETY5DHhvbU21BkwO9PxpnMRBGQMceDg45VCxecbjFl594s4SThZMg/HPPqwiB0FyLl7KIrzQW2Oef1z6lPVZtOxJrGoiD/+K45DN+I5bV1mYKTdCXOe9L86LOObGTVRFDAXgfYLEdyUCEp6CC1jH1lnw5sjMfBPo1uc6cmV63Vp4GJSrWqE5p8khBRCjciwvkzAaV2Dk2eiw4nW8xKkBOHXJ5wQTcZam051seSKaQQ5AfB0Pv1zFMMZysWBObv5LDIVGGMZ5CqtncYWEugYjIKrlbykIRzYlifKVGay2qlUAdl/PYaTtxQcaLDi4HiSZMUCZwlIqZLZ+MMiwgpwuc2B9gsS7qjAd5vtaCo3lSaZpQyJWIJQfyaiA0x1uvDOWAwnbim4z8pw/FERLW5j8JVDooSxqBKh+UcJCSJc3+pCRCXsvhzFlXkNDhMwssUJa44eNhyLetTJ5a7gIhDXOHcB2xLAAgcfiuKhMgGHG1eKUN5FIFWcVVl9dPDVWvZS4Pd+vc1oiHu/0GeCr8YvTJYa/A8/bf8BhDha91Yg58IAAAAASUVORK5CYII=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAETklEQVRIS8WXXUybVRjH/4eutKV7K1CyuYnCXAsmY3xUEUr2gTPihmNmTkx0OhQnEA2Jjsm0V73CWApeOaCRbkzdjbhFWDbDInMm0/ExRRgmrC0R4xZjKAVKoaUfrznvbNcKb/v2wvFcP+f5nefzPIdAgOj1eqlCLt8XYNkygDwOYCuAB/49OgfABrA3Egjpm3e5Lun1encssySaQlNTk1IiEjewBHUAUqguo2CQmpICqVTCHXW7PZhxOOCcdwZNOQiLdo/f26LT6ex89nnBLQbDkQCLVkKIMi1NidzcHKjUW8EwzKq2nE4nrBYbRkdvYnraDpZl7QkExxoaG8+sdmAFuKOmRuxUqdoBUs0w61H61C6o1SoQEjU4Idssy8JiseL7Kz/A6VwAwJoZq7Wu1mTyhl8gwtpdqPprABUq1aPYu68MEsndkMYrHo8H317qg9U6SY/2MlbLoXB4BNhoMHRST7dv34Znyp4W7CXfpaj3l/u+w9jYOOf58cbGN4O6ITDNKQvSRT098Pz+qFCbzYY3qt/C8PANFBU9iVPmz5CZmbEqn8J7vrnAeU7AVgVzzoFp9YpF6yYUCkZZ9fqrMcNbrN2BgYHBEKi0dDeu9F/mzQYNe9fpLzA/77R7/b5sWu0cuOXj5iaW4MOKA+XIylJHTaff78c6sSxCRyaTYdFF25lfbt2yoLfnIgiLjxpOvK8jdDisT5LfSUtTphypOiworwWaQoyM/BqilGi1uHbtalQwDfmZri9pqzkWFl2bSWtz88EAi3N79uxGgSZfUPGOj/+GVw6/htHRMWgKCnD27OfIzs6KefaXn0fQ338VCQQvEKPB0AaQupraat7hwGdxeXkZiYmJMYFBBTpkTB1mWuHtxGhoHmQUTGFNTbVgA3RAFBWXIDFRAq/Xi107d6C11YgtWzJj2jCZzHS8DlGwPSPjkdQXKw/GPBRUqHzpZXR30zlzT5KSZDh9yozKykNR7XR/dR5TU3/MULAvO1st2l9RLghsMBhx4gPdqrp0jtun/4JYLOa1daH3IiYmLH5B4EAggJycfNgmJ0Hz+l/p7DTh6NFa+jDAMfM3kpOTBYFjhprmcdPmh2G3zyA9/SFoNBr09PSGjC8tzkOlfgwu1yLu3J4C7Ws+CQ+1oOKi02dpaYmrfG3JTgwNDUeAg+EViURRUxZWXPG109jYTeTmaTiv6EWoUI+lUmnMGolop3gHyNvv1KOtrQOftBrx3rHjcYEjBki8IzNVuQEOxyxu//k7tuXkY3Z2FoMDP6Kw8In4RibVFvpIuN1uyJIUHCDg96C+/l18erINGzduwPlz3dBqi3nhKx4Jqin0WfT5fHhwUzr8/gDXNgsLCygrK8dP169DLpdzPbzaxsL7LHJeC1wEqBGWRWjLnJubw7N7n0NeXi462k+u8DjqIhDUXpPVh8LXbNm7B7/P6214gu77Qh8OX5MvTPgF/o9P2z9ys3nRpdBhMQAAAABJRU5ErkJggg=='
      ],
      layer: {
        person: [],
        beacon: [],
        car: [],
        checkpoint: [],
        camera: [],
        base_station: []
      } // 图标管理图表展示---点击首页清空图标时作用
    }
  },
  created () {
  },
  mounted () {
    this.initWebsocket()
    // if (window.history && window.history.pushState) {
    //   history.pushState(null, null, document.URL)
    //   window.addEventListener('popstate', this.goBack, false)
    // }
  },
  beforeRouteLeave (to, from, next) {
    this.goBack()
    this.$refs.mapShow.resetAnyThing()
    next()
  },
  computed: {},
  watch: {
    alertStatus (newData) {
      if (newData) {
        this.musicPlay() // 播放报警
      } else {
        this.musicPause() // 暂停报警
      }
    }
  },
  methods: {
    // 暂停报警
    musicPause () {
      this.$nextTick(() => {
        // this.$refs.myAudio.pause()
        audio.pause()
      })
    },
    // 播放报警
    musicPlay () {
      this.$nextTick(() => {
        console.log(audio)
        if (!audio) {
          audio = document.getElementById('myAudio')
        }
        let playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise.then(() => {
            audio.play()
          }).catch(() => {
          })
        } else {
          setTimeout(() => {
            this.musicPlay()
          }, 500)
        }
      })
    },
    // 关闭websocket链接
    goBack () {
      // 关闭websocket连接
      if (this.stompClient !== null) {
        this.stompClient.disconnect()
      }
      console.log('关闭websocket连接')
    },
    // ----------------------------------地图加载完成，地图返回事件----------------------------------
    gisloadEnd () {
      this.$nextTick(() => {
        this.initAllPosition() // 初始加载所有点位
        this.$refs.mapShow.setOrigin('117.134482', '31.704585')
      })
    },
    // -- 初始化加载----
    initAllPosition () {
      positionInit().then(({ data }) => {
        console.log(data)
        if (data.list.length > 0) {
          data.list.map(res => {
            this.initObject(res)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // ----------------------------------websocket初始化----------------------------------
    initWebsocket () {
      // 初始化websocket
      let host =
        process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY
          ? '/proxyApi/'
          : window.SITE_CONFIG.baseUrl + '/spring-sysweb/mapSocket'
      host = 'ws://' + host.split('://')[1] // http/https替换ws
      let socket = new WebSocket(host) // 连接SockJS的endpoint名称为"bullet"
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(socket)
      // 定义客户端的认证信息,按需求配置
      let headers = {
        // Authorization:store.getters.token
      }
      // 拦截输出的一大堆垃圾信息
      this.stompClient.debug = function (str) { }
      // 向服务器发起websocket连接
      this.stompClient.connect(
        headers,
        () => {
          console.log('向服务器发起websocket连接')
          this.stompClient.subscribe(
            '/topic/getResponse/socket_send_topic_data',
            response => {
              // 胸卡定位
              if (response.body) {
                const repObj = JSON.parse(response.body)
                // console.log(repObj, '==================webscoket数据')
                // 新增人员或车辆图标位置更新
                if (repObj.type === '0') {
                  this.$refs.mapShow.insertOrUpdateObjectLoc('person',
                    repObj.deveui,
                    translateXyToLnglat(repObj.positionX, repObj.positionY).x, // 坐标x
                    translateXyToLnglat(repObj.positionX, repObj.positionY).y, // 坐标y
                    repObj.positionZ || 0,
                    this.personIcons[parseInt(repObj.person.icon)],
                    repObj.person.name, // 人员姓名
                    {
                      font: '16pt',
                      fillColor: 'rgba(255,255,255,1)',
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      showBackground: true,
                      pixeLoffset: [-(repObj.person.name.length / 2) * 16, -25]
                    },
                    0,
                    [18, 18],
                    false,
                    null,
                    !this.historyPlayerStatus
                  )

                  if (this.$refs.cesiumContent.comVisible.mapDialogVisible === true) {
                    this.$refs.cesiumContent.$refs.mapDialog.initPerson(repObj.person.gh, repObj.person.name, 'realTimePerson', repObj.positionX, repObj.positionY, repObj.positionZ, this.personIcons[parseInt(repObj.person.icon)])
                  }
                } else if (this.layer.car.length > 0 && repObj.type === '1') {
                  this.$refs.mapShow.insertOrUpdateObjectLoc(
                    'car',
                    repObj.deveui,
                    translateXyToLnglat(repObj.positionX, repObj.positionY).x, // 坐标x
                    translateXyToLnglat(repObj.positionX, repObj.positionY).y, // 坐标y
                    repObj.positionZ,
                    car,
                    undefined,
                    undefined,
                    0,
                    [18, 18],
                    false,
                    null,
                    !this.historyPlayerStatus
                  )
                }
                if (this.personLockCache === repObj.deveui) {
                  this.$refs.mapShow.setPtAminationVisible(null, [this.personLockCache], true, { color: '#00d400', radius: 50 }) // 闪动效果
                }
              }
            }
          )
          this.stompClient.subscribe(
            '/topic/getResponse/socket_send_topic_sos',
            response => {
              // sos
              if (response.body) {
                const repObj = JSON.parse(response.body)
                this.alertStatus = true
                if (this.alertData.length === 4) {
                  this.alertData.pop()
                }
                this.alertData.unshift({ info: repObj.infos })
              }
            }
          )
          this.stompClient.subscribe(
            '/topic/getResponse/socket_send_fencing_record',
            response => {
              // 围栏进入离开
              if (response.body) {
                const repObj = JSON.parse(response.body)
                repObj.map(res => {
                  if (this.comegoList.length < 4) {
                    this.comegoList.unshift(res)
                  } else {
                    this.comegoList.pop()
                    this.comegoList.unshift(res)
                  }
                })
              }
            }
          )
          this.stompClient.subscribe( // 移除点人员/车辆
            '/topic/getResponse/socket_send_topic_remove_obj',
            response => {
              if (response.body) {
                console.log('胸卡离线:' + response.body)
                this.$refs.mapShow.deleteObjectLoc(null, [response.body])

                if (this.$refs.cesiumContent.comVisible.mapDialogVisible === true) {
                  this.$refs.cesiumContent.$refs.mapDialog.removePoint(response.body, undefined)
                }
              }
            }
          )
        },
        err => {
          // 连接发生错误时的处理函数
          console.log('失败===' + err)
        }
      )
    },
    send () {
      // 发送消息到服务端
      console.log(this.stompClient)
      this.stompClient.send('/ws/msg', { msg: 9 }, { msg: 'Hello, XP' })
    },
    disconnect () {
      // 关闭websocket连接
      if (this.stompClient !== null) {
        this.stompCLient.disconnect()
      }
      console.log('关闭websocket连接')
    },
    // ----------------------------------登录信息----------------------------------
    // 前往后台
    changeMode () {
      this.$router.push('/home')
      this.$store.commit('common/updateMainTabs', [{
        iframeUrl: '',
        menuId: 'home',
        name: 'home',
        noClose: true,
        title: '首页',
        type: 'module'
      }])
      this.$store.commit('common/updatedNavbarFlag', this.$cookie.get('navFlag'))
    },
    // 修改密码
    updatePasswordHandle () {
      this.updatePassowrdVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init()
      })
    },
    // 退出
    logoutHandle () {
      this.$confirm(`确定进行[退出]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/spring-sysweb/sys/logout'),
          method: 'post',
          data: this.$http.adornData()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            clearLoginInfo()
            this.$router.push({ name: 'login' })
          }
        })
      }).catch(() => { })
    },
    clickObject (outId, id, type) { // 地图上点物体的点击事件
      console.log(outId, id, type)
    },
    initObject (repObj) { // 加载地图点物体
      if (repObj.type === '0') {
        this.$refs.mapShow.insertOrUpdateObjectLoc('person',
          repObj.deveui,
          translateXyToLnglat(repObj.positionX, repObj.positionY).x, // 坐标x
          translateXyToLnglat(repObj.positionX, repObj.positionY).y, // 坐标y
          repObj.positionZ || 0,
          this.personIcons[parseInt(repObj.person.icon)],
          repObj.person.name, // 人员姓名
          {
            font: '16pt',
            fillColor: 'rgba(255,255,255,1)',
            backgroundColor: 'rgba(0,0,0,0.9)',
            showBackground: true,
            pixeLoffset: [-(repObj.person.name.length / 2) * 16, -25]
          },
          0,
          [18, 18]
        )
      } else if (this.layer.car.length > 0 && repObj.type === '1') {
        this.$refs.mapShow.insertOrUpdateObjectLoc(
          'car',
          repObj.deveui,
          translateXyToLnglat(repObj.positionX, repObj.positionY).x, // 坐标x
          translateXyToLnglat(repObj.positionX, repObj.positionY).y, // 坐标y
          repObj.positionZ,
          car,
          undefined,
          undefined,
          0
        )
      }
    },
    toolItemClick (type) {
      if (type === 'resetCamera') {
        console.log(type, '重置相机')
        // 重置相机
        this.$nextTick(() => {
          this.$refs.mapShow.resetViewer()
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.map-page-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
  min-width: 1130px;
  .user-bar {
    position: absolute;
    right: 48px;
    top: 7px;
    z-index: 1;
    /deep/ .el-dropdown {
      margin-right: 0;
      color: #fff;
      cursor: pointer;
      padding: 2px;
      width: 32px;
      height: 32px;
      border-radius: 14%;
      background: #303336;
      border: 1px solid #444;
      .user-icon {
        width: 26px;
        height: 26px;
        border-radius: 50%;
      }
      .user-name {
        margin-left: 5px;
        font-size: 13px;
      }
    }
    &:hover {
      /deep/ .el-dropdown {
        background: #48b;
        border-color: #aef;
        box-shadow: 0 0 8px #fff;
      }
    }
  }
  .aside-container {
    position: absolute;
    left: 0px;
    top: 0px;
    height: 100vh;
    width: 190px;
    overflow-y: auto;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1;
  }
  .map-container {
    width: 100%;
    height: 100vh;
    // background-image: url("~@/assets/img/factory.png");
    // background-repeat: no-repeat;
    // background-size: 100% 100%;
    overflow: hidden;
    .map-content {
      position: absolute;
    }
    .map-title {
      position: absolute;
      font-weight: bold;
      text-shadow: 0px 0px 20px #00a1ff;
      right: 0px;
      top: 0px;
      height: 50px;
      width: 350px;
      font-size: 25px;
      line-height: 50px;
      text-align: center;
      border-bottom-left-radius: 50px;
      background-color: rgba(0, 0, 0, 0.7);
      color: #d9d9d9;
      z-index: 1;
      cursor: pointer;
    }
    .message-bar {
      position: absolute;
      top: 50px;
      right: 10px;
      z-index: 1;
      .message-item {
        margin-top: 20px;
      }
    }
    .three-map {
      width: 100%;
      height: 100vh;
      overflow: hidden;
    }
  }
}
</style>
<style lang="scss">
.map-user-menu {
  background: #303336;
  .el-dropdown-menu__item {
    color: #fff;
    &:focus,
    &:not(.is-disabled):hover {
      background-color: #303336;
      color: #5693c9;
    }
  }
  .popper__arrow {
    border-bottom-color: #303336;
    &:after {
      border-bottom-color: #303336 !important;
    }
  }
}
</style>
