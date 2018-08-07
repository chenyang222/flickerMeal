const app = getApp();
Page({
  data: {
      imgdata: app.globalData.imgdata
  },
  onLoad: function (options) {
    //console.log(options);
  
  },
  goBack:function(){
    wx.navigateBack({
      delta: 1
    })
  }
})