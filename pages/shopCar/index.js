const app = getApp();

Page({
  data: {
    imgdata: app.globalData.imgdata,
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

  },
  onShow:function(){
    //购物车列表
    this.carList();
  },
  //购物车列表
  carList:function(){
    app.fetch({
      url: '/fastfood/shoppingcart/list',
      data: {
        macId: wx.getStorageSync('machineId')
      }
    })
      .then((response) => {
        let totalMoney = 0;
        for (let i = 0; i < response.length;i++) {
          totalMoney += response[i].buyNumber * response[i].price * 100;
        }
        this.setData({
          carListDataArr: response,
          totalMoney: totalMoney/100
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
    console.info(e)
    var cartid = e.target.dataset.cartid;
    wx.showModal({
      title: '提示',
      content: '确定要删除？',
      success: (res) => {
        if (res.confirm) {
          app.fetch({
            url: '/fastfood/shoppingcart/remove',
            data: {
              cartId: cartid
            }
          })
            .then((response) => {
              this.carList();
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
      content: '确定要清空购物车吗？',
      success: (res) => {
        if (res.confirm) {
          app.fetch({
            url: '/fastfood/shoppingcart/clear'
          })
            .then((response) => {
              wx.showToast({
                title: '清空购车成功',
                icon: 'none',
                duration: 1000
              })
              this.carList();
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //减
  reduce:function(e){
    if (e.currentTarget.dataset.buynumber <= 1){
      return;
    }
    let num = e.currentTarget.dataset.buynumber - 1;
    this.editShoppingNum(e.currentTarget.dataset.cartid, num);
  },
  //加
  plus:function(e){
    console.log(e);
    let num = e.currentTarget.dataset.buynumber + 1;
    this.editShoppingNum(e.currentTarget.dataset.cartid, num)
  },
  editShoppingNum: function (cartid, count){//修改购物车数量
    app.fetch({
      url: '/fastfood/shoppingcart/set',
      data: {
        cartId: cartid,
        checkStatus: 1,
        buyNumber: count
      }
    })
      .then((response) => {
        this.carList();
      })
  },
  // 生成订单
  toPay:function(){
    const macId = wx.getStorageSync('machineId');
    let childs = [];
    for (let i = 0; i < this.data.carListDataArr.length; i++) {
      let obj = {};
      obj.cartId = this.data.carListDataArr[i].cartId;
      obj.macId = macId;
      obj.buyNumber = this.data.carListDataArr[i].buyNumber;
      childs.push(obj);
    }

    app.fetch({
      url: '/fastfood/foodorder/createOrderByShoppingCart?macId=' + macId,
      method: 'post',
      requestBody: true,
      data: {
        macId: macId,
        body: JSON.stringify(childs)
      }
    })
      .then((response) => {
        const orderNo = response.orderNo;
        wx.navigateTo({
          url: "/pages/order/payment/payment?orderNo=" + orderNo,
        })
      })
  }
})
