<template>
  <el-submenu v-if="menu.list && menu.list.length >= 1"
              :index="menu.menuId + ''"
              :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'">
    <template slot="title">
      <icon-svg :name="menu.icon || ''"
                class="site-sidebar__menu-icon"></icon-svg>
      <span>{{ menu.name }}</span>
    </template>
    <sub-menu v-for="item in menu.list"
              :key="item.menuId"
              :menu="item"
              :dynamicMenuRoutes="dynamicMenuRoutes">
    </sub-menu>
  </el-submenu>
  <el-menu-item v-else
                :index="menu.menuId + ''"
                @click="gotoRouteHandle(menu)">
    <icon-svg :name="menu.icon || ''"
              class="site-sidebar__menu-icon"></icon-svg>
    <span>{{ menu.name }}</span>
  </el-menu-item>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
import eventBus from '../bus/index'
export default {
  name: 'sub-menu',
  props: {
    menu: {
      type: Object,
      required: true
    },
    dynamicMenuRoutes: {
      type: Array,
      required: true
    }
  },
  components: {
    SubMenu
  },
  computed: {
    sidebarLayoutSkin: {
      get () { return this.$store.state.common.sidebarLayoutSkin }
    }
  },
  methods: {
    // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
    gotoRouteHandle (menu) {
      if (this.$route.path !== '/map-page') {
        let route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === menu.menuId)
        if (route.length >= 1) {
          this.$router.push({ name: route[0].name })
        }
      } else {
        eventBus.$emit('mapClickHandle', menu)
      }
    },
    // 3D地图动态菜单 点击事件单独处理
    gotoRouteHandle2 (menu) {
      console.log(menu)
      if (menu.url) {
        eventBus.$emit('mainSidebarCoMap', menu.url)
      } else {
        this.$message.info('程序猿正在建设。。。')
      }
    }
  }
}
</script>
