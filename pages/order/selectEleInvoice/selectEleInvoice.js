// pages/order/selectEleInvoice/selectEleInvoice.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgdata: app.globalData.imgdata,
    invoiceList: [],
    selectInvoice: 0,
    orderNo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNo: options.orderNo
    })
  },
  // 新增发票
  toAddInvoice: function () {
    wx.navigateTo({
      url: "/pages/order/applyEleInvoice/applyEleInvoice",
    })
  },
  deleteInvoice: function (e) {
    const that = this;
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除此发票信息吗？',
      success: (res) => {
        if (res.confirm) {
          app.fetch({
            url: '/account/userinvoice/delete'
          })
            .then((response) => {
              wx.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000
              })
              setTimeout(function () {
                that.getInvoiceList();
              }, 1000)
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  selectInvoice: function (e) {
    const that = this;
    const item = e.currentTarget.dataset.item;
    let data = {};
    data.orderNo = this.data.orderNo;
    data.invoiceFlag = item.flag;
    data.invoiceEmail = item.email;
    data.invoiceTitle = item.title;
    if (item.flag == 1) {
      data.invoiceIRD = item.ird;
    }
    wx.showModal({
      title: '提示',
      content: '确定要以此发票信息来申请发票吗？',
      success: (res) => {
        if (res.confirm) {
          app.fetch({
            url: '/fastfood/foodorder/addInvoice',
            data: data
          })
            .then((response) => {
              wx.showToast({
                title: '申请成功',
                icon: 'none',
                duration: 2000
              })
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 获取发票信息列表
  getInvoiceList: function () {
    app.fetch({
      url: '/account/userinvoice/findByUserId'
    })
      .then((response) => {
        this.setData({
          invoiceList: response
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
    this.getInvoiceList();
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