// pages/mine/invisepaypsd/invisepaypsd.js
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
  }, 1000)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgdata: app.globalData.imgdata,
    is_show: true,
    is_shownxt: true,
    hiddenwx: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]
    // console.log(currentPage.options.edittel)
    this.setData({
      userphone: currentPage.options.edittel,
      usertel: currentPage.options.edittel.substr(0, 3) + "****" + currentPage.options.edittel.substr(7)
    })
    wx.setNavigationBarTitle({
      title: '修改手机号'
    })
  },
  bindReplaceInput: function (e) {
    var that = this;
    that.setData({
      name: e.detail.value,
    })

    if (e.detail.value.length == 6) {
      that.setData({
        is_shownxt: (!that.data.is_shownxt)  //false
      })
    }
    console.log(e.detail.value)
  },//验证码
  getcode: function () {
    var that = this;
    console.log(that.data.usertel)
    // console.log(this.data.name);
    // 将获取验证码按钮隐藏60s，60s后再次显示
    that.setData({
      is_show: (!that.data.is_show)  //false
    })
    settime(that);
    wx.request({
      url: app.globalData.baseUrl + 'loginAndRegister/SMSSend.action',
      method: "get",
      data: {
        phone: that.data.userphone,
        msgFlag: 4
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      }
    })
  },//获取验证码
  changePay: function () {
    var that = this;
    if (that.data.name == '' || that.data.name == undefined) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.request({
      url: app.globalData.baseUrl + 'userInfo/updateUntiePhone.action',
      method: "get",
      data: {
        userId: 1,
        validateCode: this.data.name
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            hiddenwx: true
          })
          setTimeout(function () {
            that.setData({
              hiddenwx: false
            });
            wx.navigateTo({
              url: '/pages/mine/newphone/newphone'
            })
          }, 2000);
        }
      }
    })
  },//修改手机号
})