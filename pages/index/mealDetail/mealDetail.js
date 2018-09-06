const app = getApp();
var util = require('../../../utils/util.js');

Page({
  data: {
    imgdata: app.globalData.imgdata,
    imgUrls: [
      '/images/carFanImg.png',
      '/images/carFanImg.png',
      '/images/carFanImg.png',
      '/images/carFanImg.png',
      '/images/carFanImg.png'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    options: {},
    foodInfo: {}//餐品信息
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onLoad: function(options){
    // console.log(options);
    this.setData({ options: options});
    // 获取餐品详情
    this.getFoodinfo();
  },
  getFoodinfo: function () {// 获取餐品详情
    const that = this;
    wx.request({
      url: app.globalData.baseUrl + 'tFood/getFoodInfo.action',
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      data: { 
        id: that.data.options.id, 
        userId: wx.getStorageSync('shancanuserid')
      },
      success: function(res){
        console.log(res.data);
        if(res.data.code == 1){
          for (var i = 0; i < res.data.Evaluate.length; i++){
            var item = res.data.Evaluate[i];
            //格式手机号
            item.user.phone = item.user.phone.substr(0, 3) + '****' + item.user.phone.substr(7);
            //格式时间
            var itemTime = new Date(item.addTime).getTime();
            var nowTime = new Date().getTime();
            if (nowTime - itemTime < 5000) {
              item.addTime = "五分钟之前";
            } else {
              item.addTime = util.formatTime(new Date(itemTime))
            }
          }
          that.setData({ foodInfo: res.data});
          
        }
      }

    })
  },
  addBuyCar: function (e) {//添加到购物车
    // console.log(e);
    var that = this;
    var machineid = parseInt(e.currentTarget.dataset.machineid);
    wx.getStorage({
      key: 'token',
      success: function (res) {
        console.log(res);
        that.setData({
          sessionid: res.data
        })
        wx.request({
          url: app.globalData.baseUrl + 'tCart/addCart.action',
          method: 'POST',
          data: {
            foodId: that.data.options.id,
            machineId: that.data.options.machineid,
            foodCount: 1,
            token: wx.getStorageSync('token')
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            console.log(res, '加入购物车');
            if (res.data.code == 0) {
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 1000
              })
            }
          },
          fail: function () {
            wx.showToast({
              title: '加入购物车失败',
              icon: 'none'
            })
          }
        })
      },
    })
  },

})