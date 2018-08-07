//logs.js
const util = require('../../utils/util.js')
const app = getApp();

Page({
  data: {
    logs: [],
    imgdata: app.globalData.imgdata
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
