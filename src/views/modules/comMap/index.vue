<template>
  <div class="com-map-container">
    <three-map cameraType="orthographic" ref="threeMap" @loaded="mapLoaded"></three-map>
    <!-- 地图操作 -->
    <div style="z-index:51;">
      <coverage ref="coverage"></coverage>
      <check-point ref="checkPoint"></check-point>
      <fence ref="fence"></fence>
      <zone ref="zone"></zone>
      <history ref="history"></history>
      <camera ref="camera"></camera>
      <device ref="device"></device>
      <tank ref="tank"></tank>
      <region ref="region"></region>
      <inspection ref="inspection"></inspection>
      <map-config ref="mapConfig"></map-config>
    </div>
    <div class="realTimeButton" v-show="false">
      <span>实时人员</span>
      <el-switch v-model="realTimePointShow" active-color="#13ce66" inactive-color="#ff4949" @change="handleSwitch">
      </el-switch>
    </div>
  </div>
</template>

<script>
import threeMap from '@/components/ThreeMap/index'
import eventBus from '@/bus/index'
import Stomp from 'stompjs' // websocket
import coverage from './others/coverage'
// 人员在岗在位
import checkPoint from './pos/checkPoint'
import fence from './pos/fence'
import zone from './pos/zone'
import history from './pos/history'
// 重大危险源
import camera from './sou/camera'
import device from './sou/device'
import tank from './sou/tank'
// 安全风险分区
import region from './risk/region'
// 企业安全生产全流程
import inspection from './process/inspection'
// 地图参数
import mapConfig from './others/mapConfig'
import { getMapConfig } from '@/api/sys/config'
import { positionInit } from '@/api/cesiumMap'
export default {
  provide () { // 多级祖孙传值-发送方
    return {
      threeMap: this
    }
  },
  data () {
    return {
      pageActive: '', // 记录当前激活的页面
      realTimePointShow: false,
      personIcons: [ // 人物图标base64
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADkklEQVRIS8WX20tUURSHv+NkzaCZJqiUQ1FQRlZmGdmF7GZkFKQRFFR0IymC6PJQf0A9ZNFLZlFGBQVRPhQo3S9khWYlml0oqYxQwXLSdGouO/Y5nuaMOnPOPGT7bZi117fX2r+19joKFpY4i50UliLIBaYBY4FhPVtdwAegBoWbNFOhbMRt5lYJZyDKSMTBHgSFQIJqa3dCzHiIjte2etrh51twN+muvqNQQjdHlHzaQvkPCRblrAeOAonEpoNzCySvAHtq/77cX6DlGjSdhs56aSOhu5U8zve3oQ9YnCQaJyXAJhWSdhiS80EJm5yAbyGgpQze7AN5GCiliUJlGx7jAYK89UCvAstJWg6TzgRSanZpvf+XV1C3GVqvy3+u00SBER4MLueMGmnqJph4HBRbpLhge+GDVzvgS6kauZLHZt3gL7jnTs+pkU69HB7a9QHqtoKrBuJnwKTT4BjV/yEl/MVqPfIN+p2rYFW9dt5iT01k9nPz9D6ZA66qAGj4PJhxK3R2ZNorM+Wdt+FmvFS7Bq7gIIL9ZFyClILw6ZUR3HAE20Q5IFeWc5jVfBVergGFQ8pSDihqc0jmK7HpCcyusabeyizoqA1Q4rNh5gOTAwuonCZL7TstjFBEBSsRlDHhGIzabk1MnQ1Quw466iBuKky5ADHjzPd+KobXu2TU+Yoo5wRQSE5j6OYQyqX/N0QNNgfqFrKu74+Rv0okuAq7M4sc2W4trp/v4cksiBoCwgMJc2BCEThGmzu4P1a212oJbiNx0XCyys036RZSJFIsxiUFNrnUXJzVedB2+5sEe0lZZSPjojVwYxG8O9C/7aChsKAZoqJD+3q5Fpqv+KyBhR8eZUBXI4jffZ2mn4L6bbIwYWFr+D5gAJun2u+Be07wfAP7SIjL1DuRdojFP+BhGvi6YP4nsPWqc+NRDam2Ji7/L/B1g0zn07ngehZwJ8F6es36u0FckZVTR73W/qSY/N2BiG12c40ElVOkDaRhJ3w+CWlF8GZvZOCgBhJpy7yTpI07OR81wXnbIfsxDJseWcuU1pYfCZ8bbsVpgCW/tPb3+QQMToLMKxA/MzS89yOhgq0+i8ILd1NBlteiVvB2wrM8aH8KthhYKGt4SF94qGdRhWvDnfkgINUtlw7wuqB6GcRNhonFfaHhBgHdWvyP0UeNWpswB37YM8AHdrw1XtCAD/RB8P/xCRN0gH/w0fYHzVmmxF/XreAAAAAASUVORK5CYII=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAEU0lEQVRIS8WXa2wUVRTH/3dmX3W7few29AFJH6glVSG1K8ZAglpSQYGmGCppiA/qh36pgpjoNlVCUykoiAYS+gGJEIWEh6YSUbFFKfFDa5uIjdY2pQ95Vrrd3c5u2Z2dmWvuNLvu2n1MTaT32+See373nHvu/54h0DBGCgpMFitdSzm+AkAZAV1MgXS2lAAeCnIVQC9R5AvCJPmmcHTUn8wtSWRwfclCm8Fs3MGB1lFCMpktl5MLPr8QxKJyQQUP5LERKLdvqd+EUpcC0ir6AvsX/XHDGc9/XPCEvfBFBfiQgNj4xQ/CVFUNw6rV4LNzYvqSx29DvNQO/5enIF8dBAV1csAbWT0jx2MtmAXuKYO+gBS1UmArl50L87a3YXy6AiAJk/OPb0oRuHgBvo/2QBm/xY7i6CgdrrP3Ihi5gShvDJpPis4CWG9YVY7Ud1vAWdKSHVfMeUWYgrfJAfFSB5s/N0aHn4+ER4En7EWfsEhNlZtgduwC4bj/BA0toooCX8tO+NtOq5Fn9QzXhubCYHamFOQYi9Sy92BCqHz9TwhNDZD6+6B/eJmaGT53YcxNMrjwVr0aOQF9KXTmKlit3lTDAJ+dZ8s40ZY0ve5XqiH99msYpC9bjvTDMWtItWFpd9dUQh6/6RS9YjGrdhX8V1nRbkLgsLR8DGP5MwnTS2UZziceirYxGpF1+UrCdYGO7yA4XgelaFnQO9xAVHGwkZvc/cWZmSfaNFWva0sV5MH+MEi3tBQZR04mrgdK4aqphDI04BKcNI9MPJpfRTn+C/ObjUip3qKpmKThIQiNOyAPDYAvLkFa835VVJKNu6c+g29fM4gibyR37EWHAdRlnvsxrjjEc0iDQRC9PhkvPM9ExrX+SfbdysDdXE7uY9avftDu4NoY3C9vAtEbQKUg9KV2mLc7wOctSupjcsNTTF5/JhP2Qqfu8RXW9INHky4KGUw5tkHs+Dba3mSCZeceGMvXJPTjqd8KqeunSXLHXigZVj/Lp+0+oAk8ffwIpg/ti2lLzGZYv+8C0eni+ppq2A6x/bysCcxEwL15HeQb14BglOSqgNR33oO3uRHsrlg7uhPqQBisJdVUkjC5diWoxw1uQQ50S0ogdl4MR2W7fAWujRWg/ruwnu8EMZriRhyRam3FRUURNOAHuc8MT+1mSL/3RYHBqptSEJ5PeGTh4prrdZKGBuGu2QCwqAIzjQaLmBiNSWsk6jrNVUC8e3fBf/aken18B1rmBI4SkLlKprN8OagwBevXnXC98ByoV0DGp6ehK3lkbpLJrLU+ElQMwLlymQrI6uqH94Nm+M98DmK1Ie39Q9AvLY0Ln/VIMEutzyJ7mSbXrAAUBbaObtBpHzz1tZD6fgFSUmBr71LV7N8j7rPIDLU2AjQozlSvYaaYFK+Aqddehe6BYqQ6mmZBEzYCIet5aX0YfN6avRD8nre3kQd0zxv6SPi8/MJEbuD/+Gn7G7picUEX1Q4IAAAAAElFTkSuQmCC',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAEK0lEQVRIS8VXXWwUVRT+7uzf7E/a3dbYdrcNMX2wWNDWBpA0MbVQGipoxCcx0aAx1PgkmhiJBokJhgfkSWljsIFEfTCS+LdNAZUQGpSCVGlpJdYKZWtrst0u7c7O7szOMXe2u92lO/vzIL2vc+757jnnO985w1DM6ZsUa6rd2wWibQBrAVBPoHJ+lYGFAUwAdEVj7PQ/M/P92POAXMgty2fgO3W7EnbHGyB0A/BwW5/IUO8UUG5JXg0rhImIhoBMKVchMPQgKh0J7KoNGvk3BPb5Qy8A9CGAygaXgOfrzOisMsMrCjl9TcsaBmZVfDalYnxR4zZBgO0LdHlO5rqwEriXLN66+R4GeskrMhxosKGrygyWNzfLrokA/6yKg+MxTMsEAvt0esrdjb1MyXxAtrtesvjq5r8CaGfn/SYcXS+ibCmlhWp29/c7CuH1azIG/k1wJnwbmHI/mwmeBez1h47zSJ+rteBwow1CkVEaPUoj4K3RGL64rSQj7/K8nLJNu16q6Qke6SfN9rygf0sa9l2T8XtYQ7ObZ8aGWnvu2nPwV65GU5G/mKq5DqyzV3T84RVZ5dlWR8H07rwo4WpYJ5B+NleY8OVGu2E1eNq3Dkq85kHI0oOc7Ung/rlDILzd2yTiyWpz3nImCFgzsJhlw4n+5zZX3nvfz6jYOyzzxv8gsL1iP0PfpOirKp9ucAmeM62OotjbOShhdGE54ha3gK8fc+QF5mzvGJR4q4UCs2Evq+kPPSMQnXp/rRV71liLIu+NRQ2v/SZjbEHDujIBHz0i6qJS6PTdjOPdsTg0xnYxn3/uGIDuS20OQ3EwcqhoBEsJ1Ocis/GcxN31MJ8/dMknYsMvbc5CD05/n4xo2HExCqsAKETY5DHhvbU21BkwO9PxpnMRBGQMceDg45VCxecbjFl594s4SThZMg/HPPqwiB0FyLl7KIrzQW2Oef1z6lPVZtOxJrGoiD/+K45DN+I5bV1mYKTdCXOe9L86LOObGTVRFDAXgfYLEdyUCEp6CC1jH1lnw5sjMfBPo1uc6cmV63Vp4GJSrWqE5p8khBRCjciwvkzAaV2Dk2eiw4nW8xKkBOHXJ5wQTcZam051seSKaQQ5AfB0Pv1zFMMZysWBObv5LDIVGGMZ5CqtncYWEugYjIKrlbykIRzYlifKVGay2qlUAdl/PYaTtxQcaLDi4HiSZMUCZwlIqZLZ+MMiwgpwuc2B9gsS7qjAd5vtaCo3lSaZpQyJWIJQfyaiA0x1uvDOWAwnbim4z8pw/FERLW5j8JVDooSxqBKh+UcJCSJc3+pCRCXsvhzFlXkNDhMwssUJa44eNhyLetTJ5a7gIhDXOHcB2xLAAgcfiuKhMgGHG1eKUN5FIFWcVVl9dPDVWvZS4Pd+vc1oiHu/0GeCr8YvTJYa/A8/bf8BhDha91Yg58IAAAAASUVORK5CYII=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAETklEQVRIS8WXXUybVRjH/4eutKV7K1CyuYnCXAsmY3xUEUr2gTPihmNmTkx0OhQnEA2Jjsm0V73CWApeOaCRbkzdjbhFWDbDInMm0/ExRRgmrC0R4xZjKAVKoaUfrznvbNcKb/v2wvFcP+f5nefzPIdAgOj1eqlCLt8XYNkygDwOYCuAB/49OgfABrA3Egjpm3e5Lun1encssySaQlNTk1IiEjewBHUAUqguo2CQmpICqVTCHXW7PZhxOOCcdwZNOQiLdo/f26LT6ex89nnBLQbDkQCLVkKIMi1NidzcHKjUW8EwzKq2nE4nrBYbRkdvYnraDpZl7QkExxoaG8+sdmAFuKOmRuxUqdoBUs0w61H61C6o1SoQEjU4Idssy8JiseL7Kz/A6VwAwJoZq7Wu1mTyhl8gwtpdqPprABUq1aPYu68MEsndkMYrHo8H317qg9U6SY/2MlbLoXB4BNhoMHRST7dv34Znyp4W7CXfpaj3l/u+w9jYOOf58cbGN4O6ITDNKQvSRT098Pz+qFCbzYY3qt/C8PANFBU9iVPmz5CZmbEqn8J7vrnAeU7AVgVzzoFp9YpF6yYUCkZZ9fqrMcNbrN2BgYHBEKi0dDeu9F/mzQYNe9fpLzA/77R7/b5sWu0cuOXj5iaW4MOKA+XIylJHTaff78c6sSxCRyaTYdFF25lfbt2yoLfnIgiLjxpOvK8jdDisT5LfSUtTphypOiworwWaQoyM/BqilGi1uHbtalQwDfmZri9pqzkWFl2bSWtz88EAi3N79uxGgSZfUPGOj/+GVw6/htHRMWgKCnD27OfIzs6KefaXn0fQ338VCQQvEKPB0AaQupraat7hwGdxeXkZiYmJMYFBBTpkTB1mWuHtxGhoHmQUTGFNTbVgA3RAFBWXIDFRAq/Xi107d6C11YgtWzJj2jCZzHS8DlGwPSPjkdQXKw/GPBRUqHzpZXR30zlzT5KSZDh9yozKykNR7XR/dR5TU3/MULAvO1st2l9RLghsMBhx4gPdqrp0jtun/4JYLOa1daH3IiYmLH5B4EAggJycfNgmJ0Hz+l/p7DTh6NFa+jDAMfM3kpOTBYFjhprmcdPmh2G3zyA9/SFoNBr09PSGjC8tzkOlfgwu1yLu3J4C7Ws+CQ+1oOKi02dpaYmrfG3JTgwNDUeAg+EViURRUxZWXPG109jYTeTmaTiv6EWoUI+lUmnMGolop3gHyNvv1KOtrQOftBrx3rHjcYEjBki8IzNVuQEOxyxu//k7tuXkY3Z2FoMDP6Kw8In4RibVFvpIuN1uyJIUHCDg96C+/l18erINGzduwPlz3dBqi3nhKx4Jqin0WfT5fHhwUzr8/gDXNgsLCygrK8dP169DLpdzPbzaxsL7LHJeC1wEqBGWRWjLnJubw7N7n0NeXi462k+u8DjqIhDUXpPVh8LXbNm7B7/P6214gu77Qh8OX5MvTPgF/o9P2z9ys3nRpdBhMQAAAABJRU5ErkJggg=='
      ],
      carIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADjElEQVRIS72XTWxUVRTHf+eVYqE0yrTQ0oaPKNEQSANtNCASQAnVRBYCC6JBTGXBgoXigoAYFkaJJCAJJHRBCRqIbvhINBEwFFJC+FC+GhQ0GAvFtrSMRFoYoZ13zJl5U+bNzJtCqXM3k8w99/zu+d97zj1PeIShqgXAG8B8oBp4DnjaW/oP8AdwFjgM/CAi//bnVrIZqGox8BGwAhhpth0R5a+70N0TXzkiHyoKYfSwPle3gTpgk4iEg/wHglX1XWAzUNzcpRy8rpy8CeGAWIoLYEYpvD5OmFAUc2vQVSLydSZ4GlhV870d13ZGlB2XlRPt/Qnnn59ZBssnCaPiKuw0xUTE0yhu6wN70L3AglPtypdNyt3ex4MmrAuHwIeVwvSyGOI7YFEyPBVcD9Qeuq5su6TowJh9q8z5yilCzbh45CLyfmKyD+yd6VcW6WfnnhyaDPi4qi/yZYkzj4G92/tbZ0SLVx4fuLxBApns22bFztwu3At22xPgz4E1G865aRepolCZ9Eyw5g9cOHVTsN9swy7cmirHTDaIyFrxikNrc5eOtGiTh5nteS1K0dDsTg/8Key4EnOadVjUE4rE8rzcwG8B++p+cfn+mn9dvgP7a6L9+eNiGL69Ggd39UBzV+by8OZ4WDE5ZrfQwNstz95rcLmVUhweFZy8M1XYekk4fCNdgZIC2PVq7P86A5/piOiLtUfTk+dxwLt/Fy6EhSUTXapKYEuT0NCaDt85V6y8/mTg8PlbGvrkzJOBN15waGwTbLPrqqJMLYFNF4XGNj/805eEaSXyt4F7j7dp3hfnBwdsOg51YH11lMkhePuIw73eh2e+epowa4xE/xewwedVKB9UuixtcLh9PzN4UKS2VyuSVNeH50PoKdLAyVIPyuUKyrnUiJMvV2A6DXHggJfHdx7A2U5hTrkiWdqHxlZhSkgJWc+CP+LUdAosILZwZpmyqtLlxxtC3a8O9bOj3OmBY61++sulytgR8M6RPJY+77L4WaX+inCwxeG+V4NSC4jtLWPJTMi3eqrLjNJ4yzO+yNLE4WgKePpoZV21S0s3lA2HpjCs/znPdwK+kum9ToGPhM0Py1OWTIxHdLoDDrVkrstzy5VXxijt9+Cbq0J3z0NV0h4JD2xNXe6fRQ9uzV1uG4HEQahq7lsfL2rrMHPf7CXBrSHPXXvrf1dz3NCnwHP/CZOygUH/aPsPQdf3UHcUdfsAAAAASUVORK5CYII='
    }
  },
  components: {
    threeMap,
    coverage,
    checkPoint,
    fence,
    zone,
    history,
    camera,
    device,
    tank,
    mapConfig,
    region,
    inspection
  },
  created () {
    this.initData()
  },
  mounted () {
    this.$nextTick(() => {
      eventBus.$on('mainSidebarCoMapReside', data => {
        setTimeout(() => {
          this.$refs.threeMap.reSize()
        }, 500)
      })
      eventBus.$on('mainSidebarCoMap', data => {
        debugger
        let breakStatus = false
        // 1、先重置历史展示页
        switch (this.pageActive) {
          case 'coverageFun':      // 图层列表
            this.$refs.coverage.resetPage()
            break
          case 'checkpointFun':    // 卡口管理
            this.$refs.checkPoint.resetPage()
            break
          case 'fencingFun':       // 围栏管理
            this.$refs.fence.resetPage()
            break
          case 'zoneFun':          // 区域管理
            this.$refs.zone.resetPage()
            break
          case 'historyFun':       // 历史轨迹
            if (data === 'historyFun' || data.name === 'historyFun') {
              breakStatus = true
            }
            this.$refs.history.resetPage()
            break
          case 'cameraFun':        // 摄像头管理
            this.$refs.camera.resetPage()
            break
          case 'tankFun':           // 储罐管理
            this.$refs.tank.resetPage()
            break
          case 'deviceFun':        // 装置管理
            this.$refs.device.resetPage()
            break
          case 'regionFun':        // 四色区管理
            this.$refs.region.resetPage()
            break
          case 'inspectionFun':        // 巡检管理
            this.$refs.inspection.resetPage()
            break
          case 'mapconfig':        // 地图参数配置
            this.$refs.mapConfig.resetPage()
            break
          default:
            break
        }
        if (breakStatus) { // 是否往下执行
          this.pageActive = ''
          return
        }
        // 2、打开新的弹出框
        if (data === 'coverageFun' || data.name === 'coverageFun') {
          if (this.$refs.coverage) {
            this.$refs.coverage.init()
          }
        } else if (data === 'checkpointFun' || data.name === 'checkpointFun') {
          if (this.$refs.checkPoint) {
            if (data.info) {
              this.$refs.checkPoint.handleClick('edit', data.info) // 查看
            } else {
              this.$refs.checkPoint.init() // 初始化
            }
          }
        } else if (data === 'fencingFun' || data.name === 'fencingFun') {
          if (this.$refs.fence) {
            if (data.info) {
              this.$refs.fence.handleClick('edit', data.info) // 查看
            } else {
              this.$refs.fence.init() // 初始化
            }
          }
        } else if (data === 'cameraFun' || data.name === 'cameraFun') {
          if (this.$refs.camera) {
            if (data.info) {
              this.$refs.camera.handleClick('edit', data.info) // 查看
            } else {
              this.$refs.camera.init() // 初始化
            }
          }
        } else if (data === 'zoneFun' || data.name === 'zoneFun') {
          if (this.$refs.zone) {
            this.$refs.zone.init() // 初始化
          }
        } else if (data === 'historyFun' || data.name === 'historyFun') {
          if (this.$refs.history) {
            this.$refs.history.init() // 初始化
          }
        } else if (data === 'deviceFun' || data.name === 'deviceFun') {
          if (this.$refs.device) {
            if (data.info) {
              this.$refs.device.handleClick('view-device', data.info) // 查看
            } else {
              this.$refs.device.init() // 初始化
            }
          }
        } else if (data === 'tankFun' || data.name === 'tankFun') {
          if (this.$refs.tank) {
            if (data.info) {
              this.$refs.tank.handleClick('view-tank', data.info) // 查看
            } else {
              this.$refs.tank.init() // 初始化
            }
          }
        } else if (data === 'regionFun' || data.name === 'regionFun') {
          if (this.$refs.region) {
            this.$refs.region.init()
          }
        } else if (data === 'inspectionFun' || data.name === 'inspectionFun') {
          if (this.$refs.inspection) {
            this.$refs.inspection.init()
          }
        } else if (data === 'mapconfig' || data.name === 'mapconfig') {
          if (this.$refs.mapConfig) {
            this.$refs.mapConfig.init()
          }
        }
        this.pageActive = (typeof (data) === 'string') ? data : data.name // 存取当前页
      })
    })
  },
  computed: {
  },
  watch: {},
  methods: {
    mapLoaded () {
      if (this.$route.params.callBackFn) {
        this.$nextTick(() => {
          this.$route.params.callBackFn() // comMap页面回调
        })
      }
    },
    initData () { // 获取相机初始位置
      getMapConfig({
        key: 'cameraPositionThreeJs',
        params: {}
      }).then(res => {
        if (res.data && res.data.code === 0) {
          let resultArr = JSON.parse(JSON.parse(res.data.page.list[0].value)[0].value.replace(/\\/g, ''))
          if (resultArr) {
            localStorage.setItem('cameraPosition', JSON.stringify(resultArr.cameraPosition))
            localStorage.setItem('cameraTarget', JSON.stringify(resultArr.cameraTarget))
            this.$refs.threeMap.resetCamera()
          }
        }
      })
    },
    async handleSwitch (val) {
      if (val) {
        await this.initAllPosition()
        this.initWebsocket()
      } else {
        this.disconnect()
      }
    },
    // -- 初始化加载----
    async initAllPosition () {
      await positionInit().then(({ data }) => {
        if (data.list.length > 0) {
          data.list.map(repObj => {
            this.initObject(repObj)
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
                // 新增人员或车辆图标位置更新
                this.initObject(repObj)
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
    disconnect () {
      // 关闭websocket连接
      if (this.stompClient !== null) {
        this.stompCLient.disconnect()
      }
      console.log('关闭websocket连接')
    },
    initObject (repObj) { // 加载地图点物体
      if (repObj.type === '0') {
        this.$refs.threeMap.insertOrUpdatePoint(
          repObj.deveui,
          repObj.person.name, // 人员姓名
          'person',
          [repObj.positionX, repObj.positionY, repObj.positionZ || 0],
          this.personIcons[parseInt(repObj.person.icon)]
        )
      } else if (this.layer.car.length > 0 && repObj.type === '1') {
        this.$refs.threeMap.insertOrUpdatePoint(
          repObj.deveui,
          repObj.person.name,
          'car',
          [repObj.positionX, repObj.positionY, repObj.positionZ || 0],
          this.carIcon
        )
      }
    }
  }
}
</script>
<style lang='scss'>
.com-map-container {
  width: 100%;
  height: calc(100vh - 40px);
  .controls {
    position: fixed;
    right: 10px;
    bottom: 10px;
    // width: 100px;
    display: flex;
    flex-direction: column;
    z-index: 1000;
    .controls-right {
      border-radius: 4px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 4px 0px rgba(37, 39, 50, 0.5);
      .el-form-item--medium .el-form-item__content {
        line-height: 36px;
      }
      .el-select {
        width: 100%;
      }
      .title {
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #d7dae2;
        text-align: center;
        line-height: 40px;
      }
      .content {
        width: 340px;
      }
      .bottom-btn {
        text-align: center;
        .el-button {
          padding: 7px 10px;
        }
      }
      .control-button {
        margin-top: 18px;
        height: 40px;
        width: 100px;
        border-radius: 20px;
        background-color: #fff;
        border: 0;
        line-height: 40px;
        text-align: center;
        box-shadow: 0 2px 5px 0px #9a9a9a;
        cursor: pointer;
      }
      .el-icon-close {
        font-weight: bold;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          color: #2c78bb;
        }
      }
    }
  }
  .control-button-active {
    background-color: #3e5efc;
    color: #fff;
    box-shadow: 0 0 0 0 #9a9a9a;
  }
  .controls-left {
    position: absolute;
    left: 8px;
    top: 8px;
    .controls-left-layer,
    .controls-left-checkpoint,
    .controls-left-fence,
    .controls-left-camera {
      width: 340px;
      font-size: 12px;
      position: relative;
      border-radius: 4px;
      height: calc(100vh - 56px);
      background: rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 4px 0px rgba(37, 39, 50, 0.5);
      .el-icon-close {
        font-weight: bold;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          color: #2c78bb;
        }
      }
    }
    .controls-top {
      position: absolute;
      top: 0;
    }
  }
  .realTimeButton {
    position: absolute;
    left: 10px;
    bottom: 10px;
  }
}
</style>
<!--three样式修改-->
<style>
</style>
