// pages/order/selectCoupon/selectCoupon.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgdata: app.globalData.imgdata,
    couponList: [],
    select: 'nouse' // 选择的优惠券，默认是不使用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info(options.couponSelectId)
    app.fetch({
      url: '/operate/coupon/findByUserId?macId=' + wx.getStorageSync('machineId'),
      method: 'post',
      data: {
        use: 0,
        flag: 0
      }
    })
      .then((response) => {
        let list = [];
        for (let i = 0; i < response.length; i++) {
          if (options.payAmount >= response[i].useRestrict) {
            list.push(response[i])
          }
        }
        this.setData({
          couponList: list
        })
        if (options.couponSelectId != '') {
          this.setData({
            select: options.couponSelectId
          })
        }
      })
  },

  // 选择使用或者不使用
  selectCoupon: function (e) {
    console.info(e)
    this.setData({
      select: e.target.dataset.select
    })
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({//直接给上移页面赋值
      couponSelectId: e.target.dataset.select
    })
    wx.navigateBack({
      delta: 1
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