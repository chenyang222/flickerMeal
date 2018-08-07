// pages/mine/fullvaluedetail/fullvaluedetail.js
const app = getApp();
Page({
  data: {
    imgdata: app.globalData.imgdata,
  },
  onLoad: function (options) {
    this.fulldetail();
    wx.setNavigationBarTitle({
      title: '充值明细'
    })
  },
  fulldetail:function(){
    wx.request({
      url: app.globalData.baseUrl + 'myRechargeBalance/queryUserRechargeList.action',
      method: "get",
      data: {
        userId: 1,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: 'none',
          //   duration: 2000,
          //   mask: true
          // })
          console.log(res);
        }
      }
    })
  }
})