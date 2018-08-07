const app = getApp();
Page({
  data: {
      imgdata: app.globalData.imgdata,
      str:'',
      ceshi:'',
  },
  // bindTextAreaBlur: function (e) {
  //   this.setData({
  //     ceshi: e.detail.value
  //   })
    
  // }, 
  bindvalue: function (e) {
    var that = this;
    if (e.detail.value != " ") {
      var value = e.detail.value
      // value = value.replace(/\s+/g, "")
      if (e.detail.cursor <= 140) {
        that.setData({
          inputLength: e.detail.cursor,
          value: value,
        })
      }
    } else {
      that.setData({
        value: '',
      })
    }


  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '反馈'
    })
  },
  submitbtn:function(){
    var that = this;
    console.log("hao");
    console.log(that.data.value);
    if (that.data.value == '' || that.data.value == undefined){
      wx.showToast({
        title: '反馈内容不能为空',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    wx.request({
      url: app.globalData.baseUrl + 'userInfo/addFk.action',
      data: {
        content: that.data.value
      },
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res);
          wx.showToast({
            title: '信息反馈成功',
            image: false,
            duration: 1500
          })
        }
      }
    })
  }
})