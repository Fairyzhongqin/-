<template>
  <div class="menu-list-container flex flex-column">
    <!-- <div class="menu-item-logo"></div> -->
    <template v-for="(menuList, index) in menuLists">
      <div :key="index" class="menu-item" :class="menuList.name===activedItem?'actived':''" @click="handleClick(menuList)">
        {{menuList.name}}
        <i v-if="menuList.children" class="item-icon" :class="menuList.name===openItem?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
      </div>

      <el-collapse-transition :key="index+'Child'">
        <div v-show="menuList.name===openItem">
          <template v-for="(child, idx) in menuList.children">
            <div :key="idx" :class="child.name===activedItem?'actived':''" class="menu-item-child" @click="handleClick(child)">{{child.name}}</div>
          </template>
        </div>
      </el-collapse-transition>
    </template>
    <!-- <el-collapse v-model="activeName"
                 accordion>
      <el-collapse-item :title="menuList.name"
                        :key="index"
                        :name="index"
                        v-for="(menuList, index) in menuLists">
      </el-collapse-item>
    </el-collapse>-->
  </div>
</template>

<script>
import elCollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import eventBus from '@/bus/index'
export default {
  components: {
    elCollapseTransition
  },
  data () {
    return {
      // menuLists: [{
      //   name: '首页',
      //   value: 'home',
      //   icon: ''
      // },
      // {
      //   name: '图层管理',
      //   value: 'layer',
      //   icon: ''
      // }, {
      //   name: '在岗在位专题',
      //   value: '',
      //   icon: '',
      //   children: [{
      //     name: '目标跟踪',
      //     value: 'targetFollow',
      //     icon: ''
      //   }, {
      //     name: '轨迹查看',
      //     value: 'history',
      //     icon: ''
      //   }, {
      //     name: '人员分布',
      //     value: 'personSpread',
      //     icon: ''
      //   }, {
      //     name: '围栏监测',
      //     value: 'fenceMonitor',
      //     icon: ''
      //   }]
      // }, {
      //   name: '重大危险源专题',
      //   value: 'hazards',
      //   icon: '',
      //   children: [{
      //     name: '危险源列表',
      //     value: 'hazardsList',
      //     icon: ''
      //   }, {
      //     name: '区域信息',
      //     value: 'hazardsxinxi',
      //     icon: ''
      //   }]
      // }, {
      //   name: '安全风险分区专题',
      //   value: 'four_area',
      //   icon: '',
      //   children: [{
      //     name: '风险分区列表',
      //     value: 'fourAreaList',
      //     icon: ''
      //   }, {
      //     name: '区域信息',
      //     value: 'fourAreaListxinxi',
      //     icon: ''
      //   }]
      // }, {
      //   name: '巡检管理',
      //   value: 'inspection',
      //   icon: ''
      // }, {
      //   name: '作业管理',
      //   value: 'homework',
      //   icon: ''
      // }],
      activedItem: '',
      openItem: ''
    }
  },
  created () {
    this.menuLists = JSON.parse(sessionStorage.getItem('menuList') || '[]')
  },
  mounted () {
    console.log(1111, this.menuLists)
  },
  computed: {
    menuLists: {
      get () {
        let menuListCache = []
        this.$store.state.common.menuList.map(res => {
          if (res.flag === '5') {
            res.children = res.list.map(r => {
              r.value = r.url
              return r
            })
            if (res.children.length === 0) {
              res.children = null
            }
            res.value = res.url
            menuListCache.push(res)
          }
        })
        return menuListCache
      },
      set (val) { this.$store.commit('common/updateMenuList', val) }
    }
  },
  watch: {},
  methods: {
    handleClick (item) {
      this.activedItem = item.name
      if (item.children) {
        if (this.openItem === item.name) {
          this.openItem = ''
        } else {
          this.openItem = item.name
        }
      } else {
        eventBus.$emit('cesiumMenuClick', item.value)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.menu-list-container {
  transition: width 2s;
  .menu-item-logo {
    width: 100%;
    height: 100px;
    background-image: url('~@/assets/img/c_logo.png');
    background-color: rgba(0, 0, 0, 0.8);
    color: #ffffff;
    background-repeat: no-repeat;
    background-position: center;
    box-shadow: 0px 1px 0px 0px #2d2d2d;
    cursor: pointer;
  }
  .menu-item {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: transparent;
    color: #ffffff;
    box-shadow: 0px 1px 0px 0px #606266, 0px 1px 0px 0px #606266;
    cursor: pointer;
    position: relative;
    transition: 0.3s;
    &:hover {
      /*background-color: rgba(0, 0, 0, 0.85);*/
      background: rgba(44, 120, 187, 0.5);
      box-shadow: 0px 1px 0px 0px #606266, 0px 1px 0px 0px #606266;
    }
    .item-icon {
      position: absolute;
      right: 7px;
      top: calc(50% - 7px);
    }
    &.actived {
      background: rgba(44, 120, 187, 0.7);
    }
  }
  .menu-item-child {
    width: 100%;
    height: 50px;
    line-height: 50px;
    margin-top: 1px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.19);
    color: #ffffff;
    margin-left: auto;
    margin-right: auto;
    cursor: pointer;
    &.actived {
      background-color: rgba(35, 105, 191, 0.3);
    }
  }
}
</style>
