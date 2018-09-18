// pages/order/applyEleInvoice/applyEleInvoice.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgdata: app.globalData.imgdata,
    invoiceType: 1,
    rise: '',
    duty: '',
    email: ''
  },
  // 选择类型
  selectType: function (e) {
    const sType = e.target.dataset.stype;
    this.setData({
      invoiceType: sType
    })
  },
  // 输入抬头
  inputRise: function (e) {
    this.setData({
      rise: e.detail.value
    })
  },
  // 输入税号
  inputDuty: function (e) {
    this.setData({
      duty: e.detail.value
    })
  },
  // 输入邮箱
  inputEmail: function (e) {
    this.setData({
      email: e.detail.value
    })
  },
  saveEleInvoice: function () {
    const flag = this.data.invoiceType;
    const rise = this.data.rise;
    const email = this.data.email;
    let duty;
    let data = {};
    data.flag = flag;
    data.title = rise;
    data.email = email;
    if (flag == 1) {
      data.ird = this.data.duty;
      // form拦截
      if (!data.flag || !data.title || !data.email || !data.ird) {
        wx.showToast({
          title: '请您将发票信息填写完整',
          icon: 'none',
          duration: 2000
        })
        return false
      }
    } else {
      // form拦截
      if (!data.flag || !data.title || !data.email) {
        wx.showToast({
          title: '请您将发票信息填写完整',
          icon: 'none',
          duration: 2000
        })
        return false
      }      
    }

    app.fetch({
      url: '/account/userinvoice/save',
      data: data
    })
      .then((response) => {
        wx.showToast({
          title: '添加成功',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },1000)
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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