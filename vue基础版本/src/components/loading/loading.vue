<template>
  <div id="loadingToast" class="weui_loading_toast" v-show="isLoadingData">
    <div class="weui_mask_transparent"></div>
    <div class="weui_toast">
      <div class="weui_loading">
        <div class="weui_loading_leaf weui_loading_leaf_0"></div>
        <div class="weui_loading_leaf weui_loading_leaf_1"></div>
        <div class="weui_loading_leaf weui_loading_leaf_2"></div>
        <div class="weui_loading_leaf weui_loading_leaf_3"></div>
        <div class="weui_loading_leaf weui_loading_leaf_4"></div>
        <div class="weui_loading_leaf weui_loading_leaf_5"></div>
        <div class="weui_loading_leaf weui_loading_leaf_6"></div>
        <div class="weui_loading_leaf weui_loading_leaf_7"></div>
        <div class="weui_loading_leaf weui_loading_leaf_8"></div>
        <div class="weui_loading_leaf weui_loading_leaf_9"></div>
        <div class="weui_loading_leaf weui_loading_leaf_10"></div>
        <div class="weui_loading_leaf weui_loading_leaf_11"></div>
      </div>
      <p class="weui_toast_content">数据加载中</p>
    </div>
    </div>
</template>

<script type='text/ecmascript-6'>
import {mapState, mapMutations} from 'vuex'
export default {
  computed: {
    ...mapState({
      isLoadingData: state => state.loading.isLoadingData
    })
  },
  methods: {
    ...mapMutations([
      'toggleIsLoadingData'
    ])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
