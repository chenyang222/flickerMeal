
var app = getApp()
var city = require('../../../utils/city.js');
var bmap = require('../../../utils/bmap-wx.min.js');
var wxMarkerData = []; //定位成功回调对象  
Page({
  data: {
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    // tHeight: 0,
    // bHeight: 0,
    cityList: [],
    imgdata: app.globalData.imgdata,
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: "北京市",
    //百度地图的参数
    ak: "FWcsLOiPpo7fh8r0iUf34dj9VVzCYS3m", //填写申请到的ak
    markers: [],
    longitude: '', //经度
    latitude: '', //纬度
    address: '', //地址
    newddata:''
  },
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
  }, 
  onLoad: function () {
    // 生命周期函数--监听页面加载
    var searchLetter = city.searchLetter;
    var cityList = city.cityList();
    var sysInfo = wx.getSystemInfoSync();
    var winHeight = sysInfo.windowHeight;
    var itemH = winHeight / searchLetter.length;
    var tempObj = [];
    for (var i = 0; i < searchLetter.length; i++) {
      var temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;
      tempObj.push(temp)
    }
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempObj,
      cityList: cityList
    })
    // // 获取当前经纬度
    // this.locationCity();

    //定位地址部分
    this.posiAddress();
    

  },
  // 自动定位 
  posiAddress:function(){
    var that = this;
    /* 获取定位地理位置 */
    // 新建bmap对象
    var BMap = new bmap.BMapWX({
      ak: that.data.ak
    });
    var fail = function (data) {
      console.log(data);
    };
    var newddata = '';
    var success = function (data) {
      //返回数据内，已经包含经纬度
      //使用wxMarkerData获取数据
      wxMarkerData = data.wxMarkerData;
      //把所有数据放在初始化data内
      that.setData({
        markers: wxMarkerData,
        latitude: wxMarkerData[0].latitude,
        longitude: wxMarkerData[0].longitude,
        address: wxMarkerData[0].address,
        newddata: wxMarkerData[0].address
      });
    }
    // 发起regeocoding检索请求
    BMap.regeocoding({
      fail: fail,
      success: success
    });
  },
  showSearchInfo: function (data, i) {
    var that = this;
    that.setData({
      rgcData: {
        address: '地址：' + data[i].address + '\n',
        desc: '描述：' + data[i].desc + '\n',
        business: '商圈：' + data[i].business
      }
    });
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  //点击字母选择城市
  clickLetter: function (e) {
    console.log(e.currentTarget.dataset.letter)
    var showLetter = e.currentTarget.dataset.letter;
    this.setData({
      showLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 1000)
  },
  //选择城市
  bindCity: function (e) {
    this.setData({ city: e.currentTarget.dataset.city })
  },
  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({
      scrollTop: 0,
    })
  },
  //获取当前经纬度-》城市
  locationCity:function(){
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        
        that.curreCityName(latitude,longitude);
      }
    })
  },
  //重新定位
  repeatPosi:function(){
    this.setData({
      address:'定位中...'
    })
    //定位地址部分
    this.posiAddress();
    
    // 完成定位后跳转
    setTimeout(function(){
      wx.switchTab({
        url: '../../shouye/shouye'
      })
    },500)
    app.globalData.addre = this.data.newddata
  },
  // 返回
  goback:function(){
    wx.navigateBack({
      delta: 1
    })
  },
})