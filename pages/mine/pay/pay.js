const app = getApp();
const util = require('../../../utils/util.js');
Page({
  data: {
    imgdata: app.globalData.imgdata,
    iftrue: false,
    balance: ''
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
    app.fetch({
      url: '/account/user/info'
    })
      .then((response) => {
        console.info(response)
        this.setData({
          balance: util.toMoney(response.balance)
        })
      })
  }
})