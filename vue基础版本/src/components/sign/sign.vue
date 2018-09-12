<template>
<div class="container view-frame" id="container">
  <div class="binding">
    <div class="commonPrompt">
      <h3>{{nowTime | dateTime}}</h3>
      <p>{{tips}}</p>
      <ul class="bindList">
        <li>
          <a href="javascript://" class="signBtn" :class="{'signDisabled': signInFinish}" @click="sign('isInSignAreaLogin')">上班签到</a>
        </li>
        <li>
          <a href="javascript://" class="signBtn" @click="sign('isInSignAreaLogout')" :class="{'signDisabled': signOutFinish}">下班签退</a>
        </li>
      </ul>
    </div>
    <div class="bindInformation">
      <div class="calendarBox">
        <p class="calendarMonth">{{month}}</p>
        <a href="javascript://" class="viewPrevMonth" v-show="isThisMonth" @click="prevMonth()"></a>
        <a href="javascript://" class="viewNextMonth" v-show="!isThisMonth" @click="nextMonth()"></a>
        <div class="tips">
          <div class="normal"><span></span>正常</div>
          <div class="vacation"><span></span>休假</div>
          <div class="absence"><span></span>缺勤</div>
          <div class="late"><span></span>异常</div>
        </div>
        <ul class="calendar">
          <li>Su</li><li>Mo</li><li>Tu</li><li>We</li><li>Th</li><li>Fr</li><li>Sa</li>
        </ul>
        <calendar :template="template" @prevMonth="prevMonth" @nextMonth="nextMonth"></calendar>
      </div>
    </div>
  </div>
</div>
</template>

<script type='text/ecmascript-6'>
import calendar from '../calendar/calendar'
import common from '../commonJs/common'
import {mapState, mapMutations} from 'vuex'

export default {
  data: function () {
    return {
    }
  },
  components: {
    calendar
  },
  created () {
    common.getSignList(this, 0)
  },
  computed: {
    ...mapState({
      nowTime: state => state.nowTime,
      tips: state => state.tips,
      template: state => state.template,
      month: state => state.month,
      gettingLocation: state => state.gettingLocation,
      isInSignArea: state => state.isInSignArea,
      unCheckIn: state => state.unCheckIn,
      signInFinish: state => state.signInFinish,
      signOutFinish: state => state.signOutFinish,
      signAll: state => state.signAll,
      isThisMonth: state => state.isThisMonth
    })
  },
  methods: {
    ...mapMutations([
      'alertMsg',
      'confirmMsg',
      'isThisMonthTog'
    ]),
    sign (loginType) {
      let vm = this
      if (vm.signAll) {
        vm.alertMsg({message: '您今日已全部打卡!'})
        return false
      }
      if (vm.gettingLocation) {
        vm.alertMsg({title: '提示', message: '地理位置正在获取中'})
        return false
      }
      if (!vm.isInSignArea) {
        vm.alertMsg({title: '提示', message: '您尚未到达考勤范围，还不能进行考勤'})
        return false
      }
      vm.confirmMsg({
        message: ('是否确认进行' + (loginType === 'isInSignAreaLogin' ? '签到' : '签退') + '？'),
        success: function () {
          if (loginType === 'isInSignAreaLogout' && vm.unCheckIn) {
            setTimeout(function () {
              vm.confirmMsg({
                message: '您今日还未进行签到，是否现在进行签退？',
                success: function () {
                  vm.doSign(loginType)
                }
              })
            }, 100)
          } else {
            vm.doSign(loginType)
          }
        }
      })
    },
    doSign (loginType) {
      let vm = this
      let obj = {
        userAccount: common.homeService.userAccount,
        signWorkOut: loginType === 'isInSignAreaLogin' ? '0' : '1',
        token: common.homeService.signtxt,
        noncestr: common.homeService.signRandom
      }
      common.homeService.sign(vm, obj, function (res) {
        vm.alertMsg({title: '提示', message: res.errmsg})
        if (res.errmsg === '签到成功!') {
          vm.signInFinish = true
          vm.unCheckIn = false
        } else if (res.errmsg === '签退成功!') {
          vm.signOutFinish = true
        }
      })
    },
    prevMonth () {
      let vm = this
      if (!this.isThisMonth) {
        return false
      }
      this.$store.commit('isThisMonthTog')
      common.getSignList(vm, 1)
    },
    nextMonth () {
      let vm = this
      if (this.isThisMonth) {
        return false
      }
      this.$store.commit('isThisMonthTog')
      common.getSignList(vm, 0)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
