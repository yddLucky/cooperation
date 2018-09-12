export default({
  state: {
    isConfirm: false,
    confirmTitle: '系统提示',
    confirmMessage: '出错了，请稍后重试',
    confirmAction: {
      success: function () {},
      cancel: function () {}
    }
  },
  mutations: {
    initConfirmAction (state) {
      state.confirmAction.success = function () {
        state.isConfirm = false
      }
      state.confirmAction.cancel = function () {
        state.isConfirm = false
      }
    },
    confirmMsg (state, payload) {
      state.confirmTitle = payload.title || '系统提示'
      state.confirmMessage = payload.message || '出错了，请稍后重试'
      state.isConfirm = true
      state.confirmAction = {
        success () {
          if (typeof payload.success === 'function') payload.success()
          state.isConfirm = false
        },
        cancel () {
          if (typeof payload.cancel === 'function') payload.cancel()
          state.isConfirm = false
        }
      }
    }
  }
})
