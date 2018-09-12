const app = getApp();
Page({
  data: {
    imgdata: app.globalData.imgdata,
    orderNo: '',
    mealList: [],
    payAmount: '',
    countAmountNum: '',
    address: '',
    mobile: '',
    consignee: '',
    sex: '',
    balance: '',
    payType: 2, // 0=积分兑换 1=微信支付 2=余额支付
    isHaveActivies: '', // 是否有活动
    couponSelect: '', // 优惠券选择
    couponList: [], // 优惠券List
    couponSelectId: '' // 选择的优惠券的id
  },
  onShow: function () {
    let amount = '';
    let length = 0;
    for (let i = 0; i < this.data.couponList.length; i++) {
      if (this.data.couponSelectId == this.data.couponList[i].id) {
        amount = this.data.couponList[i].amount;
      }
      if (this.data.payAmount >= this.data.couponList[i].useRestrict) {
        length++;
      }
    }
    if (this.data.couponSelectId == 'nouse') {
      this.setData({
        couponSelect: length + '个可用',
        countAmountNum: this.data.payAmount
      })
    } else {
      this.setData({
        couponSelect: '-￥ ' + amount,
        countAmountNum: this.data.payAmount - amount
      })
    }
  },
  onLoad: function (option) {
    // 地址信息
    // app.fetch({
    //   url: '/account/address/list'
    // }).then((response) => {
    //   for (let i = 0 ; i < response.list.length; i++) {
    //     if (response.list[i].defaultFlag == 0) {
    //       let sex;
    //       if (response.list[i].sex == 1) {
    //         sex = '先生'
    //       } else if (response.list[i].sex == 2) {
    //         sex = '女士'
    //       } else {
    //         sex = '暂未设置'
    //       }
    //       this.setData({
    //         address: response.list[i].areaCode + response.list[i].address,
    //         mobile: response.list[i].mobile,
    //         consignee: response.list[i].consignee,
    //         sex: sex
    //       })
    //     }
    //   }
    // })
    // 个人信息余额
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
          payAmount: response.orderAmount,
          countAmountNum: response.orderAmount
        })
        // 当前订单是否有活动
        app.fetch({
          url: '/fastfood/foodorder/calCheckTotalFeeByOrderNo?orderNo=' + this.data.orderNo
        })
          .then((res) => {
            console.info(res)
            if (res.activitys) {

            } else {
              app.fetch({
                url: '/operate/coupon/findByUserId?macId=' + wx.getStorageSync('machineId'),
                method: 'post',
                data: {
                  use: 0,
                  flag: 0
                }
              })
                .then((data) => {
                  let length = 0;
                  let list = [];
                  for (let i = 0; i < data.length; i++) {
                    if (response.orderAmount >= data[i].useRestrict) {
                      length++;
                      list.push(data[i])
                    }
                  }
                  this.setData({
                    couponSelect: length + '个可用',
                    couponList: list,
                    couponSelectId: 'nouse'
                  })
                })
            }
          })
      })
  },
  // 去选择优惠券
  toSelectCoupon: function () {
    wx.navigateTo({
      url: '/pages/order/selectCoupon/selectCoupon?couponSelectId=' + this.data.couponSelectId + '&payAmount=' + this.data.payAmount,
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
    const couponId = this.data.couponSelectId;
    const data = {
      orderNo: orderNo,
      couponId: couponId == 'nouse' ? '' : couponId
    }
    if (this.data.payType == 2) {
      // 余额支付
      app.fetch({
        url: '/fastfood/foodorder/balancePayForOrder',
        data: data
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
        url: '/fastfood/foodorder/wxAppPayForOrder',
        data: data
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