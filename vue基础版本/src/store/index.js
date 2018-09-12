import Vue from 'vue'
import vuex from 'vuex'
import loading from './modules/lodaing.js'
import alert from './modules/alert.js'
import confirm from './modules/confirm.js'

Vue.use(vuex)

export default new vuex.Store({
  state: {
    isShowPage: false,
    nowTime: new Date(),
    tips: '地理位置正在获取中',
    month: '',
    template: '',
    gettingLocation: true,
    isInSignArea: false,
    unCheckIn: true,
    signInFinish: false,
    signOutFinish: false,
    signAll: false,
    isThisMonth: true
  },
  modules: {
    loading: loading,
    alert: alert,
    confirm: confirm
  },
  mutations: {
    isThisMonthTog (state) {
      state.isThisMonth = !state.isThisMonth
    }
  },
  actions: {
  }
})
