import wx from 'weixin-js-sdk'
import qs from 'qs'

const headers = {headers: {'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'}}
// brpuat1 kaoqin
const localUrl = 'https://brpuat1.aegonthtf.com/wechatsmallerp'
let Base64 = require('js-base64').Base64

export default {
  isWeiXin () {
    let ua = window.navigator.userAgent.toLowerCase()
    if (ua.indexOf('micromessenger') !== -1 && ua.indexOf('wxwork') === -1) {
      return true
    } else {
      return false
    }
  },
  isIos () {
    let u = navigator.userAgent
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
  },
  getUserId: function (vm) {
    sessionStorage.userId = vm.$route.query.userId
    if (sessionStorage.userId === 'undefined' || !sessionStorage.userId) {
      let link = location.href.split('?')[0]
      // let baseLink = Base64.encode(link)
      for (let i = 0; i < 10; i++) {
        sessionStorage.signRandom += Math.floor(Math.random() * 10)
      }
      sessionStorage.signRandom = Base64.encode(sessionStorage.signRandom)
      if (link.indexOf('kaoqin.aegonthtf.com') !== -1) {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf9719c75a774a9e4&redirect_uri=https://kaoqin.aegonthtf.com/wechatsmallerp/punch/oauchis.do&response_type=code&scope=SCOPE&state=' + sessionStorage.signRandom + '#wechat_redirect'
      } else {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx06980e959cad9f8b&redirect_uri=https://brpuat1.aegonthtf.com/wechatsmallerp/punch/oauchis.do&response_type=code&scope=SCOPE&state=' + sessionStorage.signRandom + '#wechat_redirect'
      }
    } else {
      this.homeService.userAccount = sessionStorage.userId
      return true
    }
  },
  getConfig: function (vm) {
    var that = this
    let url = this.getHost() + '/sales/customerSection/customerSection_getWeixinJS.action'
    let data = {
      // url: location.href.split('#')[0].replace(/&/g, '%26')
      url: location.href.split('#')[0]
    }
    data = qs.stringify(data)
    vm.$http.post(url, data, headers).then(response => {
      response = response.data.wechatJsInfo
      wx.config({
        debug: false,
        appId: response.appid,
        timestamp: response.timestamp,
        nonceStr: response.noncestr,
        signature: response.signature,
        jsApiList: [
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'hideMenuItems',
          'hideAllNonBaseMenuItem',
          'getNetworkType',
          'getLocation',
          'hideOptionMenu',
          'showOptionMenu',
          'closeWindow'
        ]
      })
    }).catch(err => {
      alert(err)
    })
    wx.ready(function () {
      if (that.isWeiXin() && that.isIos()) {
        wx.showOptionMenu()
        wx.hideMenuItems({
          menuList: [
            'menuItem:editTag',
            'menuItem:delete',
            'menuItem:copyUrl',
            'menuItem:originPage',
            'menuItem:readMode',
            'menuItem:openWithQQBrowser',
            'menuItem:openWithSafari',
            'menuItem:share:email',
            'menuItem:share:brand',
            'menuItem:share:qq',
            'menuItem:share:weiboApp',
            'menuItem:favorite',
            'menuItem:share:facebook',
            '/menuItem:share:QZone'
          ]
        })
      }
    })
    wx.error(function (res) {
      if (that.isWeiXin() && that.isIos()) {
        res = res.data
        alert(res.errMsg)
      }
    })
  },
  dataQsStringify (obj) {
    return qs.stringify(obj)
  },
  dataJsonStringify (obj) {
    return JSON.stringify(obj).replace(/\"/g, "\'")
  },
  getHost () {
    return 'https://' + location.host
  },
  signStatus: {
    100: 'normal', // 正常
    101: 'holiday', // 节假日
    102: 'vacation', // 休假
    103: 'absence', // 缺勤
    104: 'late' // 迟到
  },
  addZero (num) {
    return num < 10 ? ('0' + num) : num
  },
  formatDate (num) {
    return '<div class="dateBox">' + this.addZero(num) + '</div>'
  },
  getDateStatus (data) {
    if (data.morning === 101) {
      return ''
    }
    let html = ''
    html += ('<div class="morning ' + this.signStatus[data.morning] + '"></div>')
    html += ('<div class="afternoon ' + this.signStatus[data.afternoon] + '"></div>')
    return html
  },
  getSignList (vm, monthSet) {
    let that = this
    let obj = {
      userAccount: that.homeService.userAccount,
      userMonth: monthSet
    }
    this.homeService.getCalendar(vm, obj, function (res) {
      let signData = res
      if (signData.length) {
        for (let i in signData) {
          if (signData[i]) {
            signData[i].monthDay = signData[i].monthDay ? new Date(signData[i].monthDay).getDate() : null
          }
        }
        let minDate = signData[0].monthDay
        for (let i = minDate; i > 1; i--) {
          signData.unshift(null)
        }
      }
      // 今天，每月第一天
      let today = new Date()
      let firstDate = 1
      let year = today.getFullYear()
      let month = (today.getMonth() + 1)
      let date = today.getDate()
      if (monthSet === 1) {
        // 判断获取的是上一个月的数据
        today = new Date(today.setMonth(month - 2))
        year = today.getFullYear()
        month = (today.getMonth() + 1)
        date = today.getDate()
      }
      // 今天 - 年，月（补零），日（补零）
      let fullMonth = that.addZero(month)
      // let fullDate = this.addZero(date)
      // 本月第一天，备份本月第一天
      let firstDay = new Date(year + '-' + fullMonth + '-01')
      let firstDayCopyForMonthLength = new Date(year + '-' + fullMonth + '-01')
      let firstDayCopyForLastMonthLength = new Date(year + '-' + fullMonth + '-01')
      // 本月最大日期，上月最大日期setMonth(0)=>是1月返回值会改变原来的对象
      let monthLength = (new Date(firstDayCopyForMonthLength.setMonth(month)).getTime() - firstDay.getTime()) / 8.64E7
      let lastMonthLength = (firstDay.getTime() - new Date(firstDayCopyForLastMonthLength.setMonth(month - 2)).getTime()) / 8.64E7
      // 本月最后一天星期
      let thisMonthLastDay = new Date(year + '-' + fullMonth + '-' + monthLength).getDay()
      // 初始化模板
      var template = ''
      // 上月日期
      for (let i = firstDay.getDay(); i > 0; i--) {
        template = '<li class="passDay lastMonth">' + that.formatDate(lastMonthLength--) + '</li>' + template
      }
      // 本月日期
      let oneSignData = null
      for (let i = 1; i <= monthLength; i++) {
        oneSignData = signData[i - 1] ? signData[i - 1] : null
        if (i < date) { // 小于今天的日期
          template += '<li class="passDay">'
          template += that.formatDate(i)
          if (oneSignData) {
            template += that.getDateStatus(oneSignData)
          }
        } else if (i === date) {
          template += '<li' + (monthSet === 0 ? ' class="today"' : '') + '>' + that.formatDate(i)
          if (oneSignData) {
            template += that.getDateStatus(oneSignData)
          }
        } else {
          template += '<li>' + that.formatDate(i)
          if (oneSignData) {
            template += that.getDateStatus(oneSignData)
          }
        }
        template += '</li>'
      }
      // 下月日期
      for (let i = thisMonthLastDay; i < 6; i++) {
        template += '<li class="nextMonth">' + that.formatDate(firstDate++) + '</li>'
      }
      template = '<ul class="calendarContent">' + template + '</ul>'
      vm.$store.state.month = year + '年' + fullMonth + '月'
      vm.$store.state.template = template
    })
  },
  homeService: {
    userAccount: 'san',
    signtxt: '',
    signRandom: '',
    post (vm, reqUrl, parms, successCb, errorCb, showLoading) {
      if (showLoading !== false) {
        vm.$store.state.loading.isLoadingData = true
      }
      parms = qs.stringify(parms)
      vm.$http.post(localUrl + reqUrl, parms, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).then(res => {
        if (successCb && typeof successCb === 'function') {
          successCb(res.data)
        }
        if (showLoading !== false) {
          vm.$store.state.loading.isLoadingData = false
        }
      }).catch(err => {
        if (showLoading !== false) {
          vm.$store.state.loading.isLoadingData = false
        }
        if (errorCb && typeof errorCb === 'function') {
          errorCb(err)
        }
      })
    },
    getCalendar (vm, obj, callback, errorCb) {
      this.post(vm, '/punch/calender.do', obj, callback, errorCb)
    },
    getUserDate (vm, obj, callback, errorCb) {
      this.post(vm, '/punch/usermessagedate.do', obj, callback, errorCb)
    },
    sign (vm, obj, callback, errorCb) {
      this.post(vm, '/punch/punchDay.do', obj, callback, errorCb)
    }
  }
}
