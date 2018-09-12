// pages/mine/lottery/lottery.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgdata: app.globalData.imgdata,
    animationData: {},
    clickBtnRotate: 0,
    lotteryList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLotteryList();
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
    var animationRotate = wx.createAnimation({
      transformOrigin: "50% 61%",
      duration: 5000,
      timingFunction: "ease",
      delay: 0
    })
    this.animationRotate = animationRotate;
  },
  btnAnimate: function () {
    const newRotate = this.data.clickBtnRotate + 1800;
    this.animationRotate.rotate(newRotate).step();
    this.setData({
      clickBtnRotate: newRotate,
      animationData: this.animationRotate.export()
    })
  },
  // 获取所有奖品列表
  getLotteryList: function () {
    app.fetch({
      url: '/operate/prize/findPrizeByGroup',
      data:{
        group: 'WX_APP_DZP'
      }
    })
      .then((response) => {
        console.info(response)
        this.setData({
          lotteryList: response
        })
      })
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