//获取应用实例  
var app = getApp()
var utils = require('../../utils/util.js');
// 倒计时
var payTime = function(that) {
  var date = new Date().getTime();
  var data = that.data.orderList;
  for (var i = 0; i < data.length; i++) {
    const time = 20 * 60 - (date - data[i].createTime) / 1000;
    if (time > 0) {
      data[i].countDown = '剩余支付时间' + utils.sToMinutes(time);
    } else {
      data[i].countDown = '订单已取消';
      data[i].orderStatus = -1;
    }
  }
  that.setData({
    orderList: data
  })
  setTimeout(function () {
    payTime(that);
  }, 1000);
};
Page({
  data: {
    imgdata: app.globalData.imgdata,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,// tab切换  
    orderList: []
  },
  onLoad: function () {
    const that = this;
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    payTime(that)
  },
  onShow: function () {
    // 获取订单列表
    this.getOrderList();
  },  
  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {
    this.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //获取订单列表
  getOrderList: function() {
    var that = this;
    app.fetch({
      url: '/fastfood/foodorder/findOrderByUser'
    })
      .then((response) => {
        this.setData({ 
          orderList: response
        });
        payTime(that);
      })
  },
  // 去付款
  toPay: function (e) {
    const orderNo = e.target.dataset.orderno;
    wx.navigateTo({
      url: "/pages/order/payment/payment?orderNo=" + orderNo,
    })
  },
  // 查看订单
  toOrderDetail: function (e) {
    const orderNo = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: "/pages/order/orderDetail/orderDetail?orderNo=" + orderNo,
    })
  }
})