const app = getApp();
Page({
  data: {
    imgdata: app.globalData.imgdata,
    couponArr: []
  },
  onLoad: function (options) {
    //console.log(options);
    wx.setNavigationBarTitle({
      title: '优惠券'
    })
    var that = this;
    app.fetch({
      url: '/operate/coupon/findByUserId',
      method: 'post',
      data: {
        use: 0,
        flag: 0
      }
    }).then((response) => {
      console.info(response)
      // that.setData({
      //   couponArr: response.list
      // })
    })
  }
})