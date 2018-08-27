//mine.js
//获取应用实例
const app = getApp();

Page({
  data: {
    imgdata: app.globalData.imgdata,
    balance: '', // 用户余额
    score: '', // 用户积分
    userHeadImg: app.globalData.imgdata + '/mine/cf_nologin.png', // 默认用户头像地址
    userName: '' // 用户昵称
  },
  onLoad:function () {},
  // 页面数据加载
  pageInit: function () {
    app.fetch({
      url: '/account/user/info'
    })
      .then((response) => {
        console.info(response)
        this.setData({
          balance: response.balance,
          score: response.score,
          userHeadImg: response.headimgurl ? response.headimgurl : this.data.userHeadImg,
          userName: response.nickname ? response.nickname : '闪餐' + response.userId
        })
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.pageInit();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
