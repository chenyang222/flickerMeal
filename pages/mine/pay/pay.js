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
  onShow: function () {
    app.fetch({
      url: '/account/user/info'
    })
      .then((response) => {
        console.info(response)
        this.setData({
          balance: util.toMoney(response.balance)
        })
      })
  },  
  onLoad: function (options) {}
})