const app = getApp();
Page({
  data: {
    imgdata: app.globalData.imgdata,
    foodInfo: {}//餐品信息
  },
  onLoad: function(options){
    console.log(options.item);
    this.setData({ 
      foodInfo: JSON.parse(options.item)
    })
  },
  addBuyCar: function (e) {//添加到购物车
    var that = this;

  }
})