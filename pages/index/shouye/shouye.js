//index.js
//获取应用实例
const app = getApp()
var bmap = require('../../../utils/bmap-wx.min.js'); // 引入百度地图js
var wxMarkerData = []; //定位成功回调对象  
Page({
  data: {
    ak: 'NPfvQSlaxLvtuBWm4YDVwecQNoTACuUY', // 填写申请到的ak
    latitude: '', // 纬度
    longitude: '',// 经度

    address: '', //地址
    newddata: '',
    currentCity: '',
    imgdata: app.globalData.imgdata,
    imgdataFan: app.globalData.imgdataFan,
    currentTab: 0,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currentSwiper: 0,
    // indicatorDots: false,
    indicatorColor: '#D5D5D5',
    indicatorActiveColor: '#F1A101',
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    imgsDotBanner: [],
    indicatorDotsCandan:true,
    caidanNav:[],
    remomendPack:[
      {
        list: [
          {
            imgIcon: app.globalData.imgdata +'/upload/blShuangpin.png',
            img: app.globalData.imgdata +'/upload/breakfast@2x.png',
            txt: '鸡蛋炒饭',
            monthSale:'300',
            praise:'100%'
          },
          {
            img: app.globalData.imgdata+'/wucan.png',
            txt: '午餐'
          },
          {
            img: app.globalData.imgdata+'/wancan.png',
            txt: '晚餐'
          }
        ]
      }
    ],
    //附近的机器(第一个数据)
    nearbyRoto1:'',
    //附近的机器(剩余机器数据)
    nearbyRoto:'',
    //附近机器人弹窗状态
    status:'hide',
    //遮罩状态
    popStatus:'hide',
    //搜索下热词（餐品）
    hotwordNameArr:'',
    //第一个机器的id
    firstRotoId:'',
    //推荐套餐
    recomTC:'',
    todayBuy: [],//今日购
    todayBuyList: [],//今日购
    sessionid: '',//登录时sessionid也就是token
    toView: '',
    styleStr: '',
    modelstyle: '',
    todaymealId: '0', //今日购餐品类型，默认是全部餐品
    prevOrdermealId: '0', //预定餐品类型，默认是全部餐品
    startY: 0,//记录touchstart时位置
    pinglunList: [],//评论列表
    boxTop: 0,//记录今日购、预定、评论的距离顶部高度0时固定定位
    fixedFlag: false,//记录今日购、预定、评论的距离顶部高度0时固定定位
    lunboArrData:''//广告轮播
  },
  //滑动切换
  swiperTab:function (e) {
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
  // 首页Banner
  getAllTCarouselFigureList:function(){
    var that = this;
    app.fetch({
      url: '/operate/adpos/get_advert_info?advertCode=20000001'
    })
      .then((response) => {
        console.info(response)
        that.setData({
          imgsDotBanner: response
        })
      })
  },
  // 点击关闭模态框
  closeModel:function(){
    app.globalData.indexmodelstyle = 'display: none;'
    this.setData({ modelstyle: app.globalData.indexmodelstyle});
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  onLoad: function (option) {
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: that.data.ak
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      console.info(data)
      wxMarkerData = data.wxMarkerData;
      that.setData({
        latitude: wxMarkerData[0].latitude
      });
      that.setData({
        longitude: wxMarkerData[0].longitude
      });
    }
    // 发起POI检索请求 
    BMap.search({
      fail: fail,
      success: success
    });
    
    // this.setData({
    //   fixedFlag: false,
    //   boxTop: 0
    // });
    // //附近近期人
    // this.nearbyRoboData();
    // //热词（搜索下方热门餐品）
    // this.hotwords();
    // //今日够
    // // this.todayBuy();
    // // 菜单
    // this.getMenuClass();
    // 广告轮播
    // this.getAllTCarouselFigureList();
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
  //点击定位跳转
  posiIn:function(){
    wx.navigateTo({
      url: '/pages/index/positionSele/positionSele'
    })
  },
  // 获取菜单分类
  getMenuClass: function(res){
    const that = this;
    wx.request({
      url: app.globalData.baseUrl + 'appType/gatAllAppType.action',
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function(res){
        // console.log(res);
        if(res.data.code == 1){
          if(res.data.data.length>0){
            var caidanNavArr = [];
            var swiperNum = Math.ceil(res.data.data.length / 10);
            for (var j = 0; j < swiperNum; j++) {
              caidanNavArr.push({list: []});
              for (var i = j*10; i < (j+1)*10; i++) {
                if (!res.data.data[i]) return;
                caidanNavArr[j].list.push(res.data.data[i]);
                that.setData({
                  caidanNav: caidanNavArr
                });
              }
            }
          }  
        }
      }
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
  //首页专题及详细数据初始化
  /*
   initdata:function(){
    wx.request({
      url: app.globalData.baseUrl + 'appSendNews/queryAppSendNewsList.action', //仅为示例，并非真实的接口地址
      data: {
        id:''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
    },
  */
  //附近机器人数据
  nearbyRoboData:function(){
    var that = this;
    wx.getLocation({
      success: function(res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
        wx.request({
          url: app.globalData.baseUrl + 'machine/queryNearbyMachineList.action',
          method:'GET',
          data: {
            longitude: that.data.longitude,
            latitude: that.data.latitude
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            // console.log(res,'------------');
            var dataArr = res.data.data;
            if(!dataArr || dataArr.length<=0) {
              wx.showModal({
                showCancel: false,
                title: '温馨提示',
                content: res.data.msg,
              })
              return
            };
            var obj1 = {};
            var objOther = [];
            for (var i = 0; i < dataArr.length;i++){
              obj1 = dataArr[0];
              if(i>=1){
                objOther.push(dataArr[i])
              }
            }
            that.setData({
              nearbyRoto1:obj1,
              nearbyRoto: objOther,
              firstRotoId: obj1.id
              
            })
            app.globalData.madichid=obj1.id
            
            // 今日购请求
            wx.request({
              url: app.globalData.baseUrl + 'tFood/queryJrgList.action',
              method: 'POST',
              data: {
                id: that.data.firstRotoId,
                token: wx.getStorageSync('token')
              },
              header: {'content-type': 'application/x-www-form-urlencoded'},
              success: function (res) {
                // console.log(res, '今日购');
                var aDataArr = res.data.aData;
                
                that.setData({
                  todayBuy: aDataArr,
                  todayBuyList: aDataArr[0].foods
                })
                todayListArr = that.data.todayBuyList;
              }
            })
            //推荐餐品
            wx.request({
              url: app.globalData.baseUrl + 'tFood/queryRecommendFoodList.action', 
              method: 'GET',
              data: {
                id: that.data.firstRotoId,
                iDisplayStart: 1,
                iDisplayLength: 3
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                var aDataArr = res.data.aData;
                // console.log(res, '推荐');
                that.setData({
                  recomTC: aDataArr
                })
              }
            })
            // 商品评论请求
            that.getEvaluateList(that);
            that.getAllTCarouselFigureList();//广告轮播
          }
        })
   
      },
    })
  },
  //附近机器下拉
  nearbyRotoLa:function(){
    this.setData({
      status:'show',
      popStatus:'show'
    })
  },
  nearbyRotoLahide: function () {//附近机器下拉隐藏
    this.setData({
      status:'hide',
      popStatus:'hide'
    })
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
  // onShow: function () {
  //   var query = wx.createSelectorQuery();
  //   const that = this;
  //   query.select('#theid').boundingClientRect();
  //   query.exec(function (rect) {
  //     that.setData({
  //       boxTop: rect[0].top
  //     });
  //     console.log(that.data.boxTop,11);

  //   })
  // },
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
