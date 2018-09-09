const app = getApp();
Page({
  data: {
    imgdata: app.globalData.imgdata,
    orderNo: '',
    mealList: [],
    payAmount: '',
    address: '',
    mobile: '',
    consignee: '',
    sex: ''
  },
  onLoad: function (option) {
    app.fetch({
      url: '/account/address/list'
    }).then((response) => {
      for (let i = 0 ; i < response.list.length; i++) {
        console.info()
        if (response.list[i].defaultFlag == 0) {
          let sex;
          if (response.list[i].sex == 1) {
            sex = '先生'
          } else if (response.list[i].sex == 2) {
            sex = '女士'
          } else {
            sex = '暂未设置'
          }
          this.setData({
            address: response.list[i].areaCode + response.list[i].address,
            mobile: response.list[i].mobile,
            consignee: response.list[i].consignee,
            sex: sex
          })
        }
      }
    })    
    this.setData({
      orderNo: option.orderNo
    })
    this.getOrder();
  },
  // 获取到订单信息
  getOrder: function () {
    app.fetch({
      url: '/fastfood/foodorder/findOrderInfoByUser?orderNo=' + this.data.orderNo
    })
      .then((response) => {
        this.setData({
          mealList: response.childs,
          payAmount: response.orderAmount
        })
      })
  },
  toPay: function(){//去支付
    app.fetch({
      url: '/fastfood/foodorder/wxAppPayForOrder?orderNo=' + this.data.orderNo
    })
      .then((response) => {
        wx.requestPayment({
          'timeStamp': response.timeStamp,
          'nonceStr': response.nonceStr,
          'package': response.package,
          'signType': response.signType,
          'paySign': response.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            wx.navigateTo({
              url: "/pages/order/index",
            })
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        })
      })
  }
})