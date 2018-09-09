// pages/mine/aboutus/aboutus.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgdata: app.globalData.imgdata,
    payitems: [
      { name: '20元',},
      { name: '30元',},
      { name: '50元',},
      { name: '100元', },
      { name: '150元', },
      { name: '200元', }
    ],
    payitem: '20',
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    }, 
    inputValue: ''
  },
  tabFun: function (e) {
    //获取触发事件组件的dataset属性  
    var _datasetId = e.target.dataset.id;
    this.setData({
      inputValue: ''
    })
    if (_datasetId == 0){
      this.setData({
        payitem: '20'
      });
    } else if (_datasetId == 1){
      this.setData({
        payitem: '30'
      });
    } else if (_datasetId == 2){
      this.setData({
        payitem: '50'
      });
    } else if (_datasetId == 3) {
      this.setData({
        payitem: '100'
      });
    } else if (_datasetId == 4) {
      this.setData({
        payitem: '150'
      });
    }else{
      this.setData({
        payitem: '200'
      });
    }
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj
    });
  },
  pay:function(){
    var that = this;
    const price = this.data.inputValue ? this.data.inputValue : this.data.payitem;
    app.fetch({
      url: '/recharge/wxpay/wechatapp/payment',
      data: {
        totalFee: price
      }
    })
      .then((response) => {
        console.info(response)
        wx.requestPayment({
          'timeStamp': response.timeStamp,
          'nonceStr': response.nonceStr,
          'package': response.package,
          'signType': response.signType,
          'paySign': response.paySign,
          'success': function (res) {
            wx.showToast({
              title: '充值成功',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            wx.navigateTo({
              url: "/pages/order/pay/pay",
            })
          },
          'fail': function (res) {
            wx.showToast({
              title: '充值失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })           
          }
        })
      })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  onLoad: function () {
  },
})