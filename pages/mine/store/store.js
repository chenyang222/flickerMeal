const app = getApp();
Page({
  data: {
      imgdata: app.globalData.imgdata
  },
  onLoad: function (options) {
    //console.log(options);
    wx.setNavigationBarTitle({
      title: '商城'
    })
  }
})