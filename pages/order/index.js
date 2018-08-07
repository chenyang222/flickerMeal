//获取应用实例  
var app = getApp()
Page({
  data: {
    imgdata: app.globalData.imgdata,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,// tab切换  
    orderList: [],
    orderStatus: '',//订单状态
  },
  onLoad: function () {
    var that = this;
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
    // 获取订单列表
    this.getOrderList(that);
  },
  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;

    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    //0已关闭，1待付款，2待退款，3待退货，4待发货，5已发货，6待取餐，7已完成，8已预订，9已取消,10已退货
    if (e.currentTarget.dataset.current == 0){
      that.setData({
        orderStatus: ''
      });
    } else if (e.currentTarget.dataset.current == 1) {
      that.setData({
        orderStatus: 1
      });
    } else if (e.currentTarget.dataset.current == 2) {
      that.setData({
        orderStatus: 6
      });
    } else if (e.currentTarget.dataset.current == 3) {
      that.setData({
        orderStatus: 7
      });
    } else if (e.currentTarget.dataset.current == 4) {
      that.setData({
        orderStatus: ''
      });
    }
    that.getOrderList(that);
  },
  getOrderList: function(that){//获取订单列表
    wx.request({
      url: app.globalData.baseUrl + 'orderMgr/selectMachineOrderList.action',
      data: {
        uuid: wx.getStorageSync('shancanuserid'), //用户id
        status: that.data.orderStatus
      },
      success: function(res){
        console.log(res,'订单列表');
        if(res.data.code == 0){
          if (res.data.data.result && res.data.data.result.length > 0){
            that.setData({ orderList: res.data.data.result});
          }
        }
      }
    })
  }
})  