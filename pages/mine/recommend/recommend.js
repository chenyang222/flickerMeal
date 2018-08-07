const app = getApp();
Page({
  data: {
      imgdata: app.globalData.imgdata,

  },
  onLoad: function (options) {
    //console.log(options);
    this.loadmsg();
    wx.setNavigationBarTitle({
      title: '推荐有礼'
    })
  },
  loadmsg: function () {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + 'userInfo/queryRecommendingCourtesy.action',
      method: "GET",
      data:{
          userId:1,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res);
          that.setData({
            jifen: res.data.data2,
            tuijian:res.data.data3,
            jired:res.data.data,
          })
        }
      }
    })
  },
})