<template>
  <div class="weui_dialog_confirm" v-show="isConfirm">
    <div class="weui_mask"></div>
    <div class="weui_dialog">
      <div class="weui_dialog_hd"><strong class="weui_dialog_title">{{confirmTitle}}</strong></div>
      <div class="weui_dialog_bd">{{confirmMessage}}</div>
      <div class="weui_dialog_ft">
        <a href="javascript://" class="weui_btn_dialog default" @click="confirmAction.cancel()">取消</a>
          <a href="javascript://" class="weui_btn_dialog primary" @click="confirmAction.success()">确定</a>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import {mapState, mapMutations} from 'vuex'
export default {
  created () {
    this.initConfirmAction()
  },
  computed: {
    ...mapState({
      isConfirm: state => state.confirm.isConfirm,
      confirmTitle: state => state.confirm.confirmTitle,
      confirmMessage: state => state.confirm.confirmMessage,
      confirmAction: state => state.confirm.confirmAction
    })
  },
  methods: {
    ...mapMutations([
      'initConfirmAction',
      'confirmMsg'
    ])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
