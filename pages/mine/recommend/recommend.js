const app = getApp();
Page({
  data: {
    imgdata: app.globalData.imgdata,
    userId: '',
    count: 0,
    score: 0
  },
  onShareAppMessage: function (res) {
    const that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      const userId = wx.getStorageSync('userId');
      return {
        title: '闪餐',
        path: '/pages/login/login?inviter=' + userId,
        imageUrl: '/images/share.jpg',
        success: function (res) {
          if (res.errMsg == 'shareAppMessage:ok') {
            // 转发成功
            app.fetch({
              url: '/account/user/share'
            })
              .then((response) => { })
          }
        },
        fail: function (res) {
          if (res.errMsg == 'shareAppMessage:fail cancel') {
            // 用户取消
          } else if (res.errMsg == 'shareAppMessage:fail') {
            // 转发失败
          }
        },
        complete: function () {

        }
      }
    } else {
      return {
        title: '闪餐',
        path: '/pages/login/login',
        imageUrl: '/images/share.jpg'
      }
    }
  },
  onLoad: function (options) {
    this.setData({
      userId: wx.getStorageSync('userId')
    })
  },
  onShow: function () {
    app.fetch({
      url: '/account/log/inviteInfo'
    })
      .then((response) => {
        this.setData({
          count: response.count,
          score: response.score == null ? 0 : response.score
        })
      })
  }
})