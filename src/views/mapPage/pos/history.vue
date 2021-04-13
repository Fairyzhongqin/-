<!--
 * @Descripttion: 目标跟踪
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-11-26 15:07:15
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-12-10 18:06:05
 -->
<template>
  <div class="cesium-history-container">
    <el-form :inline="true" :rules="rules" :model="formData" ref="form" class="search-form">
      <el-form-item prop="date">
        <el-date-picker v-model="formData.date" :disabled="status" value-format="yyyy-MM-dd HH:mm:ss" size="mini" type="datetimerange" style="z-index:1;" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="name">
        <el-autocomplete class="inline-input" v-model="formData.name" :fetch-suggestions="querySearch" :placeholder="searchType==='0'?'请输入姓名或工号':'请输入车牌号'" @select="handleSearch" :disabled="status">
          <el-select v-model="searchType" slot="prepend" size="mini" placeholder="请选择" :disabled="status">
            <el-option label="人员" value="0"></el-option>
            <el-option label="车辆" value="1"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="searchData()" v-if="!status"></el-button>
        </el-autocomplete>
      </el-form-item>
    </el-form>

    <!--播放组件-->
    <transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
      <div v-show="toolVisible" v-loading="playLoadStatus" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="play-tool flex flex-row" v-if="this.timeArray.length > 0">
          <div class="play-control">
            <icon-svg name="bofang" v-if="!playStatus" @click.native="play"></icon-svg>
            <icon-svg name="zanting" v-if="playStatus" @click.native="puse"></icon-svg>
          </div>
          <el-slider class="play-progress" v-model="timeIndex" @change="handleSliderChange" :min="0" :max="timeArray.length-1" :format-tooltip="()=>{return timeArray[timeIndex].rpttime}"></el-slider>
          <div class="tool-time flex flex-column">
            <span>{{timeArray[timeIndex].rpttime.split(' ')[0]}}</span>
            <span>{{timeArray[timeIndex].rpttime.split(' ')[1]}}</span>
          </div>
          <div class="play-close" @click="close"><i class="el-icon-close"></i></div>
        </div>
        <div class="data-empty" v-else>暂无轨迹数据
          <div class="play-close" @click="close"><i class="el-icon-close"></i></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { pList } from '@/api/pos/person'
import { vehicleList } from '@/api/pos/vehicle'
import { getPersonPosition, getPersonTrail } from '@/api/cesiumMap/index'
import { dateFormater } from '@/utils/commond'
import { translateXyToLnglat } from '@/utils/cesiumMap'

