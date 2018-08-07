const app = getApp();
Page({
  data: {
    imgdata: app.globalData.imgdata,
    imgUrls: [
      '/images/carFanImg.png',
      '/images/carFanImg.png',
      '/images/carFanImg.png',
      '/images/carFanImg.png',
      '/images/carFanImg.png'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  }
})