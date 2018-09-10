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
    sex: '',
    balance: '',
    payType: 2 // 0=积分兑换 1=微信支付 2=余额支付
  },
  onLoad: function (option) {
    app.fetch({
      url: '/account/address/list'
    }).then((response) => {
      for (let i = 0 ; i < response.list.length; i++) {
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
    app.fetch({
      url: '/account/user/info'
    })
      .then((response) => {
        console.info(response)
        this.setData({
          balance: response.balance
          // score: response.score,
        })
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
  // 切换支付方式
  selectPaytype: function (e) {
    this.setData({
      payType: e.currentTarget.dataset.paytype
    })    
  },
  // 去支付
  toPay: function(){
    const orderNo = this.data.orderNo;
    if (this.data.payType == 2) {
      // 余额支付
      app.fetch({
        url: '/fastfood/foodorder/balancePayForOrder?orderNo=' + orderNo
      })
        .then((response) => {
          wx.showToast({
            title: '支付成功',
            icon: 'none',
            duration: 3000,
            mask: true
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/order/orderDetail/orderDetail?orderNo=' + orderNo,
            })
          }, 3000)
        })
    } else if (this.data.payType == 1){
      // 微信支付
      app.fetch({
        url: '/fastfood/foodorder/wxAppPayForOrder?orderNo=' + orderNo
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
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/order/orderDetail/orderDetail?orderNo=' + orderNo,
                })
              }, 3000)
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
  }
})