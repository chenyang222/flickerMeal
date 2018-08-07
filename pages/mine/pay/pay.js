const app = getApp();
Page({
  data: {
      imgdata: app.globalData.imgdata,
      iftrue: false,
  },
  changePay: function (e) {
    this.iftrue = true;
    console.log("kajs");
  },
  onLoad: function (options) {
    //console.log(options);
    wx.setNavigationBarTitle({
      title: '余额'
    })
  }
})