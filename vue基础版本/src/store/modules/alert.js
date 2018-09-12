export default({
  state: {
    isAlert: false,
    alertTitle: '系统提示',
    alertMessage: '出错了，请稍后重试',
    alertOk: '确定'
  },
  modules: {
  },
  mutations: {
    toggleIsAlert (state) {
      state.isAlert = !state.isAlert
    },
    alertMsg (state, payload) {
      state.alertTitle = payload.title || '系统提示'
      state.alertMessage = payload.message || '出错了，请稍后重试'
      state.alertOk = payload.ok || '确定'
      state.isAlert = true
      if (!payload.callback || typeof payload.callback !== 'function') {
        payload.callback = function () {}
      }
      payload.callback()
    }
  }
})
