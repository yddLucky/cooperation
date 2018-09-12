<template>
<div class="weui_dialog_alert" v-show="isAlert">
  <div class="weui_mask"></div>
  <div class="weui_dialog">
    <div class="weui_dialog_hd"><strong class="weui_dialog_title">{{alertTitle}}</strong></div>
    <div class="weui_dialog_bd">{{alertMessage}}</div>
    <div class="weui_dialog_ft">
      <a href="javascript://" @click="toggleIsAlert" class="weui_btn_dialog primary">{{alertOk}}</a>
    </div>
  </div>
</div>
</template>

<script type='text/ecmascript-6'>
import {mapState, mapMutations} from 'vuex'
export default {
  computed: {
    ...mapState({
      isAlert: state => state.alert.isAlert,
      alertTitle: state => state.alert.alertTitle,
      alertMessage: state => state.alert.alertMessage,
      alertOk: state => state.alert.alertOk
    })
  },
  methods: {
    ...mapMutations([
      'toggleIsAlert'
    ])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
