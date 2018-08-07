//login.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgdata: app.globalData.imgdata,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    phoneNum:'',
    pass:'',
    name_focus:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } 
    // 在没有 open-type=getUserInfo 版本的兼容处理
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
    
  },
  //获取手机号
  getPhoneNum:function(e){
    this.setData({
      phoneNum: e.detail.value
    })
  },
  //获取密码
  getPass: function (e) {
    this.setData({
      pass: e.detail.value
    })
  },
  //登录确认
  loginBtn: function () {
    wx.request({
      url: app.globalData.baseUrl + 'loginAndRegister/userLogin.action',
      method: "POST",
      data: {
        phone: this.data.phoneNum,
        password: this.data.pass
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // console.log(res, 'DENGLU')
        if(res.data.code == 0){
          wx.setStorage({
            key: "token",
            data: res.data.sessionId
          })
          wx.setStorage({
            key: "shancanuserid",
            data: res.data.userId
          })
          
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
            mask: true
          })
          setTimeout(function(){
            wx.switchTab ({  
              url: "/pages/index/shouye/shouye"
            })
          },1500);
        }
      }
    })
  }
})
