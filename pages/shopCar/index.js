const app = getApp();

Page({
  data: {
    imgdata: app.globalData.imgdata,
    // list: [
    //   { txt: 'item111111111', isTouchMove: false},
    //   { txt: 'item222222222', isTouchMove: false },
    //   { txt: 'item333333333', isTouchMove: false },
    //   { txt: 'item444444444', isTouchMove: false }],
    //购物车列表数据
    carListDataArr:'',
    //机器名称
    madichInfo:'',
    sessionid:'',
    //删除全部id
    delAllId:'',
    totalMoney: 0
  },
  onLoad: function () {
    var that = this;
    // var macId = 1;
    app.fetch({
      url: '/fastfood/shoppingcart/list/?macId=1'
    })
      .then((response) => {
        console.info(response)
        that.setData({
          carListDataArr: response
        })
      })
  },
  onShow:function(){
    //购物车列表
    // this.carList();
  },
  //购物车列表
  carList:function(){
    var that = this;
    // var macId = 1;
    app.fetch({
      url: '/fastfood/shoppingcart/list/?macId=1'
    })
      .then((response) => {
        console.info(response)
        that.setData({
          carListDataArr: response
        })
      })
  },
  touchstart: function (e) {
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    })
  },
  touchmove: function (e) {
    let index = e.currentTarget.dataset.index,//当前索引
      startX = this.data.startX,//开始X坐标
      startY = this.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = this.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    this.data.carListDataArr.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    // //更新数据
    this.setData({
      carListDataArr: this.data.carListDataArr
    })
  },

  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI)
  },

  //单个删除
  del: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    console.log(id)
    wx.showModal({
      title: '提示',
      content: '确定要删除？',
      success: (res) => {
        if (res.confirm) {
          
          wx.request({
            url: app.globalData.baseUrl + 'tCart/deleteCart.action', 
            method: 'GET',
            data: {
              carIds:  id,
              token: that.data.sessionid
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res)
              if(res.data.code == 0){
                //购物车列表
                that.carList();
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //删除所所有
  delAll:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除？',
      success: (res) => {
        if (res.confirm) {
          
          wx.request({
            url: app.globalData.baseUrl + 'tCart/deleteCart.action',
            method: 'GET',
            data: {
              carIds: that.data.delAllId,
              token: that.data.sessionid
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res, '删除所所有');
              if(res.data.code == 0){
                that.setData({ carListDataArr: [], totalMoney: 0 })
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //减
  jian:function(e){
    if (e.currentTarget.dataset.foodnum <= 1){
      return;
    }
    this.editShoppingNum(e.currentTarget.dataset.foodid, -1);
  },
  //加
  jia:function(e){
    console.log(e);
    this.editShoppingNum(e.currentTarget.dataset.foodid, 1)
  },
  editShoppingNum: function (foodId, count){//修改购物车数量
    const that = this;
    wx.request({
      url: app.globalData.baseUrl + 'tCart/updateCartCount.action',
      data: { 
        machineId: app.globalData.madichid,
        foodId: foodId,
        count: count, //购物车数量 例： 新增（1）,减少（-1）
        token: that.data.sessionid
      },
      success: function(res){
        console.log(res);
        if(res.data.code == 0){
          //购物车列表
          that.carList();
        }
      },
      fail: function(){
        wx.showToast({
          title: '数据更新失败',
          icon: 'none'
        })
      }
    })
  },
  goIndex: function(){
    wx.switchTab({
      url: "/pages/index/shouye/shouye",
    })
  },
  toPay:function(){//生成订单
    const that = this;
    var foodArray=[];
    var shoppingCarIdsArr = [];
    for (var i = 0; i < that.data.carListDataArr.length;i++){
      var item = that.data.carListDataArr[i];
      shoppingCarIdsArr.push(item.id);
      foodArray.push({
        foodId: item.foodId,
        count: item.foodCount
      });
    }
    var foodArrayStr = JSON.stringify(foodArray);

    wx.request({
      url: app.globalData.baseUrl + 'orderMgr/insertFoodOrder.action',
      method: "POST",
      header: { "content-type": "application/x-www-form-urlencoded"},
      data:{
        foodArray: foodArrayStr,//餐品信息json字符串（foodId:餐品id,count:餐品数量）
        orderResource: "0",//订单来源 0：APP 1：机器
        addressId: "",
        dispatchingType: "0",//配送方式：0：自取，1：外卖
        orderType: '0',//订单类型 （0普通订单，1预约订单）
        sendTime: '',//配送时间
        id: app.globalData.madichid,
        uuid: wx.getStorageSync('shancanuserid'),
        catIds: shoppingCarIdsArr.join(',')//购物车id（以逗号隔开）
      },
      success: function(res){
        // console.log(res);
          console.log(res.data.msg);
        if(res.data.code == 0){
          wx.navigateTo({
            url: "/pages/order/payment/payment",
          })
        }
      },
      error: function(err){

      }

    })
  }
})
