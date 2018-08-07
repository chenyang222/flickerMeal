const app = getApp();
Page({
  data: {
      imgdata: app.globalData.imgdata
  },
  onLoad: function (options) {
    //console.log(options);
  
  },
  toPay: function(){//去支付
    wx.request({
      url: '',
    })
    wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: 'MD5',
      paySign: '',
      success: function(res){
        console.log(res);
      },
      fail: function(err){
        console.log(err);
      }
    })
  }
})