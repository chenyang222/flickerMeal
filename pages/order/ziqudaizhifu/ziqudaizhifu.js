const app = getApp();

Page({
  data: {
      imgdata: app.globalData.imgdata
  },
  onLoad: function () {
    // wx.showModal({
    //   title: '确认收货',
    //   content: '是否确认收货',
    //   confirmText:'取消',
    //   confirmColor:'#F2A437',
    //   cancelText:'确定',
    //   cancelColor:'#F2A437',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('确定')
    //     } else if (res.cancel) {
    //       console.log('取消')
    //     }
    //   }
    // })

  }
})