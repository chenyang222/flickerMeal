const app = getApp();
var interval = null // 倒计时函数
var countdown = 60; // 60秒设置
// 倒计时计时
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
  }, 1000)
}
Page({
  data: {
    imgdata: app.globalData.imgdata, // 图片
    phoneNum: '', // 手机号码
    validateCode: '', // 验证码
    invitationCode: '', // 邀请码
    last_time: '', // 倒计时秒数
    is_show: true, // 显示倒计时或者获取验证码
    code: '', // 登陆获取code
    inviter: ''
  },
  onLoad: function (options) {
    if (options.inviter) {
      this.setData({
        inviter: options.inviter
      })
    }
  },
  onShow: function () {
    app.login();
  },
  // 获取验证码
  getIdentifyingCode: function () {
    var that = this;
    // 手机号判断拦截
    if (this.data.phoneNum == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    // 后台获取验证码
    wx.request({
      url: "https://shanchan.jergavin.com/sms/send?mobile=" + that.data.phoneNum + "&app=true",
      success: function (res) {
        wx.showToast({
          title: '获取验证码成功,请稍后',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        // 将获取验证码按钮隐藏60s，60s后再次显示
        that.setData({
          is_show: (!that.data.is_show)  //false
        })
        // 倒计时
        settime(that);
      }
    })
  },
  // 获取手机号
  phoneVal: function (e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  // 获取验证码
  vlidataVal: function (e) {
    this.setData({
      validateCode: e.detail.value
    })
  },
  // 获取邀请码
  yaoqingCodeVal: function (e) {
    this.setData({
      invitationCode: e.detail.value
    })
  },
  // 确定注册
  comfirmRegist: function () {
    console.info(app.globalData.openid)
    // 手机号判断拦截
    if (this.data.phoneNum == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    // 验证码判断拦截
    if (this.data.validateCode == '') {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false;
    }
    const that = this;
    let data = {};
    if (this.data.inviter) {
      data = {
        mobile: this.data.phoneNum,
        openid: app.globalData.openid,
        inviter: this.data.inviter,
        vfcode: this.data.validateCode
      }
    } else {
      data = {
        mobile: this.data.phoneNum,
        openid: app.globalData.openid,
        vfcode: this.data.validateCode
      }
    }
    // 注册绑定
    wx.request({
      url: "https://shanchan.jergavin.com/oauth2/token/wechatApp/register",
      data: data,
      success: function (res) {
        if (res.data.errcode == 0) {
          // token data 处理
          app.handleToken(res.data)
          wx.reLaunch({
            url: '/pages/index/machine/machine'
          })
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
      }
    })
  }
})
