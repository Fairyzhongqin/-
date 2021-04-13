
<template>
  <!-- 公共选择器 -->
  <el-select v-model="value"
             placeholder="请选择"
             @change='selectOne'>
    <el-option v-for="item in sexList.opction"
               :key="item[sexList.key.lable]"
               :label="item[sexList.key.lable]"
               :value="item[sexList.key.value]"
               class=" select-option">
      <div class="select-right">
        <!-- <i class="el-icon-check"></i> -->
        <img src="~@/assets/img/select/right.png"
             class="right-img"
             v-show="value === item[sexList.key.value]" />
      </div>
      <span>{{item[sexList.key.lable]}}</span>
    </el-option>
  </el-select>
</template>
<script>
export default {
  data () {
    return { value: '' }
  },
  // sexList:{opction(选择器遍历):[],key:{lable(展示字段):'',value(返回字段):''}}   返回事件selectListValue
  props: { sexList: Object },
  methods: {
    selectOne (value) {
      this.$emit('selectListValue', value)
    }
  }
}
</script>
<style lang="scss" scoped>
// 下拉框样式
.el-select-dropdown__item {
  padding: 0;
}
.select-right {
  margin-left: 6px;
  width: 24px;
  display: inline-block;
}
.right-img {
  height: 16px;
  width: 16px;
}
.el-icon-check {
  color: #4bd4fb;
}
.el-select-dropdown__item.selected {
  color: #606266;
  font-weight: normal;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: -webkit-linear-gradient(left, #7fc2f3, #d8e8f6); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #7fc2f3, #d8e8f6); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #7fc2f3, #d8e8f6); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #7fc2f3, #d8e8f6); /* 标准的语法 */
}
</style>