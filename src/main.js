// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-theme-chalk'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/gloable.css'
import axios from 'axios'
import { MessageBox } from 'element-ui'


//配置请求的根路径
axios.defaults.baseURL='http://127.0.0.1:8808/api'
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token');
  return config;
})
axios.defaults.withCredentials=true
Vue.prototype.$http = axios
Vue.prototype.$confirm=MessageBox.confirm
Vue.use(ElementUI);
Vue.config.productionTip = false




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
