//index.js
//获取应用实例
const app = getApp()
var bmap = require('../../../utils/bmap-wx.min.js'); // 引入百度地图js
var wxMarkerData = []; //定位成功回调对象
Page({
  data: {
    imgdata: app.globalData.imgdata,

    ak: 'NPfvQSlaxLvtuBWm4YDVwecQNoTACuUY', // 填写申请到的ak
    currentCity: '',

    autoplay: true,
    imgsDotBanner: [], // 轮播banner

    indicatorDotsCandan: true, //
    interval: 5000,
    duration: 1000,
    indicatorColor: '#D5D5D5',
    indicatorActiveColor: '#F1A101',

    machineId: '', // 当前选择机器Id
    couponList: [], // 优惠券

    caidanNav: [],

    address: '', //地址
    newddata: '',
    currentTab: 0,
    currentSwiper: 0,
    indicatorDots: false,
    
    recomTC: '',  //推荐套餐
    
    //遮罩状态
    popStatus:'hide',
    //搜索下热词（餐品）
    hotwordNameArr:'',
    todayBuy: [],//今日购
    todayBuyList: [],//今日购
    toView: '',
    styleStr: '',
    modelstyle: '',
    todaymealId: '0', //今日购餐品类型，默认是全部餐品
    prevOrdermealId: '0', //预定餐品类型，默认是全部餐品
    startY: 0,//记录touchstart时位置
    pinglunList: [],//评论列表
    boxTop: 0,//记录今日购、预定、评论的距离顶部高度0时固定定位
    fixedFlag: false//记录今日购、预定、评论的距离顶部高度0时固定定位
  },
  onLoad: function (option) {
    // 设置定位
    this.setPosition();
    // 广告轮播
    // this.getAllTCarouselFigureList();
    // 获取本地机器id
    const machineId = wx.getStorageSync('machineId');
    this.setData({
      machineId: machineId
    })
    // 获取优惠券
    this.getCoupon();
    // 菜单
    this.getMenuClass();
    // 推荐餐品
    this.getRecomtc();
    // 今日够
    // this.todayBuy();
    // this.setData({
    //   fixedFlag: false,
    //   boxTop: 0
    // });

  },
  // 定位设置
  setPosition: function () {
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: that.data.ak
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      const posData = data.originalData.result;
      that.setData({
        currentCity: posData.formatted_address
      });
    }
    // 发起POI检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success
    });
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
        console.info(response)
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
        console.info(response, this)
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
        console.info(response, this)
        this.setData({
          couponList: response.slice(0,3)
        })
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
  // 点击关闭模态框
  closeModel: function () {
    app.globalData.indexmodelstyle = 'display: none;'
    this.setData({ modelstyle: app.globalData.indexmodelstyle });
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
  goMealDetail:function(e){//跳转到商品详情
    // console.log(e);data-machineid
    wx.navigateTo({
      url: '../mealDetail/mealDetail?id=' + e.currentTarget.dataset.id + '&machineid=' + e.currentTarget.dataset.machineid,
    })
  },
  // 点击预定滚动到预定商品
  toyuding: function (e){
    if (e.currentTarget.dataset.menuname == "预定"){
      this.setData({
        styleStr: 'padding-top:220rpx;',
        toView: 'todayShopping',
        currentTab: 1
      })
    }
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
    const id = parseInt(e.currentTarget.dataset.id);
    this.setData({
      todaymealId: id,
      todayBuyList: this.data.todayBuy[id].foods
    });
    todayListArr = this.data.todayBuyList;
  },
  // 点击预定---餐品类型
  prevOrdermealType: function(e){
    // console.log(e.currentTarget.dataset.id)
    this.setData({
      prevOrdermealId: e.currentTarget.dataset.id
    });
  },
  //热词列表
  hotwords:function(){
    var that = this;
    wx.request({

      url: app.globalData.baseUrl + 'hostWord/getAllAppHotword.action',
      method: 'POST',
      data: {},
      header: {'content-type': 'application/x-www-form-urlencoded'},
      success: function (res) {
        var dataArr = res.data.data;
        if(!dataArr || dataArr.length<=0) return;
        var hotwordNameArr = [];
        for (var i = 0; i < dataArr.length;i++){
          hotwordNameArr.push(dataArr[i]) ;
        }
        that.setData({
          hotwordNameArr: hotwordNameArr
        })
      }
    })
  },
  //添加到购物车
  addBuyCar:function(e){
    // console.log(e);
    var that = this;
    var id = e.currentTarget.dataset.id;
    var machineid = parseInt(e.currentTarget.dataset.machineid);
    wx.getStorage({
      key: 'token',
      success: function(res) {
        that.setData({
          sessionid:res.data
        })
        wx.request({
          url: app.globalData.baseUrl + 'tCart/addCart.action', 
          method: 'POST',
          data: {
            foodId: id,
            machineId: machineid,
            foodCount: 1,
            token: that.data.sessionid
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            // console.log(res, '加入购物车');
            if(res.data.code == 0){
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 1000
              })
            }
          },
          fail: function(){
            wx.showToast({
              title: '加入购物车失败',
              icon: 'none'
            })
          }
        })
      },
    })
  },
  getEvaluateList: function (that){//获取评论列表
    wx.request({
      url: app.globalData.baseUrl + 'tFoodEvaluate/queryTfoodEvaluateList.action',
      method: 'POST',
      data: {
        iDisplayStart: 1,//起始条数
        iDisplayLength: 10,//每页显示数量
        machineId: '1',
        foodId: '1'
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        // console.log(res,'评论列表');
        if (res.data.aData && res.data.aData.length > 0){
          for(var i = 0; i < res.data.aData.length;i++){
            var item = res.data.aData[i];
            var itemTime = new Date(item.addTime).getTime();
            var nowTime = new Date().getTime();
            if (nowTime-itemTime < 5000){
              item.addTime = "五分钟之前";
            } else {
              item.addTime = util.formatTime(new Date(itemTime))
            }
          }
          that.setData({
            pinglunList: res.data.aData
          });
        }
      },
      fail: function(){
        console.log('评论列表数据获取失败');
      }
    })
  },
  onPageScroll: function (res) {//监听页面滚动
    const that = this;
    var query = wx.createSelectorQuery()
    query.select('#theid').boundingClientRect();
    query.select('#topContainer').boundingClientRect();
    query.exec(function (rect) {
      if (rect[0].top <= (rect[1].height + 3)){
        that.setData({
          fixedFlag: true
        });
      } else {
        that.setData({
          fixedFlag: false
        });

      }
    });
  }
})
