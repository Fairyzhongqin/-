<template>
  <div class="button-all">
    <el-button type="primary"
               id="material-design"
               class="btn color-1 material-design"
               size="mini"
               @click="getDataList()">
      <i class="el-icon-search"></i>
      查询
    </el-button>

    <el-button type="info"
               size="mini"
               icon="el-icon-refresh-right"
               @click="
                   resetForm('dataForm')">重置</el-button>
    <el-button type="warning"
               size="mini"
               icon="el-icon-plus"
               @click="addOrUpdateHandle()">新增卡口</el-button>
    <el-button type="danger"
               size="mini"
               icon="el-icon-delete"
               :disabled="dataListSelections.length <= 0"
               @click="deleteHandle()">批量删除</el-button>
  </div>
</template>
<script>
export default {
  props: { dataListSelections: Array },
  data () {
    return {}
  },
  mounted () {
    let containers = document.getElementById('material-design')
    let canvas = document.createElement('canvas')
    this.$nextTick(() => {
      canvas.addEventListener('click', (event) => {
        let element = event.toElement
        let context = element.getContext('2d')
        let radius = 0
        let centerX = event.offsetX
        let centerY = event.offsetY
        let draw = function () {
          context.beginPath()
          context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
          context.fillStyle = '#fff'
          context.fill()
          radius += 2
          if (radius < element.width) {
            requestAnimFrame(draw)
          }
        }
        let requestAnimFrame = (function () {
          return (
            window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
              window.setTimeout(callback, 500 / 60)
            }
          )
        }())

        if (radius < element.width) {
          requestAnimFrame(draw)
        }
      })
    })
    containers.appendChild(canvas)
    // canvas.style.position
    canvas.style = 'z-index:2000;height:100%;width:100%'
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  },
  methods: {
    draw () {

    },
    getDataList () {

      // this.$emit('getDataList')
    },
    resetForm () {
      this.$emit('resetForm')
    },
    addOrUpdateHandle () {
      this.$emit('addOrUpdateHandle')
    },
    deleteHandle () {
      this.$emit('deleteHandle')
    },
    press () {

    }
  }
}
</script>
<style lang='scss' scoped>
.button-all {
  // 查询/新增/重置按钮样式
  .el-button--primary {
    color: #fff;
    background-color: #2c78bb;
    border-color: #2c78bb;
    // width: 46px;
    // height: 28px;
    font-size: 12px;
  }

  .el-button--primary:hover {
    color: #fff;
    background-color: #2c78bb;
    border-color: #2c78bb;
  }

  .el-button--info {
    color: #222222;
    background: #ebeef0;
    border-color: #ebeef0;
    border: 1px solid rgba(21, 42, 80, 0.2);
  }

  .el-button--info:hover {
    color: #222222;
    background: #ebeef0;
    border-color: #ebeef0;
    border: 1px solid rgba(21, 42, 80, 0.2);
  }

  .el-button--warning {
    color: #fff;
    background-color: #2c78bb;
    border-color: #2c78bb;
  }

  .el-button--mini,
  .el-button--mini.is-round {
    padding: 7px 10px;
  }

  .el-button--warning:hover {
    color: #fff;
    background-color: #2c78bb;
    border-color: #2c78bb;
  }

  .el-button--warning:focus,
  .el-button--warning:hover {
    background-color: #2c78bb;
    border-color: #2c78bb;
    color: #fff;
  }

  .el-button--danger {
    color: #fff;
    background-color: #e63031;
    border-color: #e63031;
  }

  .el-button--danger:hover {
    color: #fff;
    background-color: #e63031;
    border-color: #e63031;
  }
  .btn {
    border: none;
    color: white;
    overflow: hidden;
    padding: 0;
    text-transform: uppercase;
    width: 56px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    span {
      position: absolute;
    }
  }
  .btn.color-1 {
    background-color: #426fc5;
  }
  .btn-border.color-1 {
    background-color: transparent;
    border: 2px solid #426fc5;
    color: #426fc5;
  }
}
</style>
<style lang="scss">
.btn {
  border: none;
  color: white;
  overflow: hidden;
  padding: 0;
  text-transform: uppercase;
  width: 56px;
  height: 28px;
  line-height: 28px;
  cursor: pointer;
  span {
    position: absolute;
  }
}
</style>