export default {
  inject: ['cesiumMap'], // 多级祖孙传值-接受方
  components: {
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value) {
        value = value.map(res => {
          return new Date(res)
        })
      }
      console.log(Math.floor((value[0].getTime() - value[1].getTime()) / (1000 * 3600)))
      if (Math.floor((value[1].getTime() - value[0].getTime()) / (1000 * 3600)) <= 12) { // 如果时间间隔小于等于12小时
        callback()
      } else {
        callback(new Error('查询时间间隔不能大于12小时'))
      }
    }
    return {
      formData: {
        date: [], // 时间段
        name: '', // 员工姓名
        id: null, // 工号或车牌号
        object: null // 存放查询德实体（人或车）
      },
      playLoadStatus: false, // 播放组件的数据查询状态 显示loading
      toolVisible: false, // 播放组件的显示状态
      timeIndex: 0, // 时间控件的index
      timeArray: [], // 时间数组
      playStatus: false, // 播放状态
      searchType: '0', // 查询类型 0：人、1：车
      interval: null,
      personIcons: [ // 人物图标base64
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADkklEQVRIS8WX20tUURSHv+NkzaCZJqiUQ1FQRlZmGdmF7GZkFKQRFFR0IymC6PJQf0A9ZNFLZlFGBQVRPhQo3S9khWYlml0oqYxQwXLSdGouO/Y5nuaMOnPOPGT7bZi117fX2r+19joKFpY4i50UliLIBaYBY4FhPVtdwAegBoWbNFOhbMRt5lYJZyDKSMTBHgSFQIJqa3dCzHiIjte2etrh51twN+muvqNQQjdHlHzaQvkPCRblrAeOAonEpoNzCySvAHtq/77cX6DlGjSdhs56aSOhu5U8zve3oQ9YnCQaJyXAJhWSdhiS80EJm5yAbyGgpQze7AN5GCiliUJlGx7jAYK89UCvAstJWg6TzgRSanZpvf+XV1C3GVqvy3+u00SBER4MLueMGmnqJph4HBRbpLhge+GDVzvgS6kauZLHZt3gL7jnTs+pkU69HB7a9QHqtoKrBuJnwKTT4BjV/yEl/MVqPfIN+p2rYFW9dt5iT01k9nPz9D6ZA66qAGj4PJhxK3R2ZNorM+Wdt+FmvFS7Bq7gIIL9ZFyClILw6ZUR3HAE20Q5IFeWc5jVfBVergGFQ8pSDihqc0jmK7HpCcyusabeyizoqA1Q4rNh5gOTAwuonCZL7TstjFBEBSsRlDHhGIzabk1MnQ1Quw466iBuKky5ADHjzPd+KobXu2TU+Yoo5wRQSE5j6OYQyqX/N0QNNgfqFrKu74+Rv0okuAq7M4sc2W4trp/v4cksiBoCwgMJc2BCEThGmzu4P1a212oJbiNx0XCyys036RZSJFIsxiUFNrnUXJzVedB2+5sEe0lZZSPjojVwYxG8O9C/7aChsKAZoqJD+3q5Fpqv+KyBhR8eZUBXI4jffZ2mn4L6bbIwYWFr+D5gAJun2u+Be07wfAP7SIjL1DuRdojFP+BhGvi6YP4nsPWqc+NRDam2Ji7/L/B1g0zn07ngehZwJ8F6es36u0FckZVTR73W/qSY/N2BiG12c40ElVOkDaRhJ3w+CWlF8GZvZOCgBhJpy7yTpI07OR81wXnbIfsxDJseWcuU1pYfCZ8bbsVpgCW/tPb3+QQMToLMKxA/MzS89yOhgq0+i8ILd1NBlteiVvB2wrM8aH8KthhYKGt4SF94qGdRhWvDnfkgINUtlw7wuqB6GcRNhonFfaHhBgHdWvyP0UeNWpswB37YM8AHdrw1XtCAD/RB8P/xCRN0gH/w0fYHzVmmxF/XreAAAAAASUVORK5CYII=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAEU0lEQVRIS8WXa2wUVRTH/3dmX3W7few29AFJH6glVSG1K8ZAglpSQYGmGCppiA/qh36pgpjoNlVCUykoiAYS+gGJEIWEh6YSUbFFKfFDa5uIjdY2pQ95Vrrd3c5u2Z2dmWvuNLvu2n1MTaT32+See373nHvu/54h0DBGCgpMFitdSzm+AkAZAV1MgXS2lAAeCnIVQC9R5AvCJPmmcHTUn8wtSWRwfclCm8Fs3MGB1lFCMpktl5MLPr8QxKJyQQUP5LERKLdvqd+EUpcC0ir6AvsX/XHDGc9/XPCEvfBFBfiQgNj4xQ/CVFUNw6rV4LNzYvqSx29DvNQO/5enIF8dBAV1csAbWT0jx2MtmAXuKYO+gBS1UmArl50L87a3YXy6AiAJk/OPb0oRuHgBvo/2QBm/xY7i6CgdrrP3Ihi5gShvDJpPis4CWG9YVY7Ud1vAWdKSHVfMeUWYgrfJAfFSB5s/N0aHn4+ER4En7EWfsEhNlZtgduwC4bj/BA0toooCX8tO+NtOq5Fn9QzXhubCYHamFOQYi9Sy92BCqHz9TwhNDZD6+6B/eJmaGT53YcxNMrjwVr0aOQF9KXTmKlit3lTDAJ+dZ8s40ZY0ve5XqiH99msYpC9bjvTDMWtItWFpd9dUQh6/6RS9YjGrdhX8V1nRbkLgsLR8DGP5MwnTS2UZziceirYxGpF1+UrCdYGO7yA4XgelaFnQO9xAVHGwkZvc/cWZmSfaNFWva0sV5MH+MEi3tBQZR04mrgdK4aqphDI04BKcNI9MPJpfRTn+C/ObjUip3qKpmKThIQiNOyAPDYAvLkFa835VVJKNu6c+g29fM4gibyR37EWHAdRlnvsxrjjEc0iDQRC9PhkvPM9ExrX+SfbdysDdXE7uY9avftDu4NoY3C9vAtEbQKUg9KV2mLc7wOctSupjcsNTTF5/JhP2Qqfu8RXW9INHky4KGUw5tkHs+Dba3mSCZeceGMvXJPTjqd8KqeunSXLHXigZVj/Lp+0+oAk8ffwIpg/ti2lLzGZYv+8C0eni+ppq2A6x/bysCcxEwL15HeQb14BglOSqgNR33oO3uRHsrlg7uhPqQBisJdVUkjC5diWoxw1uQQ50S0ogdl4MR2W7fAWujRWg/ruwnu8EMZriRhyRam3FRUURNOAHuc8MT+1mSL/3RYHBqptSEJ5PeGTh4prrdZKGBuGu2QCwqAIzjQaLmBiNSWsk6jrNVUC8e3fBf/aken18B1rmBI4SkLlKprN8OagwBevXnXC98ByoV0DGp6ehK3lkbpLJrLU+ElQMwLlymQrI6uqH94Nm+M98DmK1Ie39Q9AvLY0Ln/VIMEutzyJ7mSbXrAAUBbaObtBpHzz1tZD6fgFSUmBr71LV7N8j7rPIDLU2AjQozlSvYaaYFK+Aqddehe6BYqQ6mmZBEzYCIet5aX0YfN6avRD8nre3kQd0zxv6SPi8/MJEbuD/+Gn7G7picUEX1Q4IAAAAAElFTkSuQmCC',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAEK0lEQVRIS8VXXWwUVRT+7uzf7E/a3dbYdrcNMX2wWNDWBpA0MbVQGipoxCcx0aAx1PgkmhiJBokJhgfkSWljsIFEfTCS+LdNAZUQGpSCVGlpJdYKZWtrst0u7c7O7szOMXe2u92lO/vzIL2vc+757jnnO985w1DM6ZsUa6rd2wWibQBrAVBPoHJ+lYGFAUwAdEVj7PQ/M/P92POAXMgty2fgO3W7EnbHGyB0A/BwW5/IUO8UUG5JXg0rhImIhoBMKVchMPQgKh0J7KoNGvk3BPb5Qy8A9CGAygaXgOfrzOisMsMrCjl9TcsaBmZVfDalYnxR4zZBgO0LdHlO5rqwEriXLN66+R4GeskrMhxosKGrygyWNzfLrokA/6yKg+MxTMsEAvt0esrdjb1MyXxAtrtesvjq5r8CaGfn/SYcXS+ibCmlhWp29/c7CuH1azIG/k1wJnwbmHI/mwmeBez1h47zSJ+rteBwow1CkVEaPUoj4K3RGL64rSQj7/K8nLJNu16q6Qke6SfN9rygf0sa9l2T8XtYQ7ObZ8aGWnvu2nPwV65GU5G/mKq5DqyzV3T84RVZ5dlWR8H07rwo4WpYJ5B+NleY8OVGu2E1eNq3Dkq85kHI0oOc7Ung/rlDILzd2yTiyWpz3nImCFgzsJhlw4n+5zZX3nvfz6jYOyzzxv8gsL1iP0PfpOirKp9ucAmeM62OotjbOShhdGE54ha3gK8fc+QF5mzvGJR4q4UCs2Evq+kPPSMQnXp/rRV71liLIu+NRQ2v/SZjbEHDujIBHz0i6qJS6PTdjOPdsTg0xnYxn3/uGIDuS20OQ3EwcqhoBEsJ1Ocis/GcxN31MJ8/dMknYsMvbc5CD05/n4xo2HExCqsAKETY5DHhvbU21BkwO9PxpnMRBGQMceDg45VCxecbjFl594s4SThZMg/HPPqwiB0FyLl7KIrzQW2Oef1z6lPVZtOxJrGoiD/+K45DN+I5bV1mYKTdCXOe9L86LOObGTVRFDAXgfYLEdyUCEp6CC1jH1lnw5sjMfBPo1uc6cmV63Vp4GJSrWqE5p8khBRCjciwvkzAaV2Dk2eiw4nW8xKkBOHXJ5wQTcZam051seSKaQQ5AfB0Pv1zFMMZysWBObv5LDIVGGMZ5CqtncYWEugYjIKrlbykIRzYlifKVGay2qlUAdl/PYaTtxQcaLDi4HiSZMUCZwlIqZLZ+MMiwgpwuc2B9gsS7qjAd5vtaCo3lSaZpQyJWIJQfyaiA0x1uvDOWAwnbim4z8pw/FERLW5j8JVDooSxqBKh+UcJCSJc3+pCRCXsvhzFlXkNDhMwssUJa44eNhyLetTJ5a7gIhDXOHcB2xLAAgcfiuKhMgGHG1eKUN5FIFWcVVl9dPDVWvZS4Pd+vc1oiHu/0GeCr8YvTJYa/A8/bf8BhDha91Yg58IAAAAASUVORK5CYII=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAETklEQVRIS8WXXUybVRjH/4eutKV7K1CyuYnCXAsmY3xUEUr2gTPihmNmTkx0OhQnEA2Jjsm0V73CWApeOaCRbkzdjbhFWDbDInMm0/ExRRgmrC0R4xZjKAVKoaUfrznvbNcKb/v2wvFcP+f5nefzPIdAgOj1eqlCLt8XYNkygDwOYCuAB/49OgfABrA3Egjpm3e5Lun1encssySaQlNTk1IiEjewBHUAUqguo2CQmpICqVTCHXW7PZhxOOCcdwZNOQiLdo/f26LT6ex89nnBLQbDkQCLVkKIMi1NidzcHKjUW8EwzKq2nE4nrBYbRkdvYnraDpZl7QkExxoaG8+sdmAFuKOmRuxUqdoBUs0w61H61C6o1SoQEjU4Idssy8JiseL7Kz/A6VwAwJoZq7Wu1mTyhl8gwtpdqPprABUq1aPYu68MEsndkMYrHo8H317qg9U6SY/2MlbLoXB4BNhoMHRST7dv34Znyp4W7CXfpaj3l/u+w9jYOOf58cbGN4O6ITDNKQvSRT098Pz+qFCbzYY3qt/C8PANFBU9iVPmz5CZmbEqn8J7vrnAeU7AVgVzzoFp9YpF6yYUCkZZ9fqrMcNbrN2BgYHBEKi0dDeu9F/mzQYNe9fpLzA/77R7/b5sWu0cuOXj5iaW4MOKA+XIylJHTaff78c6sSxCRyaTYdFF25lfbt2yoLfnIgiLjxpOvK8jdDisT5LfSUtTphypOiworwWaQoyM/BqilGi1uHbtalQwDfmZri9pqzkWFl2bSWtz88EAi3N79uxGgSZfUPGOj/+GVw6/htHRMWgKCnD27OfIzs6KefaXn0fQ338VCQQvEKPB0AaQupraat7hwGdxeXkZiYmJMYFBBTpkTB1mWuHtxGhoHmQUTGFNTbVgA3RAFBWXIDFRAq/Xi107d6C11YgtWzJj2jCZzHS8DlGwPSPjkdQXKw/GPBRUqHzpZXR30zlzT5KSZDh9yozKykNR7XR/dR5TU3/MULAvO1st2l9RLghsMBhx4gPdqrp0jtun/4JYLOa1daH3IiYmLH5B4EAggJycfNgmJ0Hz+l/p7DTh6NFa+jDAMfM3kpOTBYFjhprmcdPmh2G3zyA9/SFoNBr09PSGjC8tzkOlfgwu1yLu3J4C7Ws+CQ+1oOKi02dpaYmrfG3JTgwNDUeAg+EViURRUxZWXPG109jYTeTmaTiv6EWoUI+lUmnMGolop3gHyNvv1KOtrQOftBrx3rHjcYEjBki8IzNVuQEOxyxu//k7tuXkY3Z2FoMDP6Kw8In4RibVFvpIuN1uyJIUHCDg96C+/l18erINGzduwPlz3dBqi3nhKx4Jqin0WfT5fHhwUzr8/gDXNgsLCygrK8dP169DLpdzPbzaxsL7LHJeC1wEqBGWRWjLnJubw7N7n0NeXi462k+u8DjqIhDUXpPVh8LXbNm7B7/P6214gu77Qh8OX5MvTPgF/o9P2z9ys3nRpdBhMQAAAABJRU5ErkJggg=='
      ],
      carIcons: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADjElEQVRIS72XTWxUVRTHf+eVYqE0yrTQ0oaPKNEQSANtNCASQAnVRBYCC6JBTGXBgoXigoAYFkaJJCAJJHRBCRqIbvhINBEwFFJC+FC+GhQ0GAvFtrSMRFoYoZ13zJl5U+bNzJtCqXM3k8w99/zu+d97zj1PeIShqgXAG8B8oBp4DnjaW/oP8AdwFjgM/CAi//bnVrIZqGox8BGwAhhpth0R5a+70N0TXzkiHyoKYfSwPle3gTpgk4iEg/wHglX1XWAzUNzcpRy8rpy8CeGAWIoLYEYpvD5OmFAUc2vQVSLydSZ4GlhV870d13ZGlB2XlRPt/Qnnn59ZBssnCaPiKuw0xUTE0yhu6wN70L3AglPtypdNyt3ex4MmrAuHwIeVwvSyGOI7YFEyPBVcD9Qeuq5su6TowJh9q8z5yilCzbh45CLyfmKyD+yd6VcW6WfnnhyaDPi4qi/yZYkzj4G92/tbZ0SLVx4fuLxBApns22bFztwu3At22xPgz4E1G865aRepolCZ9Eyw5g9cOHVTsN9swy7cmirHTDaIyFrxikNrc5eOtGiTh5nteS1K0dDsTg/8Key4EnOadVjUE4rE8rzcwG8B++p+cfn+mn9dvgP7a6L9+eNiGL69Ggd39UBzV+by8OZ4WDE5ZrfQwNstz95rcLmVUhweFZy8M1XYekk4fCNdgZIC2PVq7P86A5/piOiLtUfTk+dxwLt/Fy6EhSUTXapKYEuT0NCaDt85V6y8/mTg8PlbGvrkzJOBN15waGwTbLPrqqJMLYFNF4XGNj/805eEaSXyt4F7j7dp3hfnBwdsOg51YH11lMkhePuIw73eh2e+epowa4xE/xewwedVKB9UuixtcLh9PzN4UKS2VyuSVNeH50PoKdLAyVIPyuUKyrnUiJMvV2A6DXHggJfHdx7A2U5hTrkiWdqHxlZhSkgJWc+CP+LUdAosILZwZpmyqtLlxxtC3a8O9bOj3OmBY61++sulytgR8M6RPJY+77L4WaX+inCwxeG+V4NSC4jtLWPJTMi3eqrLjNJ4yzO+yNLE4WgKePpoZV21S0s3lA2HpjCs/znPdwK+kum9ToGPhM0Py1OWTIxHdLoDDrVkrstzy5VXxijt9+Cbq0J3z0NV0h4JD2xNXe6fRQ9uzV1uG4HEQahq7lsfL2rrMHPf7CXBrSHPXXvrf1dz3NCnwHP/CZOygUH/aPsPQdf3UHcUdfsAAAAASUVORK5CYII=',
      rules: {
        date: [{ required: true, message: '请选择查询时间段', trigger: 'blur' },
        { validator: validatePass, trigger: 'blur' }],
        name: [{ required: true, message: '请选择姓名或车牌号', trigger: 'blur' }]
      },
      status: false // 组件禁用（编辑）状态 当被其他组件调用时为true 这时只提供轨迹绘制功能 不能选择时间段和人员
    }
  },
  created () {
  },
  mounted () {
  },
  computed: {},
  watch: {
    timeArray: {
      handler (val, oldval) {
        if (val.length === 0) {
          this.cesiumMap.historyPlayerStatus = false
        }
      },
      deep: true
    }
  },
  methods: {
    querySearch (queryString, cb) {  // 调用 callback 返回建议列表的数据
      queryString = queryString.split(' [')[0]
      let dataList = []
      if (queryString === '') {
        cb(dataList)
      } else {
        if (this.searchType === '0') { // 查询人
          pList({
            'conditions': queryString // 姓名或工号
          }).then(({ data }) => {
            if (data && data.code === 0) {
              dataList = data.page.list
              if (dataList.length <= 0) {
                dataList = [{ value: '暂无数据' }]
              } else {
                dataList.map(val => {
                  val.value = val.name + ' [' + val.gh + '] '
                })
              }
              cb(dataList)
            } else {
              dataList = [{ value: '暂无数据' }]
            }
          }).catch((err) => {
            console.log(err)
            cb(dataList)
            this.$message.error('未知异常！请联系管理员')
          })
        } else { // 查询车
          vehicleList({
            'numberPlates': queryString // 车牌号
          }).then(({ data }) => {
            if (data && data.code === 0) {
              dataList = data.page.list
              if (dataList.length <= 0) {
                dataList = [{ value: '暂无数据' }]
              } else {
                dataList.map(val => {
                  val.value = val.numberPlates
                })
              }
              cb(dataList)
            } else {
              dataList = [{ value: '暂无数据' }]
            }
          }).catch((err) => {
            console.log(err)
            cb(dataList)
            this.$message.error('未知异常！请联系管理员')
          })
        }
      }
    },
    // 目标信息
    handleSearch (val) {
      console.log(val)
      this.formData.id = (this.searchType === '0' ? val.gh : val.numberPlates)
      this.formData.object = val
      getPersonPosition({ bindId: this.formData.id }).then(({ data }) => {
        if (data && data.code === 0) {
          if (data.cardEntity) {
            this.$emit('handleEvent', 'showWorkerInfo', data.cardEntity, this.searchType) // 显示人员信息看板
          } else {
            this.$emit('handleEvent', 'hideWorkerInfo')
            this.$message.error('该人员/车辆尚未绑定胸卡')
          }
        } else if (this.searchType) {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        console.log(err)
        this.$message.error(err.msg)
      })
    },
    searchData (imPlay) { // 搜索数据
      if (!this.formData.id) {
        return
      }
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.playLoadStatus = true
          this.puse()
          this.playStatus = false
          this.timeIndex = 0
          this.cesiumMap.$refs.mapShow.removeGuiJi()
          this.timeArray = []
          this.toolVisible = true
          await getPersonTrail({
            startTime: this.formData.date[0],
            endTime: this.formData.date[1],
            bindId: this.formData.id
          }).then(({ data }) => {
            if (data.list.length > 0) {
              this.timeArray = data.list.map(res => {
                res.x = translateXyToLnglat(res.lngcoord, res.latcoord).x
                res.y = translateXyToLnglat(res.lngcoord, res.latcoord).y
                res.z = res.altcoord
                return res
              })
              let nameStyle = {
                font: '16pt',
                fillColor: 'rgba(255,255,255,1)',
                backgroundColor: 'rgba(0,0,0,0.9)',
                showBackground: true,
                pixeLoffset: [-(this.formData.object ? this.formData.object.name.length : 2 / 2) * 16, -25]
              }
              this.cesiumMap.$refs.mapShow.initGuiJiData(
                this.searchType === '0' ? 'person' : 'car',
                this.formData.id,
                this.timeArray,
                this.searchType === '0' ? this.personIcons[parseInt(this.formData.object.icon)] : this.carIcons,
                this.formData.object ? this.formData.object.name : '',
                nameStyle,
                [18, 18]
              )
              if (imPlay && this.timeArray.length > 0) { // 是否需要立即播放
                this.play()
              }
            }
          }).catch(err => {
            console.log(err)
            this.$message.error(err.msg)
          })
          this.playLoadStatus = false
        }
      })
    },
    startShowHistory () { // 地图展示轨迹
      this.interval = setInterval(() => {
        (this.timeIndex !== this.timeArray.length - 1) || this.puse()
        this.cesiumMap.$refs.mapShow.setGuiJiDataIndex(this.timeIndex)
        this.timeIndex = this.timeIndex < this.timeArray.length - 1 ? this.timeIndex + 1 : this.timeIndex
      }, 1000)
    },
    play () { // 播放
      if (this.timeArray.length > 0 && this.timeIndex === (this.timeArray.length - 1)) { // 如果点击播放的时候进度条已经在最后了 则从头开始放
        this.timeIndex = 0
      }
      this.startShowHistory()
      this.cesiumMap.historyPlayerStatus = true // 告诉父级开始播放轨迹了，websocket推送的人和车默认要隐藏
      this.playStatus = true
      // 播放前隐藏所有人/车
      this.cesiumMap.$refs.mapShow.setObjectVisible('person', null, false)
      this.cesiumMap.$refs.mapShow.setObjectVisible('car', null, false)
    },
    puse () { // 暂停播放
      clearInterval(this.interval)
      this.playStatus = false
    },
    close () { // 关闭播放组件
      clearInterval(this.interval)
      this.playStatus = false
      this.timeIndex = 0
      this.toolVisible = false
      this.cesiumMap.$refs.mapShow.removeGuiJi()
      this.timeArray = []
      if (this.status) return // 如果是外部调用该组件则无须显示人员车辆
      // 结束播放后显示所有人/车
      this.cesiumMap.$refs.mapShow.setObjectVisible('person', null, true)
      this.cesiumMap.$refs.mapShow.setObjectVisible('car', null, true)
    },
    handleSliderChange () { // 滑块拖动事件
      if (!this.playStatus) { // 如果当前不在播放
        this.cesiumMap.historyPlayerStatus = true // 告诉父级开始播放轨迹了，websocket推送的人和车默认要隐藏
        // 播放前隐藏所有人/车
        this.cesiumMap.$refs.mapShow.setObjectVisible('person', null, false)
        this.cesiumMap.$refs.mapShow.setObjectVisible('car', null, false)
        // 绘制轨迹
        this.cesiumMap.$refs.mapShow.setGuiJiDataIndex(this.timeIndex)
      }
    },
    loadHistory (bDate, eDate, id, name, iconType) { // 加载轨迹 此方法供外部调用 传入时间和人员id查询轨迹
      this.status = true
      this.formData.date = []
      this.formData.date.push(bDate)
      this.formData.date.push(eDate)
      // this.formData.date.push('2019-12-22 08:00:00')
      // this.formData.date.push('2019-12-22 10:00:00')
      this.formData.id = id
      this.formData.name = name
      this.formData.object = {
        name,
        icon: iconType
      }
      this.searchData(true)
    },
    test () { // 测试方法
      let x = 120.093129
      let y = 31.935976
      let z = 0
      let date = new Date()
      for (let i = 0; i < 800; i++) {
        x += 0.00001
        y += 0.00001
        date = new Date(date.getTime() + 1000)
        this.timeArray.push({
          rpttime: dateFormater('YYYY-MM-DD HH:mm:ss', date),
          x: x,
          y: y,
          z
        })
      }
      let nameStyle = {
        font: '16pt',
        fillColor: 'rgba(255,255,255,1)',
        backgroundColor: 'rgba(0,0,0,0.9)',
        showBackground: true,
        pixeLoffset: [-(4 / 2) * 16, -25]
      }
      this.cesiumMap.$refs.mapShow.initGuiJiData('pers', '00025', this.timeArray, 'data:image/png;', '测试人员', nameStyle, [18, 18], true)
    }
  },
  beforeDestroy () {
    this.cesiumMap.historyPlayerStatus = false
  }
}
</script>

