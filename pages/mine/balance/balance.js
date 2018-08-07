// pages/mine/aboutus/aboutus.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgdata: app.globalData.imgdata,
    items: [
      { name: 'sir', value: '微信支付' , checked: 'true'},
      { name: 'ms', value: '支付宝支付', },
      { name: 'ms', value: '充值码支付',}
    ],
    payitems: [
      { name: '20元',},
      { name: '30元',},
      { name: '50元',},
      { name: '100元', },
      { name: '150元', },
      { name: '200元', }
    ],
    payitem: '20元',
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    }, 
    hiddensuccess: false
  },
  radioChange: function (e) {
    var that = this;
    that.setData({
      sex: e.detail.value,
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },//选择支付方式
  tabFun: function (e) {
    //获取触发事件组件的dataset属性  
    var _datasetId = e.target.dataset.id;
    console.log(e.target);
    console.log("----" + _datasetId + "----");
    if (_datasetId == 0){
      this.setData({
        payitem: '20元'
      });
    } else if (_datasetId == 1){
      this.setData({
        payitem: '30元'
      });
    } else if (_datasetId == 2){
      this.setData({
        payitem: '50元'
      });
    } else if (_datasetId == 3) {
      this.setData({
        payitem: '100元'
      });
    } else if (_datasetId == 4) {
      this.setData({
        payitem: '150元'
      });
    }else{
      this.setData({
        payitem: '200元'
      });
    }
    console.log(this.data.payitem);
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj
    });
  },
  pay:function(){
    var that = this;
    that.setData({
      hiddensuccess: true
    })
    setTimeout(function () {
      that.setData({
        hiddensuccess: false
      });
    }, 2000);
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '余额'
    })
  },
})