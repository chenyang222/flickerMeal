const app = getApp();
Page({
  data: {
      imgdata: app.globalData.imgdata,

  },
  onLoad: function (options) {
    //console.log(options);
    this.loadmsg();
  },
  loadmsg: function () {
    var that = this;
  },
})