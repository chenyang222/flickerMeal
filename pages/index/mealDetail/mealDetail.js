const app = getApp();
Page({
  data: {
    imgdata: app.globalData.imgdata,
    foodInfo: {}//餐品信息
  },
  onLoad: function(options){
    this.setData({ 
      foodInfo: JSON.parse(options.item),
      cpType: options.type
    })
  },
  //添加到购物车
  addBuyCar: function (e) {
    const aisleId = e.currentTarget.dataset.aisleid;
    const productId = e.currentTarget.dataset.productid;
    const macId = wx.getStorageSync('machineId');
    app.fetch({
      url: '/fastfood/shoppingcart/add',
      data: {
        aisleId: aisleId,
        productId: productId,
        macId: macId
      }
    })
      .then((response) => {
        wx.showToast({
          title: '已添加到购物车',
          icon: 'success',
          duration: 1000
        })
      })
  }
})