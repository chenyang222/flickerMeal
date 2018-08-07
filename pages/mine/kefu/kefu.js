const app = getApp();
Page({
  data: {
      imgdata: app.globalData.imgdata,
      items: [],
      flag: true,//昵称遮罩
  },
  onLoad: function (options) {
    //console.log(options);
    this.getphone();
    wx.setNavigationBarTitle({
      title: '我的客服'
    })
  },
  nichshow: function () {
    this.setData({ flag: false })
  },//拨打电话显示
  nichhide: function () {
    this.setData({ flag: true })
  },//拨打电话隐藏
  getphone:function(){
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + 'userInfo/queryAllCustomPhone.action',
      method: "get",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res);
          that.setData({
            items: res.data.data
          })
        }
      }
    })
  },
  telphone:function(e){
    console.log(e.target.id);
    this.setData({
       flag: false,
       nickinput: e.target.id
    })
    
  },
  nickconfirm:function(){
    var that = this;
    console.log(that.data.nickinput);
    wx.makePhoneCall({
      phoneNumber: that.data.nickinput, //此号码并非真实电话号码，仅用于测试  
      success: function () {
        console.log("拨打电话成功！")
        that.setData({ flag: false })
      },
      fail: function () {
        console.log("拨打电话失败！")
        that.setData({ flag: false })
      }
    })  
  }
})