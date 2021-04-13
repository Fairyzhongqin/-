<!--
 * @Descripttion: threejs的弹框模式
 * @version: 
 * @Author: Mr.What
 * @Date: 2020-01-02 19:01:07
 * @LastEditors  : Mr.What
 * @LastEditTime : 2020-01-04 14:58:00
 -->
<template>
  <div class="three-map-dialog-container" ref="threeMapDialog" v-loading="loadStatus" :element-loading-text="loadText" element-loading-spinner="el-icon-loading" element-loading-background="rgb(48, 49, 51)">
  </div>
</template>

<script>
import { APP } from '@/assets/threeJsLib/threeApp'
import { positionInit } from '@/api/cesiumMap'

var player = null

export default {
  props: ['personList'], // 需要显示的人员
  components: {},
  data () {
    return {
      buildID: '',
      loadStatus: true, // 模块页面加载状态
      loadText: '', // 加载提示文本
      personIcons: [ // 人物图标base64
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADkklEQVRIS8WX20tUURSHv+NkzaCZJqiUQ1FQRlZmGdmF7GZkFKQRFFR0IymC6PJQf0A9ZNFLZlFGBQVRPhQo3S9khWYlml0oqYxQwXLSdGouO/Y5nuaMOnPOPGT7bZi117fX2r+19joKFpY4i50UliLIBaYBY4FhPVtdwAegBoWbNFOhbMRt5lYJZyDKSMTBHgSFQIJqa3dCzHiIjte2etrh51twN+muvqNQQjdHlHzaQvkPCRblrAeOAonEpoNzCySvAHtq/77cX6DlGjSdhs56aSOhu5U8zve3oQ9YnCQaJyXAJhWSdhiS80EJm5yAbyGgpQze7AN5GCiliUJlGx7jAYK89UCvAstJWg6TzgRSanZpvf+XV1C3GVqvy3+u00SBER4MLueMGmnqJph4HBRbpLhge+GDVzvgS6kauZLHZt3gL7jnTs+pkU69HB7a9QHqtoKrBuJnwKTT4BjV/yEl/MVqPfIN+p2rYFW9dt5iT01k9nPz9D6ZA66qAGj4PJhxK3R2ZNorM+Wdt+FmvFS7Bq7gIIL9ZFyClILw6ZUR3HAE20Q5IFeWc5jVfBVergGFQ8pSDihqc0jmK7HpCcyusabeyizoqA1Q4rNh5gOTAwuonCZL7TstjFBEBSsRlDHhGIzabk1MnQ1Quw466iBuKky5ADHjzPd+KobXu2TU+Yoo5wRQSE5j6OYQyqX/N0QNNgfqFrKu74+Rv0okuAq7M4sc2W4trp/v4cksiBoCwgMJc2BCEThGmzu4P1a212oJbiNx0XCyys036RZSJFIsxiUFNrnUXJzVedB2+5sEe0lZZSPjojVwYxG8O9C/7aChsKAZoqJD+3q5Fpqv+KyBhR8eZUBXI4jffZ2mn4L6bbIwYWFr+D5gAJun2u+Be07wfAP7SIjL1DuRdojFP+BhGvi6YP4nsPWqc+NRDam2Ji7/L/B1g0zn07ngehZwJ8F6es36u0FckZVTR73W/qSY/N2BiG12c40ElVOkDaRhJ3w+CWlF8GZvZOCgBhJpy7yTpI07OR81wXnbIfsxDJseWcuU1pYfCZ8bbsVpgCW/tPb3+QQMToLMKxA/MzS89yOhgq0+i8ILd1NBlteiVvB2wrM8aH8KthhYKGt4SF94qGdRhWvDnfkgINUtlw7wuqB6GcRNhonFfaHhBgHdWvyP0UeNWpswB37YM8AHdrw1XtCAD/RB8P/xCRN0gH/w0fYHzVmmxF/XreAAAAAASUVORK5CYII=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAEU0lEQVRIS8WXa2wUVRTH/3dmX3W7few29AFJH6glVSG1K8ZAglpSQYGmGCppiA/qh36pgpjoNlVCUykoiAYS+gGJEIWEh6YSUbFFKfFDa5uIjdY2pQ95Vrrd3c5u2Z2dmWvuNLvu2n1MTaT32+See373nHvu/54h0DBGCgpMFitdSzm+AkAZAV1MgXS2lAAeCnIVQC9R5AvCJPmmcHTUn8wtSWRwfclCm8Fs3MGB1lFCMpktl5MLPr8QxKJyQQUP5LERKLdvqd+EUpcC0ir6AvsX/XHDGc9/XPCEvfBFBfiQgNj4xQ/CVFUNw6rV4LNzYvqSx29DvNQO/5enIF8dBAV1csAbWT0jx2MtmAXuKYO+gBS1UmArl50L87a3YXy6AiAJk/OPb0oRuHgBvo/2QBm/xY7i6CgdrrP3Ihi5gShvDJpPis4CWG9YVY7Ud1vAWdKSHVfMeUWYgrfJAfFSB5s/N0aHn4+ER4En7EWfsEhNlZtgduwC4bj/BA0toooCX8tO+NtOq5Fn9QzXhubCYHamFOQYi9Sy92BCqHz9TwhNDZD6+6B/eJmaGT53YcxNMrjwVr0aOQF9KXTmKlit3lTDAJ+dZ8s40ZY0ve5XqiH99msYpC9bjvTDMWtItWFpd9dUQh6/6RS9YjGrdhX8V1nRbkLgsLR8DGP5MwnTS2UZziceirYxGpF1+UrCdYGO7yA4XgelaFnQO9xAVHGwkZvc/cWZmSfaNFWva0sV5MH+MEi3tBQZR04mrgdK4aqphDI04BKcNI9MPJpfRTn+C/ObjUip3qKpmKThIQiNOyAPDYAvLkFa835VVJKNu6c+g29fM4gibyR37EWHAdRlnvsxrjjEc0iDQRC9PhkvPM9ExrX+SfbdysDdXE7uY9avftDu4NoY3C9vAtEbQKUg9KV2mLc7wOctSupjcsNTTF5/JhP2Qqfu8RXW9INHky4KGUw5tkHs+Dba3mSCZeceGMvXJPTjqd8KqeunSXLHXigZVj/Lp+0+oAk8ffwIpg/ti2lLzGZYv+8C0eni+ppq2A6x/bysCcxEwL15HeQb14BglOSqgNR33oO3uRHsrlg7uhPqQBisJdVUkjC5diWoxw1uQQ50S0ogdl4MR2W7fAWujRWg/ruwnu8EMZriRhyRam3FRUURNOAHuc8MT+1mSL/3RYHBqptSEJ5PeGTh4prrdZKGBuGu2QCwqAIzjQaLmBiNSWsk6jrNVUC8e3fBf/aken18B1rmBI4SkLlKprN8OagwBevXnXC98ByoV0DGp6ehK3lkbpLJrLU+ElQMwLlymQrI6uqH94Nm+M98DmK1Ie39Q9AvLY0Ln/VIMEutzyJ7mSbXrAAUBbaObtBpHzz1tZD6fgFSUmBr71LV7N8j7rPIDLU2AjQozlSvYaaYFK+Aqddehe6BYqQ6mmZBEzYCIet5aX0YfN6avRD8nre3kQd0zxv6SPi8/MJEbuD/+Gn7G7picUEX1Q4IAAAAAElFTkSuQmCC',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAEK0lEQVRIS8VXXWwUVRT+7uzf7E/a3dbYdrcNMX2wWNDWBpA0MbVQGipoxCcx0aAx1PgkmhiJBokJhgfkSWljsIFEfTCS+LdNAZUQGpSCVGlpJdYKZWtrst0u7c7O7szOMXe2u92lO/vzIL2vc+757jnnO985w1DM6ZsUa6rd2wWibQBrAVBPoHJ+lYGFAUwAdEVj7PQ/M/P92POAXMgty2fgO3W7EnbHGyB0A/BwW5/IUO8UUG5JXg0rhImIhoBMKVchMPQgKh0J7KoNGvk3BPb5Qy8A9CGAygaXgOfrzOisMsMrCjl9TcsaBmZVfDalYnxR4zZBgO0LdHlO5rqwEriXLN66+R4GeskrMhxosKGrygyWNzfLrokA/6yKg+MxTMsEAvt0esrdjb1MyXxAtrtesvjq5r8CaGfn/SYcXS+ibCmlhWp29/c7CuH1azIG/k1wJnwbmHI/mwmeBez1h47zSJ+rteBwow1CkVEaPUoj4K3RGL64rSQj7/K8nLJNu16q6Qke6SfN9rygf0sa9l2T8XtYQ7ObZ8aGWnvu2nPwV65GU5G/mKq5DqyzV3T84RVZ5dlWR8H07rwo4WpYJ5B+NleY8OVGu2E1eNq3Dkq85kHI0oOc7Ung/rlDILzd2yTiyWpz3nImCFgzsJhlw4n+5zZX3nvfz6jYOyzzxv8gsL1iP0PfpOirKp9ucAmeM62OotjbOShhdGE54ha3gK8fc+QF5mzvGJR4q4UCs2Evq+kPPSMQnXp/rRV71liLIu+NRQ2v/SZjbEHDujIBHz0i6qJS6PTdjOPdsTg0xnYxn3/uGIDuS20OQ3EwcqhoBEsJ1Ocis/GcxN31MJ8/dMknYsMvbc5CD05/n4xo2HExCqsAKETY5DHhvbU21BkwO9PxpnMRBGQMceDg45VCxecbjFl594s4SThZMg/HPPqwiB0FyLl7KIrzQW2Oef1z6lPVZtOxJrGoiD/+K45DN+I5bV1mYKTdCXOe9L86LOObGTVRFDAXgfYLEdyUCEp6CC1jH1lnw5sjMfBPo1uc6cmV63Vp4GJSrWqE5p8khBRCjciwvkzAaV2Dk2eiw4nW8xKkBOHXJ5wQTcZam051seSKaQQ5AfB0Pv1zFMMZysWBObv5LDIVGGMZ5CqtncYWEugYjIKrlbykIRzYlifKVGay2qlUAdl/PYaTtxQcaLDi4HiSZMUCZwlIqZLZ+MMiwgpwuc2B9gsS7qjAd5vtaCo3lSaZpQyJWIJQfyaiA0x1uvDOWAwnbim4z8pw/FERLW5j8JVDooSxqBKh+UcJCSJc3+pCRCXsvhzFlXkNDhMwssUJa44eNhyLetTJ5a7gIhDXOHcB2xLAAgcfiuKhMgGHG1eKUN5FIFWcVVl9dPDVWvZS4Pd+vc1oiHu/0GeCr8YvTJYa/A8/bf8BhDha91Yg58IAAAAASUVORK5CYII=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAETklEQVRIS8WXXUybVRjH/4eutKV7K1CyuYnCXAsmY3xUEUr2gTPihmNmTkx0OhQnEA2Jjsm0V73CWApeOaCRbkzdjbhFWDbDInMm0/ExRRgmrC0R4xZjKAVKoaUfrznvbNcKb/v2wvFcP+f5nefzPIdAgOj1eqlCLt8XYNkygDwOYCuAB/49OgfABrA3Egjpm3e5Lun1encssySaQlNTk1IiEjewBHUAUqguo2CQmpICqVTCHXW7PZhxOOCcdwZNOQiLdo/f26LT6ex89nnBLQbDkQCLVkKIMi1NidzcHKjUW8EwzKq2nE4nrBYbRkdvYnraDpZl7QkExxoaG8+sdmAFuKOmRuxUqdoBUs0w61H61C6o1SoQEjU4Idssy8JiseL7Kz/A6VwAwJoZq7Wu1mTyhl8gwtpdqPprABUq1aPYu68MEsndkMYrHo8H317qg9U6SY/2MlbLoXB4BNhoMHRST7dv34Znyp4W7CXfpaj3l/u+w9jYOOf58cbGN4O6ITDNKQvSRT098Pz+qFCbzYY3qt/C8PANFBU9iVPmz5CZmbEqn8J7vrnAeU7AVgVzzoFp9YpF6yYUCkZZ9fqrMcNbrN2BgYHBEKi0dDeu9F/mzQYNe9fpLzA/77R7/b5sWu0cuOXj5iaW4MOKA+XIylJHTaff78c6sSxCRyaTYdFF25lfbt2yoLfnIgiLjxpOvK8jdDisT5LfSUtTphypOiworwWaQoyM/BqilGi1uHbtalQwDfmZri9pqzkWFl2bSWtz88EAi3N79uxGgSZfUPGOj/+GVw6/htHRMWgKCnD27OfIzs6KefaXn0fQ338VCQQvEKPB0AaQupraat7hwGdxeXkZiYmJMYFBBTpkTB1mWuHtxGhoHmQUTGFNTbVgA3RAFBWXIDFRAq/Xi107d6C11YgtWzJj2jCZzHS8DlGwPSPjkdQXKw/GPBRUqHzpZXR30zlzT5KSZDh9yozKykNR7XR/dR5TU3/MULAvO1st2l9RLghsMBhx4gPdqrp0jtun/4JYLOa1daH3IiYmLH5B4EAggJycfNgmJ0Hz+l/p7DTh6NFa+jDAMfM3kpOTBYFjhprmcdPmh2G3zyA9/SFoNBr09PSGjC8tzkOlfgwu1yLu3J4C7Ws+CQ+1oOKi02dpaYmrfG3JTgwNDUeAg+EViURRUxZWXPG109jYTeTmaTiv6EWoUI+lUmnMGolop3gHyNvv1KOtrQOftBrx3rHjcYEjBki8IzNVuQEOxyxu//k7tuXkY3Z2FoMDP6Kw8In4RibVFvpIuN1uyJIUHCDg96C+/l18erINGzduwPlz3dBqi3nhKx4Jqin0WfT5fHhwUzr8/gDXNgsLCygrK8dP169DLpdzPbzaxsL7LHJeC1wEqBGWRWjLnJubw7N7n0NeXi462k+u8DjqIhDUXpPVh8LXbNm7B7/P6214gu77Qh8OX5MvTPgF/o9P2z9ys3nRpdBhMQAAAABJRU5ErkJggg=='
      ],
      floorInfo: [] // 各楼层信息
    }
  },
  created () { },
  mounted () {
    // this.init('jy_cpsk')
    // this.loadPoints()
  },
  computed: {},
  watch: {
    personList: {
      handler (val, oldVal) {
        oldVal.map(res => {
          if (val.findIndex(item => {
            return item.gh === res.gh
          }) === -1 && !this.loadStatus) {
            this.removePoint(res.gh)
          }
        })
      }
    }
  },
  methods: {
    init (buildID) {
      if (!player) {
        player = new APP.Player(this)
        window.player = player
      }
      if (window.threeJsModel) {
        this.load(buildID)
      } else {
        let loaderGltf = player.getGltfLoader()
        loaderGltf.load(
          (process.env.NODE_ENV === 'production' ? '3DModels/' : 'static/3DModels/') + window.SITE_CONFIG['mapModelName'] + '.glb',
          json => {
            window.threeJsModel = json
            this.load(buildID)
          },
          event => {
            this.loadText = `地图资源加载中(${event.loaded}byte)`
          }, error => {
            console.log(error)
          }
        )
      }
    },
    load (buildID) {
      if (this.buildID === buildID) {
        return
      } else if (this.buildID !== '') {
        player.removePoint(undefined, 'realTimePerson') // 移除所有人员
        player.removeObject(this.searchObjectByName(this.buildID)) // 移除之前的建筑
      }
      let building = this.searchObjectByName(buildID)
      if (!building) {
        this.loadText = '模型加载失败！'
        return
      }
      if (this.buildID === '') { // 首次加载
        player.load(this.formatModelData(building))
        player.play(this.$refs.threeMapDialog)
        this.$refs.threeMapDialog.appendChild(player.dom)
        this.$nextTick(() => {
          this.reSize()
        })
        this.$emit('loaded') // 加载完成事件
        this.loadStatus = false
      } else {
        player.reLoad(this.formatModelData(building))
      }
      this.splitBuilding(building) // 拆分建筑

      this.initPerson()

      let floor = this.floorInfo.length
      player.moveCamera(building.name, 60 + (floor - 1) * 15) // 移动相机
      this.buildID = buildID
    },
    initPerson () { // 加载所有存量人员
      positionInit().then(({ data }) => {
        if (data.list.length > 0) {
          data.list.map(res => {
            if (res.type === '0') { // 判断是人
              this.loadPoints(res.person.gh, res.person.name, 'realTimePerson', res.positionX, res.positionY, res.positionZ, this.personIcons[res.person.icon])
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    loadPoints (id, name, type, x, y, floor = 1, base64) {
      if (this.personList.findIndex(item => {
        return item.gh === id
      }) === -1) { // 筛选下要加载的人 如果personList不为空 且找不到这个工人 则终止加载
        return
      }

      window.removePoint = player.removePoint
      let info = this.floorInfo.find(res => {
        return res.idx === Number(floor)
      })
      if (info) {
        let z = info.minH / 1000 + (floor - 1) * 15
        player.insertOrUpdatePoint(id, name, type, [x, y, z || 0], base64, () => {
          console.log('id:' + id)
        })
      }
    },
    removePoint (ids, type) {
      player.removePoint(ids, type)
    },
    searchObjectByName (name) { // 搜寻建筑并拷贝出来
      let building = window.threeJsModel.scenes[0].getObjectByName(name)
      window.threeJsModel.scenes[0].getObjectByName('cj').getWorldPosition() // 先读取下建筑物父级的世界坐标 不然建筑物的世界坐标不准 不知道是什么bug
      if (building) {
        let worldPosition = player.createVector3()
        building.getWorldPosition(worldPosition)
        let build = building.clone()
        build.position.set(worldPosition.x, worldPosition.y, worldPosition.z)
        return build
      } else {
        return undefined
      }
    },
    reSize () { // 调整尺寸
      let showDom = this.$refs.threeMapDialog
      player.setSize(
        showDom.clientWidth,
        showDom.clientHeight,
        showDom.getBoundingClientRect().x,
        showDom.getBoundingClientRect().y
      )
    },
    splitBuilding (building) { // 拆分建筑
      this.floorInfo = []
      let objects = building.children
      objects.map(child => {
        child.defaultPosY = child.position.y // 将楼层初始高度缓存，用于重置高度
        if (child.name.indexOf('_d') !== -1) { // 如果是顶层
          // child.position.y = child.position.y + (objects.length - 1) * 6
          child.visible = false
        } else { // 非顶层
          this.floorInfo.push({
            idx: Number(child.snName.replace('f', '')),
            minH: Number(child.name.split('_').pop().split(',')[0]),
            maxH: Number(child.name.split('_').pop().split(',')[1])
          })
          child.position.y = child.position.y + (parseInt(child.snName.replace('f', '')) - 1) * 15
        }
      })
    },
    formatModelData (building) { // 给模型数据添加自定义属性
      // 写入自定义属性
      building.snType = 'building'
      if (building.name.substring(0, 1) === '_') { // 防建模师命名时手抖
        building.name = building.name.substr(1, building.name.length - 1)
      }
      building.snName = building.name.split('_')[1]
      if (building.children) {
        building.children.map(floor => {
          floor.snType = 'floor'
          if (floor.name.substring(0, 1) === '_') { // 防建模师命名时手抖
            floor.name = floor.name.substr(1, floor.name.length - 1)
          }
          floor.snName = floor.name.split('_')[2]
        })
      }
      return building
    }
  },
  beforeDestroy () {
    player = null
  }
}
</script>

<style lang="scss">
.three-map-dialog-container {
  width: 100%;
  height: 100%;
}
</style>
