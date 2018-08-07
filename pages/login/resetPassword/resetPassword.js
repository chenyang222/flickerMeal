//regist.js
const app = getApp();
var interval = null //倒计时函数

var countdown = 60;
var settime = function (that) {
  if (countdown < 0) {
    that.setData({
      is_show: true
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      is_show: false,
      last_time: countdown
    })

    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }
    , 1000)
}
Page({
  data: {
      imgdata: app.globalData.imgdata,
      phoneNum: '',
      validateCode: '',
      password: '',
      passwinviteCodeord: '',
      checkboxVal: 0,
      last_time: '',
      is_show: true
  },
  onLoad: function (options) {
    //console.log(options);
    wx.setNavigationBarTitle({
      title: '重置密码'
    })
  },
  //是去焦点获取input中值
  getInputValue: function (e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  //获取验证码
  getIdentifyingCode: function () {
    var that = this;
    if (this.data.phoneNum == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    // 将获取验证码按钮隐藏60s，60s后再次显示
    that.setData({
      is_show: (!that.data.is_show)  //false
    })
    settime(that);
    wx.request({
      url: app.globalData.baseUrl + 'loginAndRegister/SMSSend.action', //仅为示例，并非真实的接口地址
      data: {
        // phone: '15652701413',
        phone: that.data.phoneNum,
        msgFlag: '3'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })

  },
  //获取手机号
  phoneVal: function (e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  //获取验证啊
  vlidataVal: function (e) {
    this.setData({
      validateCode: e.detail.value
    })
  },
  //获取密码
  passVal: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  //确定注册
  comfirmRegist: function () {
    console.log('asdfasdf')
    console.log(this.data.password)
    if (this.data.phoneNum == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    if (this.data.validateCode == '') {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    if (this.data.password == '') {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
   
    wx.request({
      url: app.globalData.baseUrl + 'loginAndRegister/resetPassword.action', //仅为示例，并非真实的接口地址
      data: {
        phone: this.data.phoneNum,
        validateCode: this.data.validateCode,
        password: this.data.password
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
    })
  }
})
