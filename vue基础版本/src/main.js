// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import validate from './validate'
import axios from 'axios'
import VueTouch from 'vue-touch'
import store from './store'

Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VueTouch, {name: 'v-touch'})

// 自定义时间过滤器
Vue.filter('dateTime', function (value) {
  value = new Date(value)
  return [(value.getHours() < 10 ? '0' + value.getHours() : value.getHours()), (value.getMinutes() < 10 ? '0' + value.getMinutes() : value.getMinutes()), (value.getSeconds() < 10 ? '0' + value.getSeconds() : value.getSeconds())].join(':')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  validate,
  store,
  components: { App },
  template: '<App/>'
})
