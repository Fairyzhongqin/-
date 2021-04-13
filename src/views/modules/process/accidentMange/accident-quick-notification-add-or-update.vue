<!--新增修改事故快报-->
<template>
  <el-dialog :title="(dataForm.id ? '修改' : '新增') + '事故快报'" :close-on-click-modal="false" width="600px" class="accident-quick-report" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="事故发生单位：" prop="deptName">
        <el-popover v-model="deptPopoverVisible" placement="bottom-start" popper-class="high" ref="deptPopover" trigger="click">
          <el-tree :data="deptList" :props="defaultDeptProps" node-key="id" ref="deptTree" @current-change="deptSelectChange" default-expand-all :highlight-current="true" :expand-on-click-node="false"></el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:deptPopover :readonly="true" size="mini" placeholder="请选择事故发生单位" clearable></el-input>
      </el-form-item>
      <el-form-item label="事故发生时间：" prop="occurrenceTime">
        <el-date-picker v-model="dataForm.occurrenceTime" type="datetime" :default-value="getTimeNow" placeholder="选择事故发生时间" clearable size="mini">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="所属区域：" prop="zoneName">
        <el-popover v-model="popoverVisible" popper-class="high" placement="bottom-start" ref="zonePopover" trigger="click">
          <el-tree :data="graphList" :props="defaultProps" node-key="id" ref="zoneTree" @current-change="zoneSelectChange" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.zoneName" v-popover:zonePopover :readonly="true" size="mini" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>
      <el-form-item label="事故类型：" prop="accidentType">
        <el-select v-model="dataForm.accidentType" placeholder="请选择事故类型" clearable size="mini">
          <el-option v-for="item in accidentTypeList" :label="item.value" :value="item.label" :key="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="伤亡情况：" prop="casualtySituation">
        <el-input v-model="dataForm.casualtySituation" size="mini" clearable type="textarea" placeholder="请选择伤亡情况" maxlength="60"></el-input>
      </el-form-item>
      <el-form-item label="事故经过：" prop="eventsCourse">
        <el-input v-model="dataForm.eventsCourse" size="mini" clearable type="textarea" placeholder="请选择事故经过" maxlength="150"></el-input>
      </el-form-item>
      <el-form-item label="事故直接原因：" prop="directCause">
        <el-input v-model="dataForm.directCause" size="mini" clearable type="textarea" placeholder="请选择事故直接原因" maxlength="150"></el-input>
      </el-form-item>
      <el-form-item label="事故间接原因：" prop="indirectCause">
        <el-input v-model="dataForm.indirectCause" size="mini" clearable type="textarea" placeholder="请选择事故间接原因" maxlength="150"></el-input>
      </el-form-item>
      <el-form-item label="防范措施：" prop="preventiveMeasures">
        <el-button @click="addControlMeasure()" size="mini" type="primary">添加</el-button>
        <el-form class="contorl-measure">
          <el-form-item label="" v-for="(item,index) in dataForm.preventiveMeasures" :key="index">
            <el-tag size="mini" class="index">{{index + 1 + '.'}}</el-tag>
            <el-input type="textarea" autosize :rows="1" v-model="item.descript" size="mini" placeholder="请输入防范措施"></el-input>
            <i class="el-icon-remove" @click="dataForm.preventiveMeasures.splice(index,1)"></i>
          </el-form-item>
        </el-form>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isDisabled">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { departList } from '@/api/sys/depart'
