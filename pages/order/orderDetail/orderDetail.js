// pages/order/orderDetail/orderDetail.js
const app = getApp();
var utils = require('../../../utils/util.js');
// 倒计时
var payTime = function (createTime, that) {
  var date = new Date().getTime();
  var overTimeText = '';
  const time = 20 * 60 - (date - createTime) / 1000;
  if (time > 0) {
    overTimeText = '剩余支付时间 : ' + utils.sToMinutes(time);
    that.setData({
      overTimeText: overTimeText
    })
    setTimeout(function () {
      payTime(createTime, that);
    }, 1000);
  } else {
    overTimeText = '订单已取消';
    that.setData({
      overTimeText: overTimeText,
      orderStatus: -1
    })
  }
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgdata: app.globalData.imgdata,
    orderNo: '',
    format: ['-', '-', ' ', ':', ':', ' '],
    orderStatus: '', // 当前订单状态
    overTimeText: '', // 倒计时
    mealList: [], // 餐品列表
    createTimeText: '', // 订单创建时间
    payType: '', // 支付方式
    total: 0, // 合计金额
    takeFoodCode: '', // 取餐码
    qrCode: '', // 取餐二维码
    couponFee: 0 // 优惠券
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNo: options.orderNo
    })
    this.getOrder();
  },
  // 获取到订单信息
  getOrder: function () {
    app.fetch({
      url: '/fastfood/foodorder/findOrderInfoByUser?orderNo=' + this.data.orderNo
    })
      .then((response) => {
        console.info(response)
        let createTimeText = utils.formatTime(response.createTime, this.data.format);
        let payType;
        if (response.payType == 0) {
          payType = '积分兑换'
        } else if (response.payType == 1){
          payType = '微信支付'
        } else if (response.payType == 2) {
          payType = '余额支付'
        }
        let couponFee = response.couponFee ? response.couponFee : 0;
        let total = response.orderAmount - couponFee;
        this.setData({
          orderStatus: response.orderStatus,
          mealList: response.childs,
          createTimeText: createTimeText,
          payType: payType ? payType : '',
          total: total,
          takeFoodCode: response.takeFoodCode ? response.takeFoodCode : '',
          qrCode: response.qrCode ? response.qrCode : '',
          couponFee: couponFee
        })
        if (response.orderStatus == 0) {
          payTime(response.createTime, this)
        }
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