// pages/mine/newphone/newphone.js
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
      // is_shownxt: true,
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

  /**
   * 页面的初始数据
   */
  data: {
    imgdata: app.globalData.imgdata,
    is_show: true,
    hiddenwx: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '修改手机号'
    })
  },
  bindReplaceInput:function(e){
    var that = this;
    that.setData({
      newphone: e.detail.value,
    })
  },//手机号
  bindCodeInput: function (e) {
    var that = this;
    that.setData({
      newphonecode: e.detail.value,
    })
    // if (e.detail.value.length == 6) {
    //   that.setData({
    //     is_shownxt: (!that.data.is_shownxt)  //false
    //   })
    // }
  },//验证码
  getcode: function () {
    var that = this;
    // console.log(that.data.usertel)
    // console.log(this.data.name);
    // 将获取验证码按钮隐藏60s，60s后再次显示
    that.setData({
      is_show: (!that.data.is_show),  //false
      // is_shownxt: (that.data.is_shownxt), 
    })
    settime(that);
    wx.request({
      url: app.globalData.baseUrl + 'loginAndRegister/SMSSend.action',
      method: "get",
      data: {
        phone: that.data.newphone,
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
    // console.log(this.data.name);
    if (that.data.newphone == '' || that.data.newphone == undefined) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.newphonecode == '' || that.data.newphonecode == undefined) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.request({
      url: app.globalData.baseUrl + 'userInfo/updateBindingPhone.action',
      method: "get",
      data: {
        userId:1,
        phone: that.data.newphone,
        validateCode: this.data.newphonecode
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res);
          that.setData({
            hiddenwx: true
          })
          setTimeout(function () {
            that.setData({
              hiddenwx: false
            });
            wx.navigateTo({
              url: '/pages/mine/mine'
            })
          }, 2000);
        }
      }
    })
  },//绑定手机号
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})