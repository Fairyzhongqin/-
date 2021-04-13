<template>
  <el-dialog title="具体信息" :visible.sync="visible" width="540px" height="400px" class="change-detail">
    <p class="title">{{businessName}}</p>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="12"><span class="risk-point-title">风险点：</span><span class="risk-point-content">{{businessName}}</span></el-col>
      <el-col :span="12"><span class="risk-point-title">所属区域：</span><span class="risk-point-content">{{zoneName}}</span></el-col>
    </el-row>
    <div class="body-content">
      <div class="body-content-title">主要危害（风险）类型</div>
      <div style="padding-left:15px;height:84px">
        <el-scrollbar style="height : 100%">
          <ol class="main-contanin">
            <li v-for="(item,index) in factorMainNameList" :key="index"> {{item}}</li>

          </ol>
        </el-scrollbar>
      </div>
      <div class="body-content-title">主要危害（风险）因素</div>
      <div style="height:129px;padding-left:15px;">
        <el-scrollbar style="height:100%">
          <ol class="main-contanin">
            <li v-for="(item,index) in factorDangerList" :key="index"> {{item}}</li>

          </ol>
        </el-scrollbar>
      </div>

      <div>

      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="visible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      businessName: '',
      zoneName: '',
      factorList: [],
      factorMainNameList: [],
      factorDangerList: []
    }
  },
  methods: {
    init (info) {
      console.log(info)

      this.visible = true
      this.$nextTick(() => {
        this.businessName = info.businessName
        this.zoneName = info.zoneName
        this.factorList = info.factorList
        if (info.factorList && info.factorList.length > 0) {
          info.factorList.map(item => {
            if (this.factorMainNameList.indexOf(item.factorMainName) === -1) {
              this.factorMainNameList.push(item.factorMainName)
            }
          })
          info.factorList.map(item => {
            if (this.factorDangerList.indexOf(item.factorDanger) === -1) {
              this.factorDangerList.push(item.factorDanger)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.change-detail {
  .el-dialog__body {
    margin-top: 8px;
    padding-top: 0;
    .title {
      font-size: 14px;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
      text-align: center;
      margin: 0;
    }
    .el-divider--horizontal {
      margin: 12px 0;
    }
    .risk-point-title {
      font-size: 12px;
      color: rgba(34, 34, 34, 1);
      opacity: 0.7;
      font-weight: 500;
    }
    .risk-point-content {
      font-size: 12px;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
    }
    .body-content {
      width: 498px;
      height: 270px;
      margin-top: 8px;

      box-sizing: border-box;
      border: 1px solid rgba(220, 223, 230, 1);
      &-title {
        padding-left: 15px;
        height: 28px;
        background: rgba(238, 240, 247, 1);
        box-shadow: 0px 1px 0px 0px rgba(220, 223, 230, 1);
        border-radius: 4px 4px 0px 0px;
        line-height: 28px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(34, 34, 34, 1);
      }
      .main-contanin {
        padding: 0 15px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(34, 34, 34, 1);
        line-height: 20px;
      }
    }
  }
}
</style>