<style lang='scss'>
.cesium-history-container {
  .search-form {
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
    }
    .el-form-item.is-error .el-input__inner {
      border-color: #e63031 !important;
    }
    .el-form-item__error {
      font-size: 14px;
      text-shadow: 0 0 9px #ffffff;
    }
    .el-autocomplete {
      .el-input-group__prepend {
        border: 0px;
        width: 60px;
        .el-input__inner {
          padding: 0 8px;
        }
        .el-input__suffix {
          right: 2px;
        }
      }
    }
  }
  .play-tool {
    margin-top: 5px;
    background-color: rgba(0, 0, 0, 0.6);
    position: relative;
    border-radius: 3px;
    .play-control {
      color: #fff;
      font-size: 24px;
      cursor: pointer;
      margin: 7px 7px 0 7px;
    }
    .tool-time {
      padding: 5px;
      // background-color: #006ac7ed;
      color: #fff;
      border-radius: 5px;
      font-size: 8px;
      text-align: center;
    }
    .play-progress {
      flex: 1;
      margin: 0 8px;
    }
    .play-close {
      width: 25px;
      font-size: 16px;
      text-align: center;
      margin-top: 9px;
      cursor: pointer;
      .el-icon-close {
        color: #fff;
      }
    }
  }
  .data-empty {
    margin-top: 5px;
    background-color: rgba(0, 0, 0, 0.6);
    position: relative;
    border-radius: 3px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    line-height: 38px;
    .play-close {
      position: absolute;
      font-size: 16px;
      top: -1px;
      right: 4px;
      cursor: pointer;
      .el-icon-close {
        color: #fff;
      }
    }
  }
}
</style>
