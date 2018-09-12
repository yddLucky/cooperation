<template>
  <div id="app" v-show="isShowPage">
    <!-- container -->
    <v-container></v-container>
    <!-- Loading Toast -->
    <v-loading></v-loading>
    <!-- Alert Msg -->
    <v-alert></v-alert>
    <!-- Confirm Msg -->
    <v-confirm></v-confirm>
  </div>
</template>

<script>
import container from 'components/sign/sign'
import loading from 'components/loading/loading'
import alert from 'components/alert/alert'
import confirm from 'components/confirm/confirm'
import common from 'components/commonJs/common'
import {mapState, mapMutations} from 'vuex'
import wx from 'weixin-js-sdk'
import BMap from 'BMap'

export default {
  name: 'App',
  data: function () {
    return {
      paramsPool: {},
      historyPath: [],
      timmer: '',
      map: ''
    }
  },
  created () {
    let vm = this
    this.$store.state.isShowPage = common.getUserId(vm)
    if (common.isWeiXin() && common.isIos()) {
      common.getConfig(vm)
    }
    this.signController()
    this.map = new BMap.Map('allmap')
  },
  computed: {
    ...mapState({
      isAlert: state => state.alert.isAlert,
      alertTitle: state => state.alert.alertTitle,
      alertMessage: state => state.alert.alertMessage,
      alertOk: state => state.alert.alertOk,
      isConfirm: state => state.confirm.isConfirm,
      confirmTitle: state => state.confirm.confirmTitle,
      confirmMessage: state => state.confirm.confirmMessage,
      confirmAction: state => state.confirm.confirmAction,
      isShowPage: state => state.isShowPage
    })
  },
  components: {
    'v-container': container,
    'v-loading': loading,
    'v-alert': alert,
    'v-confirm': confirm
  },
  methods: {
    ...mapMutations([
      'toggleIsAlert',
      'confirmMsg'
    ]),
    signController () {
      let vm = this
      common.homeService.userAccount = vm.$route.query.userId
      common.homeService.signtxt = vm.$route.query.token
      common.homeService.signRandom = sessionStorage.signRandom
      common.homeService.getUserDate(vm, {userAccount: common.homeService.userAccount}, function (res) {
        vm.$store.state.nowTime = res.nowTime
        let companyPos = {
          longitude: res.longitude,
          latitude: res.latitude,
          distance: res.distance
        }
        // vm.$store.state.isInSignArea = false
        vm.$store.state.unCheckIn = res.errmsg === '未签到，仅允许签到'
        if (res.errmsg === '您今日已全部打卡!') {
          vm.$store.state.signAll = true
        }
        switch (res.errmsg) {
          // 识别已经签到的状态
          case '未签到，仅允许签到':
            break
          // 识别已经签退的状态
          case '您今日已全部打卡!':
            vm.$store.state.signInFinish = true
            vm.$store.state.signOutFinish = true
            break
          case '已签到，允许签退!':
            vm.$store.state.signInFinish = true
            break
          case '已签退，允许签到!':
            vm.$store.state.signOutFinish = true
            break
        }
        let timeStep = 0
        let immediately = true
        let getCurrentPosition = function () {
          vm.$store.state.nowTime = new Date(vm.$store.state.nowTime += 1000).getTime()
          if (immediately || timeStep === 5) {
            timeStep = 0
            immediately = false
            if (common.isWeiXin() && common.isIos()) {
              wx.ready(function () {
                wx.getLocation({
                  type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                  success: function (res) {
                    try {
                      vm.$store.state.gettingLocation = false // var latitude = res.latitude; 纬度，浮点数，范围为90 ~ -90// var longitude = res.longitude; //经度，浮点数，范围为180 ~ -180。
                      let convertor = new BMap.Convertor()
                      let x = res.longitude
                      let y = res.latitude
                      let ggPoint = new BMap.Point(x, y)
                      let translateCallback = function (data) {
                        if (data.status === 0) {
                          let distance = vm.map.getDistance(new BMap.Point(companyPos.longitude, companyPos.latitude), data.points[0])
                          if (distance.toFixed(2) <= companyPos.distance) {
                            vm.$store.state.isInSignArea = true
                            vm.$store.state.tips = '您已经到达考勤范围'
                          } else {
                            vm.$store.state.isInSignArea = false
                            vm.$store.state.tips = '您当前不在考勤范围内'
                          }
                        }
                      }
                      convertor.translate([ggPoint], 1, 5, translateCallback)
                    } catch (e) {
                      alert(e.message)
                    }
                  },
                  cancel: function (res) {
                    alert('请刷新页面并允许微信定位。') // 拒绝
                  },
                  fail: function () {
                    alert('未能获取地理位置！首先检查手机是否启用微信定位。')
                  }
                })
              })
            } else {
              // gps获取
              navigator.geolocation.getCurrentPosition(function (position) {
                try {
                  vm.$store.state.gettingLocation = false
                  let convertor = new BMap.Convertor()
                  let x = position.coords.longitude
                  let y = position.coords.latitude
                  let ggPoint = new BMap.Point(x, y)
                  let translateCallback = function (data) {
                    if (data.status === 0) {
                      let distance = vm.map.getDistance(new BMap.Point(companyPos.longitude, companyPos.latitude), data.points[0])
                      if (distance.toFixed(2) <= companyPos.distance) {
                        vm.$store.state.isInSignArea = true
                        vm.$store.state.tips = '您已经到达考勤范围'
                      } else {
                        vm.$store.state.isInSignArea = false
                        vm.$store.state.tips = '您当前不在考勤范围内'
                      }
                    }
                  }
                  convertor.translate([ggPoint], 1, 5, translateCallback)
                } catch (e) {
                  alert(e)
                }
              })
            }
          } else {
            timeStep += 1
          }
        }
        if (navigator.geolocation && vm.$store.state.isShowPage) {
          getCurrentPosition()
          vm.timmer = setInterval(() => {
            getCurrentPosition()
          }, 1000)
        } else {
          alert('Geolocation is not supported by this browser.')
        }
      })
    }
  }
}
</script>

<style>
</style>
