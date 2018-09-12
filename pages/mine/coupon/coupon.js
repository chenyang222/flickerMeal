const app = getApp();
var utils = require('../../../utils/util.js');
Page({
  data: {
    imgdata: app.globalData.imgdata,
    couponArr: [],
    format: ['-', '-', ' ', ':', ':', ' ']
  },
  onLoad: function () {
    
  },
  onShow: function () {
    app.fetch({
      url: '/operate/coupon/findByUserId',
      method: 'post',
      data: {
        use: 0,
        flag: 0
      }
    }).then((response) => {
      let couponArr = response;
      for (let i = 0; i < couponArr.length; i++) {
        couponArr[i].startTime = utils.formatTime(couponArr[i].createTime,this.data.format);
        const endTime = Number(couponArr[i].createTime) + (couponArr[i].period * 86400000);
        couponArr[i].endTime = utils.formatTime(endTime, this.data.format);
      }
      this.setData({
        couponArr: response
      })
    })
  }
})