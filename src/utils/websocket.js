// socket功能 https://www.cnblogs.com/luoxuemei/p/10115679.html
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

export function connectionSocket () {
  let socket = new SockJS('http://192.168.0.214:9000/spring-posweb/mapSocket') // 连接SockJS的endpoint名称为"bullet"
  console.log('socket连接地址：' + 'http://192.168.0.214:9000/spring-posweb/mapSocket')
  // 获取STOMP子协议的客户端对象
  let stompClient = Stomp.over(socket)
  // 定义客户端的认证信息,按需求配置
  let headers = {
    // Authorization:store.getters.token
  }

  // 拦截输出的一大堆垃圾信息
  stompClient.debug = function (str) {
    // $("#debug").append(str + "\n");
  }
  // 向服务器发起websocket连接
  stompClient.connect(headers, () => {
    stompClient.subscribe('/topic/getResponse', (response) => { // 订阅服务端提供的某个topic
      if (response.body) {
        const repObj = JSON.parse(response.body)
        console.log(repObj.data)
      }
    })
  }, (err) => {
    // 连接发生错误时的处理函数
    console.log('失败===' + err)
  })
}
