<template>
  <el-dialog class="img-style" title="图片详情" :close-on-click-modal="false" :visible.sync="visible" @close="$emit('closeImg')">
    <el-carousel trigger="click" class="carouselimg">
      <el-carousel-item v-for="(item, index) in pictureList" :key="index">
        <img v-if="type === 'beforePictureId'" :src="item.photoBefore" width="100%" alt="轮播图" @click="previewImg(index)" />
        <img v-if="type === 'afterPictureId'" :src="item.photoAfter" width="100%" alt="轮播图" @click="previewImg(index)" />
      </el-carousel-item>
    </el-carousel>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
    </span>
    <el-dialog :visible.sync="dialogVisible" width="900px" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="轮播图" />
    </el-dialog>
  </el-dialog>
</template>
<script>
import { hiddenDangerInfo } from '@/api/risk/hiddenDanger'
export default {
  data () {
    return {
      visible: false,
      pictureList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      type: '',
      itemHeight: ''
    }
  },
  methods: {
    init (id, type) {
      this.visible = true
      this.type = type
      this.$nextTick(() => {
        hiddenDangerInfo({ id: id }).then(({ data }) => {
          if (data && data.code === 0) {
            console.log(data.data)
            if (type === 'beforePictureId') {
              data.data.pictureList.forEach(item => {
                if (item.photoBefore && item.photoBefore !== null) {
                  this.pictureList.push(item)
                }
              })
              console.log(this.pictureList)
            } else if (type === 'afterPictureId') {
              data.data.pictureList.forEach(item => {
                if (item.photoAfter && item.photoAfter !== null) {
                  this.pictureList.push(item)
                }
              })
            }
          }
        })
      })
    },
    previewImg (index) {
      this.pictureList.map((item, index1) => {
        if (index === index1) {
          if (this.type === 'beforePictureId') {
            this.dialogImageUrl = item.photoBefore
          } else if (this.type === 'afterPictureId') {
            this.dialogImageUrl = item.photoAfter
          }
          this.dialogVisible = true
        }
      })
    }
  }
  // beforeMount () {
  //   console.log(this.$refs.picture[0])
  // }
}
</script>
<style lang="scss">
.img-style {
  .carouselimg {
    img {
      vertical-align: middle;
      height: 100%;
      width: auto;
      margin: 0 auto;
      display: inherit;
    }
  }
}
</style>
