const app = getApp();
Page({
  data: {
      imgdata: app.globalData.imgdata
  },
  onLoad: function (options) {
    //console.log(options);
  
  },
  goIndex: function () {
    wx.switchTab({
      url: '../shouye/shouye'
    });
  }
})