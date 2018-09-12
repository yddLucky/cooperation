export default({
  state: {
    isLoadingData: false
  },
  modules: {
  },
  mutations: {
    toggleIsLoadingData (state) {
      state.isLoadingData = !state.isLoadingData
    }
  }
})