import { treeDataTranslate2 } from '@/utils'
import { getLabels } from '@/api/common/sys'
import { queryZoneInfo } from '@/api/pos/region'
import { accidentBulletinInfo, accidentBulletinAddOrUpdate } from '@/api/process/accidentMange'
export default {
  data () {
    var validPreventMeasure = (rule, value, callback) => {
      let flag = false
      this.dataForm.preventiveMeasures.map(item => {
        if (item.descript !== '') {
          flag = true
        }
      })
      if (flag === false) {
        return callback(new Error('至少有一项防范措施'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      dataForm: {
        accidentType: '', // 事故类型，
        deptName: '', // 部门
        deptId: '',
        zoneName: '',
        zoneId: '',
        eventsCourse: '',
        occurrenceTime: '',
        casualtySituation: '',
        directCause: '',
        indirectCause: '',
        preventiveMeasures: [{ descript: '' }]
      },
      isDisabled: false,
      graphList: [],
      deptList: [],
      expanded: [],
      expandedquyu: [],
      accidentTypeList: [],
      deptPopoverVisible: false, // 部门菜单树是否可见
      defaultDeptProps: {
        label: 'deptName',
        children: 'child'
      },
      getTimeNow: new Date(),
      popoverVisible: false, // 菜单树是否可见
      defaultProps: {
        label: 'zoneName',
        children: 'subregion'
      },
      dataRule: {
        accidentType: [
          { required: true, message: '事故类型不能为空', trigger: 'change' }
        ],
        deptName: [
          { required: true, message: '事故发生单位不能为空', trigger: 'change' }
        ],
        zoneName: [
          { required: true, message: '所属区域不能为空', trigger: 'change' }
        ],
        eventsCourse: [
          { required: true, message: '事故发生经过不能为空', trigger: 'blur', pattern: '[^ \x22]+' }
        ],
        occurrenceTime: [
          { required: true, message: '事故发生时间不能为空', trigger: 'change' }
        ],
        casualtySituation: [
          { required: true, message: '伤亡情况不能为空', trigger: 'blur', pattern: '[^ \x22]+' }
        ],
        directCause: [
          { required: true, message: '直接原因不能为空', trigger: 'blur', pattern: '[^ \x22]+' }
        ],
        preventiveMeasures: [
          { required: true, validator: validPreventMeasure, trigger: 'blur', pattern: '[^ \x22]+' }
        ]

      }
    }
  },
  created () {
    this.getDept()
    this.getAllZoneList()
    this.getAccidentType()
  },
  methods: {
    // 得到事故类型
    getAccidentType () {
      getLabels({
        type: 'ACCIDENT_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log('事故类型', data)
          this.accidentTypeList = data.list
        }
      })
    },
    // 当前菜单树选中
    zoneSelectChange (data, node) {
      // 当前节点的数据，对象
      this.dataForm.zoneId = data.id
      this.dataForm.zoneName = data.zoneName
      this.popoverVisible = false
    },
    // 获取所有的区域
    getAllZoneList () {
      this.dataListLoading = true
      queryZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          console.log('区域', data)
          this.graphList = [data.data] || []
          this.expandedquyu.push([data.data][0].id)
        } else {
          this.graphList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    deptSelectChange (data, node) {
      console.log(data, node)
      this.dataForm.deptName = data.deptName
      this.dataForm.deptId = data.deptCode
      this.deptPopoverVisible = false
    },
    // 查找部门
    getDept () {
      departList().then(({ data }) => {
        if (data && data.code === 0) {
          this.deptList = treeDataTranslate2(data.data[0] || [])
          console.log('xsaxsadcsadc', data.data[0], this.deptList)

          this.expanded.push(this.deptList[0].id)
          // this.deptList[0].child.map(item => {
          //   this.expanded.push(item.id)
          // })
          console.log(this.expanded)
        }
      })
    },
    // 添加防范措施
    addControlMeasure () {
      this.dataForm.preventiveMeasures.push({ descript: '' })
    },
    init (id) {
      this.isDisabled = false
      this.visible = true
      this.dataForm.id = id
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.preventiveMeasures = [{ descript: '' }]

        if (id) {
          accidentBulletinInfo({ id: id }).then(({ data }) => {
            if (data && data.code === 0) {
              // console.log(data)
              this.dataForm.accidentType = data.data.accidentType
              this.dataForm.occurrenceTime = data.data.occurrenceTime
              this.dataForm.zoneName = data.data.zoneName
              this.dataForm.zoneId = data.data.zoneId
              this.dataForm.deptName = data.data.deptName
              this.dataForm.deptId = data.data.deptId
              this.dataForm.directCause = data.data.directCause
              this.dataForm.indirectCause = data.data.indirectCause
              this.dataForm.casualtySituation = data.data.casualtySituation
              this.dataForm.eventsCourse = data.data.eventsCourse
              this.dataForm.preventiveMeasures = data.data.preventiveMeasures.map(item => {
                item = { descript: item }
                return item
              })
            } else {
              console.log(data.msg)
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isDisabled = true

          this.dataForm.occurrenceTime = this.dataForm.occurrenceTime ? new Date(this.dataForm.occurrenceTime).Format('yyyy-MM-dd hh:mm:ss') : ''
          this.dataForm.preventiveMeasures = this.dataForm.preventiveMeasures.map(item => {
            item = item.descript
            return item
          })
          accidentBulletinAddOrUpdate(this.dataForm).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.isDisabled = false
              this.$emit('refreshDataList')
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                }
              })
            } else {
              this.visible = false
              this.isDisabled = false
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
            this.visible = false
            this.isDisabled = false
          })
        }
      })
    }
  },
  computed: {
    // 获取此时此刻的日期
    // getTimeNow () {
    //   var d = new Date()
    //   var year = d.getFullYear()
    //   var month = d.getMonth() + 1
    //   var day = d.getDate()
    //   var hour = d.getHours()
    //   var minute = d.getMinutes()
    //   var second = d.getSeconds()
    //   var now = year + '-' + month + '-' + day + '-' + hour + '-' + minute + '-' + second
    //   return now
    // }
  }
}
</script>
<style lang="scss">
.accident-quick-report {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .contorl-measure {
    padding-right: 0;
    position: relative;
    font-size: 12px;
    .el-form-item {
      margin: 7px 0;
      .el-form-item__content {
        display: flex;
        flex-direction: row;
        .index {
          position: absolute;
          width: 25px;
          top: 5px;
          left: -35px;
        }
        .el-icon-remove {
          margin-left: 5px;
          color: #f56c6c;
          line-height: 30px;
        }
      }
    }
  }
}
</style>
