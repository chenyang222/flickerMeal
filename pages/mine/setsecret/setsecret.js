// pages/mine/setsecret/setsecret.js
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
    selected: true,
    selected1: false,
    is_show: true,
    namecode:'',
    hiddenwx: false,
    hiddensuccess:false
  },
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })
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
      title: '修改密码'
    })
  },
  bindReplaceInput: function (e) {
    var that = this;
    that.setData({
      namecode: e.detail.value,
    })
  },//验证码
  bindReplacepass:function(e){
    var that = this;
    that.setData({
      password1: e.detail.value,
    })
  },//短信原密码
  oldpad: function (e) {
    var that = this;
    that.setData({
      oldpad: e.detail.value,
    })
  },//密码原密码
  newpad1: function (e) {
    var that = this;
    that.setData({
      newpad1: e.detail.value,
    })
  },//密码新密码1
  newpad2: function (e) {
    var that = this;
    that.setData({
      newpad2: e.detail.value,
    })
  },//密码新密码2
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
        msgFlag: 5
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
  messageconfirm:function(){
    var that = this;
    if (that.data.namecode == '' || that.data.namecode == undefined){
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false 
    }
    if (that.data.password1 == '' || that.data.password1 == undefined) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    wx.request({
      url: app.globalData.baseUrl + 'userInfo/updatePassWordBySMS.action',
      method: "POST",
      data: {
        validateCode: that.data.namecode,
        passWord: that.data.password1,
        userId:1
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          // that.loadmsg();
          console.log(res);
          that.setData({
            hiddensuccess: true
          })
          setTimeout(function () {
            that.setData({
              hiddensuccess: false
            });
          }, 2000);
        }
      }
    })
  },//短信修改
  changePay: function () {
    var that = this;
    
    if (that.data.oldpad == '' || that.data.oldpad == undefined) {
      wx.showToast({
        title: '原密码不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.newpad1 == '' || that.data.newpad1 == undefined) {
      wx.showToast({
        title: '新密码不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.newpad2 == '' || that.data.newpad2 == undefined) {
      wx.showToast({
        title: '确认新密码不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.newpad1 != that.data.newpad2) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }
    wx.request({
      url: app.globalData.baseUrl + 'userInfo/updatePassWordByOld.action',
      method: "POST",
      data: {
        userId:1,
        oldPassWord: that.data.oldpad,//旧密码
        passWord: that.data.newpad1,//新密码
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          // that.loadmsg();
          console.log(res);
          
          that.setData({
            hiddensuccess: true
          })
          setTimeout(function () {
            that.setData({
              hiddensuccess: false
            });
          }, 2000);
        } else if (res.data.code == 1){
          that.setData({
            hiddenwx: true
          })
          setTimeout(function () {
            that.setData({
              hiddenwx: false
            });
          }, 2000);
        }
      }
    })
  },//密码修改
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