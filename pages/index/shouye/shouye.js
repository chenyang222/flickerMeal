//index.js
//获取应用实例
const app = getApp()
var bmap = require('../../../utils/bmap-wx.min.js'); // 引入百度地图js
var wxMarkerData = []; //定位成功回调对象
var cityCodeJson = require('../../../utils/cityCode.js'); // 引入cityJson.js
var utils = require('../../../utils/util.js');
Page({
  data: {
    imgdata: app.globalData.imgdata,
    currentCity: '',
    cityCodeJson: [], // city.js
    machineList: [], // 机器列表
    machineAllList: [],
    isShouAllMachine: false,

    autoplay: true,
    imgsDotBanner: [], // 轮播banner

    indicatorDotsCandan: true, //
    interval: 5000,
    duration: 1000,
    indicatorColor: '#D5D5D5',
    indicatorActiveColor: '#F1A101',

    machineId: '', // 当前选择机器Id
    isShouAllList: false, // 是否展示所有优惠券
    couponList: [], // 优惠券
    couponAllList: [], // 所有优惠券

    caidanNav: [],

    address: '', //地址
    newddata: '',
    currentTab: 0,
    currentSwiper: 0,
    indicatorDots: false,
    
    recomTC: '',  //推荐套餐
    
    //遮罩状态
    popStatus:'hide',
    todayBuy: [],//今日购
    todayBuyList: [],//今日购

    nowSelectTime: '',
    getWeekList: [], // 预定时间列表
    weekProductList: [], // 预定餐品列表

    todaymealId: '', //今日购餐品类型，默认是全部餐品
    prevOrdermealId: '', //预定餐品类型，默认是全部餐品

    leftMeaslList: [], // 左侧导航

    addToCar: false, // 添加到购物车

    pinglunList: [],//评论列表
    format: ['-', '-', ' ', ':', ':', ' '],

    toView: '',
    styleStr: '',
    modelstyle: '',
    
    startY: 0,//记录touchstart时位置

    boxTop: 0,//记录今日购、预定、评论的距离顶部高度0时固定定位
    fixedFlag: false//记录今日购、预定、评论的距离顶部高度0时固定定位
  },
  onLoad: function (option) {},
  onShow: function () {
    // 设置定位
    this.setPosition();
    // 广告轮播
    this.getAllTCarouselFigureList();
    // 获取本地机器id
    const machineId = wx.getStorageSync('machineId');
    this.setData({
      machineId: machineId
    })
    // 获取优惠券
    this.getCoupon();
    // city.js 引入data
    this.setData({
      cityCodeJson: cityCodeJson.city
    })
    // 定位并获取机器列表
    this.setPosition();
    // 菜单
    this.getMenuClass();
    // 左侧餐品分类导航
    this.getMachineMessage();
    // 推荐餐品
    this.getRecomtc();
    // 今日够
    this.getTodayBuy();
    this.setData({
      fixedFlag: false,
      boxTop: 0
    });
    // 获取预定时间列表
    this.getWeekMessage();
    // 每周菜谱
    this.getWeek();
    // 获取所有活动列表
    // app.fetch({
    //   url: '/operate/activitys/list'
    // })
    //   .then((response) => {
    //     console.info(response)

    //   })
    // 获取机器评价
    this.getMachineEva();
  },
  //点击定位跳转
  posiIn: function () {
    wx.navigateTo({
      url: '/pages/index/positionSele/positionSele'
    })
  },
  // 首页Banner
  getAllTCarouselFigureList: function () {
    var that = this;
    app.fetch({
      url: '/operate/adpos/get_advert_info',
      data: {
        advertCode: 20000001,
        advertType: 2
      }
    })
      .then((response) => {
        that.setData({
          imgsDotBanner: response ? response : []
        })
      })
  },
  // 获取菜单分类
  getMenuClass: function () {
    // let caidanNav = [{
    //   list: [ {
    //     name: '早餐',
    //     id: '002',
    //     photoUrl: '/zaoc.png'
    //   }, {
    //     name: '午餐',
    //     id: '003',
    //     photoUrl: '/wuc.png'
    //   }, {
    //     name: '晚餐',
    //     id: '004',
    //     photoUrl: '/wanc.png'
    //   }, {
    //     name: '外卖',
    //     id: '005',
    //     photoUrl: '/wm.png'
    //   },  {
    //     name: '机器推荐',
    //     id: '009',
    //     photoUrl: '/jqtj.png'
    //   }, {
    //     name: '闪餐story',
    //     id: '010',
    //     photoUrl: '/sc.png'
    //   }]
    // }]
    let caidanNav = [];
    this.setData({
      caidanNav: caidanNav
    })
  },
  // 获取推荐套餐
  getRecomtc: function () {
    app.fetch({
      url: '/fastfood/foodmachine/findProductByMacIdAndProductCatId',
      data: {
        macId: this.data.machineId
      }
    })
      .then((response) => {
        this.setData({
          recomTC: response.slice(0,3)
        })
      })
  },
  // 获取优惠券列表
  getCoupon: function () {
    app.fetch({
      url: '/operate/coupon/findByMacId',
      data: {
        macId: this.data.machineId
      }
    })
      .then((response) => {
        this.setData({
          couponList: response.slice(0,3),
          couponAllList: response
        })
      })
  },
  // 是否展示所有优惠券切换
  showAllCoupon: function () {
    this.setData({
      isShouAllList: !this.data.isShouAllList
    })
  },
  // 领取优惠券
  getGoupon: function (e) {
    const couponId = e.currentTarget.dataset.id;
    const macId = this.data.machineId;
    app.fetch({
      url: '/operate/coupon/getByCouponId',
      data: {
        macId: macId,
        couponId: couponId
      }
    })
      .then((response) => {
        console.info(response)
        wx.showToast({
          title: '领取成功',
          icon: 'success',
          duration: 1000
        })
      })  
  },
  // 获取餐品大类(左侧导航)
  getMachineMessage: function () {
    app.fetch({
      url: '/fastfood/foodmachine/findProductCatByMacId',
      data: {
        macId: this.data.machineId
      }
    })
      .then((response) => {
        console.info(response)
        this.setData({
          leftMeaslList: response,
          todaymealId: response.length > 0 ? response[0].id : '',
          prevOrdermealId: response.length > 0 ? response[0].id : ''
        })
      })
  },
  // 获取今日购
  getTodayBuy: function () {
    app.fetch({
      url: '/fastfood/foodmachine/findProductByMacIdAndProductCatId',
      data: {
        macId: this.data.machineId
      }
    })
      .then((response) => {
        this.setData({
          todayBuyList: response
        })
      })
  },
  // 获取预定时间列表
  getWeekMessage: function () {
    const arr_week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const date = new Date();
    const getTime = date.getTime();
    let timeList = [];
    for (let i = 0; i < 5; i++) {
      date.setTime(getTime + 24 * 60 * 60 * 1000 * (i + 1))
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      const day = date.getDate();
      if (month < 10) month = '0' + month;
      const weekDay = date.getDay();
      let week;
      for (let j = 0; j < arr_week.length; j++) {
        if (weekDay == j) {
          week = arr_week[j];
          break;
        }
      }
      let obj = {};
      obj.full = year + '-' + month + '-' + day;
      obj.part = month + '-' + day;
      obj.week = week;
      timeList.push(obj)
    }
    this.setData({
      nowSelectTime: timeList[0].full,
      getWeekList: timeList
    })
  },
  // 获取预定餐品列表
  getWeek: function (e) {
    const date = new Date();
    const getTime = date.getTime();
    date.setTime(getTime + 24 * 60 * 60 * 1000);
    let month = date.getMonth() + 1;
    if (month < 10) month = '0' + month;
    const nowSelectTime = date.getFullYear() + '-' + month + '-' + date.getDate();
    console.info(nowSelectTime)
    const macId = this.data.machineId;
    app.fetch({
      url: '/fastfood/foodmachine/findProductByMacIdAndAdTime',
      data: {
        macId: macId,
        time: nowSelectTime
      }
    })
      .then((response) => {
        for (let i = 0;i<response.length;i++) {
          response[i].buyNumber = 0;
        }
        this.setData({
          weekProductList: response
        })
      })
  },
  // 获取预定餐品列表
  selectWeek: function (e) {
    const full = e.currentTarget.dataset.full;
    const macId = this.data.machineId;
    this.setData({
      nowSelectTime: full
    })
    app.fetch({
      url: '/fastfood/foodmachine/findProductByMacIdAndAdTime',
      data: {
        macId: macId,
        time: full
      }
    })
      .then((response) => {
        for (let i = 0; i < response.length; i++) {
          response[i].buyNumber = 0;
        }
        this.setData({
          weekProductList: response
        })
      })
  },
  // 获取当前机器评价
  getMachineEva: function () {
    const macId = this.data.machineId;
    app.fetch({
      url: '/fastfood/foodordercomment/findByMacId?macId=' + macId
    })
      .then((response) => {
        let pinglunList = response;
        for (let i = 0; i < pinglunList.length; i++ ) {
          pinglunList[i].createTime = utils.formatTime(pinglunList[i].createTime, this.data.format)
        }
        this.setData({
          pinglunList: pinglunList
        })
      })
  },
  //添加到购物车
  addBuyCar: function (e) {
    const aisleId = e.currentTarget.dataset.aisleid;
    const productId = e.currentTarget.dataset.productid;
    const macId = this.data.machineId;
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
    const cpType = e.currentTarget.dataset.type ? e.currentTarget.dataset.type : '';
    wx.navigateTo({
      url: '/pages/index/mealDetail/mealDetail?item=' + item + '&type=' + cpType,
    })
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTba: e.detail.current
    });
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  }, 
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },  
  goSearch: function(e){//跳转到搜索列表
    wx.navigateTo({
      url: '../hotWords/hotWords?name=' + e.currentTarget.dataset.name,
    })
  },
  // 开始滑动
  handleTouchstart: function (event){
    this.setData({
      startY : event.touches[0].pageY
    });
  },
  handleTouchmove: function (event){
    var currentY = event.touches[0].pageY;
    var ty = currentY - this.data.startY;
    if(ty != 0){
      if (this.data.styleStr == 'padding-top:220rpx;'){
        this.setData({
          styleStr: ''
        });
      }
    }
  },
  // 滑动商品列表swiper
  changeSwiper: function(e){
    // console.log(e);
    this.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  // 点击今日购
  todayClick: function(e){
    this.setData({
      currentTab: 0
    });
  },
  // 点击预定
  prevOrderClick: function(e){
    this.setData({
      currentTab: 1
    });
  },
  // 点击评价
  assessClick: function(e){
    this.setData({
      currentTab: 2
    });
  },
  // 点击今日购---餐品类型
  todaymealType: function(e){
    const id = e.currentTarget.dataset.id;
    this.setData({
      todaymealId: id
    });
  },
  // 点击预定---餐品类型
  prevOrdermealType: function(e){
    this.setData({
      prevOrdermealId: e.currentTarget.dataset.id
    });
  },
  onPageScroll: function (res) {//监听页面滚动
    const that = this;
    var query = wx.createSelectorQuery()
    query.select('#theid').boundingClientRect();
    query.select('#topContainer').boundingClientRect();
    query.exec(function (rect) {
      if (rect[0].top <= (rect[1].height + 85)){
        that.setData({
          fixedFlag: true
        });
      } else {
        that.setData({
          fixedFlag: false
        });
      }
    });
  },
  // 生成预定订单
  makeOrder: function () {

    const nowSelectTime = this.data.nowSelectTime; // 预定时间
    const weekProductList = this.data.weekProductList; // 预定餐品
    let childs = [];
    for (let i = 0; i < weekProductList.length; i++) {
      if (weekProductList[i].buyNumber > 0) {
        let obj = {};
        obj.macId = this.data.machineId;
        obj.productId = weekProductList[i].productId;
        obj.aisleId = weekProductList[i].aisleId;
        obj.buyNumber = weekProductList[i].buyNumber;
        childs.push(obj)
      }
    }
    if (childs.length <= 0) {
      return
    }
    
    let data = {};
    let body = {};
    body.childs = childs;
    body.takeFoodTime = nowSelectTime;
    body.macId = this.data.machineId;
    data.body = JSON.stringify(body);
    console.info(data)

    app.fetch({
      url: '/fastfood/foodorder/createOrder',
      method: 'post',
      requestBody: true,
      data: data
    })
      .then((response) => {
        for (let i = 0; i < weekProductList.length; i++) {
          weekProductList[i].buyNumber = 0;
        }
        this.setData({
          weekProductList: weekProductList
        })
        const orderNo = response.orderNo;
        wx.navigateTo({
          url: "/pages/order/payment/payment?orderNo=" + orderNo,
        })
      })
  },
  editShoppingNum: function (id, num) {
    const weekProductList = this.data.weekProductList; // 预定餐品
    for (let i = 0; i < weekProductList.length; i++) {
      if (id == weekProductList[i].productId) {
        weekProductList[i].buyNumber = num;
      }
    }
    this.setData({
      weekProductList: weekProductList
    })
  },  
  //减
  reduce: function (e) {
    if (e.currentTarget.dataset.buynumber <= 0) {
      return;
    }
    let num = e.currentTarget.dataset.buynumber - 1;
    this.editShoppingNum(e.currentTarget.dataset.productid, num);
  },
  //加
  plus: function (e) {
    let num = e.currentTarget.dataset.buynumber + 1;
    this.editShoppingNum(e.currentTarget.dataset.productid, num)
  },
  // 定位设置
  setPosition: function () {
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: app.globalData.ak
    });
    var fail = function (data) {
      app.fetch({
        url: '/fastfood/foodmachine/findByAreaCode'
      })
        .then((response) => {
          // 获取推荐机器人
          that.setData({
            machineList: response
          })
        })
    };
    var success = function (data) {
      const posData = data.originalData.result;
      that.setData({
        currentCity: posData.formatted_address
      })
      var cityStrArr = [];
      cityStrArr.push(posData.addressComponent.province);
      cityStrArr.push(posData.addressComponent.city);
      cityStrArr.push(posData.addressComponent.district);
      that.getMachineByCityCode(cityStrArr);
    }
    // 发起POI检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success
    });
  },
  // 根据code获取机器
  getMachineByCityCode: function (cityStrArr) {
    var that = this;
    var cityCodeJson = this.data.cityCodeJson;
    var areaCode = [];
    for (let i = 0; i < cityCodeJson.length; i++) {
      if (cityStrArr[0] == cityCodeJson[i].name) {
        areaCode.push(i);
        if (cityStrArr[0] == '北京市') {
          for (let j = 0; j < cityCodeJson[i].sub.length; j++) {
            if (cityStrArr[2] == cityCodeJson[i].sub[j].name) {
              areaCode.push(j);
            }
          }
          areaCode.push(0);
        } else {
          for (let j = 0; j < cityCodeJson[i].sub.length; j++) {
            if (cityStrArr[1] == cityCodeJson[i].sub[j].name) {
              areaCode.push(j);
              for (let a = 0; a < cityCodeJson[i].sub[j].sub.length; a++) {
                if (cityStrArr[2] == cityCodeJson[i].sub[j].sub[a].name) {
                  areaCode.push(a);
                }
              }
            }
          }
        }
      }
    }
    app.fetch({
      url: '/fastfood/foodmachine/findByAreaCode',
      method: 'get',
      data: {
        // areaCode: areaCode.join(',')
        areaCode: '0,4,0'
      }
    })
      .then((response) => {
        // 获取推荐机器人
        that.setData({
          machineList: response.slice(0,1),
          machineAllList: response
        })
      })
  },
  // 设置机器id
  setStorgeId: function (e) {
    const machineId = e.currentTarget.dataset.machineid;
    const machineName = e.currentTarget.dataset.machinename;
    wx.setStorageSync('machineId', machineId)
    wx.setStorageSync('machineName', machineName)
    this.onLoad();
  },
  showAllMachine: function () {
    this.setData({
      isShouAllMachine: !this.data.isShouAllMachine
    })
  }
})
