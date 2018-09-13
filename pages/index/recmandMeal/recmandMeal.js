const app = getApp();
Page({
  data: {
    imgdata: app.globalData.imgdata,
    recomTC: [] // 所有餐品
  },
  onLoad: function () {
    this.getRecomtc();
  },
  // 获取推荐套餐
  getRecomtc: function () {
    app.fetch({
      url: '/fastfood/foodmachine/findProductByMacIdAndProductCatId',
      data: {
        macId: wx.getStorageSync('machineId')
      }
    })
      .then((response) => {
        console.info(response)
        this.setData({
          recomTC: response
        })
      })
  },
  //添加到购物车
  addBuyCar: function (e) {
    const aisleId = e.currentTarget.dataset.aisleid;
    const productId = e.currentTarget.dataset.productid;
    const macId = wx.getStorageSync('machineId')
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
  },
  // 跳转到餐品详情
  toMealDetail: function (e) {
    const item = JSON.stringify(e.currentTarget.dataset.item);
    console.info(item)
    wx.navigateTo({
      url: '/pages/index/mealDetail/mealDetail?item=' + item,
    })
  }
})