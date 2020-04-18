import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css'  // 这个nprogress样式必须引入
import axios from 'axios'
import echarts from 'echarts'
import ZkTable from 'vue-table-with-tree-grid'

Vue.use(ZkTable)
Vue.use(echarts)

NProgress.configure({ease:'ease',speed:500});
NProgress.configure({minimum:0.3});
Vue.prototype.$http = axios
axios.defaults.baseURL='http://www.localhost:8081/'
axios.interceptors.request.use(config => {
    NProgress.start() // 设置加载进度条(开始..)
    config.headers.Authorization = window.localStorage.getItem('JWT_TOKEN');
    return config;
}
, error => {
  return Promise.reject(error)
});

// axios响应拦截器
axios.interceptors.response.use(
  function(response) {
    NProgress.done() // 设置加载进度条(结束..)
    if(response.data.code==4001){//如果返回的code==4001说明token错误或者token过期
      window.localStorage.clear();
      router.push("/login")
    }
    return response;
  },
  function(error) {
    return Promise.reject(error)
  }
)

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
