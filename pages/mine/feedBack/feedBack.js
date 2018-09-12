const app = getApp();
Page({
  data: {
      imgdata: app.globalData.imgdata,
      str:'',
      ceshi:'',
  },
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

  },
  submitbtn:function(){
    var that = this;
    if (that.data.value == '' || that.data.value == undefined){
      wx.showToast({
        title: '反馈内容不能为空',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    console.info(that.data.value)
    app.fetch({
      url: '/account/userfeedback/save',
      method: 'get',
      data: {
        content: that.data.value
      }
    })
      .then((response) => {
        wx.showToast({
          title: '信息反馈成功',
          image: false,
          duration: 1500
        })
      })
  }
})