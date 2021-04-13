/**
 * UI组件, 统一使用饿了么桌面端组件库(https://github.com/ElemeFE/element）
 *
 * 使用:
 *  1. 项目中需要的组件进行释放(解开注释)
 *
 * 注意:
 *  1. 打包只会包含释放(解开注释)的组件, 减少打包文件大小
 */
import Vue from 'vue'
import {
  Pagination, // 分页
  Dialog, // 对话框
  Autocomplete, // 远程下拉框
  Dropdown, // 下拉菜单
  DropdownMenu, // 下拉菜单
  DropdownItem, // 下拉item
  Menu, // 导航栏菜单
  Submenu, // 子菜单
  MenuItem, // 菜单itemp
  MenuItemGroup, // 菜单组
  Input, // 输入框
  InputNumber, // 计数器
  Radio, // 单选框
  RadioGroup, // 单选框组
  RadioButton, // 单选框按钮
  Checkbox, // 复选框
  CheckboxButton, // 复选框按钮
  CheckboxGroup, // 复选框组
  Switch, // 开关
  Select, // 选择器
  Option, // 选择器item
  OptionGroup, // 选择器分组
  Button, // 按钮
  ButtonGroup, // 按钮组
  Table, // 表格
  TableColumn, // 表格列
  DatePicker, // 日期选择器
  TimeSelect, // 时间选择器组
  TimePicker, // 时间选择器
  Popover, // 弹出提示框
  Tooltip, // 文字提示
  Breadcrumb, // 面包屑
  BreadcrumbItem, // 面包屑item
  Form, // 表单
  FormItem, // 表单item
  Tabs, // 标签页
  TabPane, // 标签组
  Tag, // 标签
  Tree, // 树形控件
  Alert, // 警告
  Slider, // 滑块
  Icon, // 图标
  Row, // Layout 布局
  Col, // Layout 布局
  Upload, // 文件上传
  Progress, // 进度条
  Badge, // 标记
  Card, // 卡片
  Rate, // 星星评分
  Steps, // 步骤条
  Step, // 步骤条
  Carousel, // 走马灯
  CarouselItem, // 走马灯  item
  Collapse, // 折叠面板
  CollapseItem, // 折叠面板item
  Cascader, // 级联选择器
  ColorPicker, // 颜色选择器
  Transfer, // 穿梭框
  Container, // 布局容器
  Header, // 布局容器 header
  Aside, // 布局容器 aside
  Main, // 布局容器 main
  Footer, // 布局容器 footer
  Loading, // 加载
  MessageBox, // 弹框
  Message, // 消息提示
  Notification, // 通知
  Timeline, // 时间线
  TimelineItem, // 时间线item
  Divider, // 分割线
  // Calenar, // 日历
  Image, // 图片
  scrollbar,
  Drawer // 抽屉

} from 'element-ui'

Vue.use(Drawer)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Autocomplete)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.use(Popover)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Slider)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Badge)
Vue.use(Card)
Vue.use(Rate)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Cascader)
Vue.use(ColorPicker)
Vue.use(Transfer)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Divider)
Vue.use(scrollbar)
Vue.use(Image)

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message

Vue.prototype.$ELEMENT = {
  size: 'medium'
}
