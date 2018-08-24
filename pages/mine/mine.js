//mine.js
//获取应用实例
const app = getApp();

Page({
  data: {
    imgdata: app.globalData.imgdata,
    balance: '', // 用户余额
    score: '' // 用户积分
  },
  onLoad:function () {
    app.fetch({
      url: '/account/user/info'
    })
      .then((response) => {
        console.info(response)
        this.setData({
          balance: response.balance,
          score: response.score
        })
      })
  },
  onReady: function(){},
})
