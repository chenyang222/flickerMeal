const app = getApp();
var bmap = require('../../../utils/bmap-wx.min.js'); // 引入百度地图js
var wxMarkerData = []; //定位成功回调对象
var cityCodeJson = require('../../../utils/cityCode.js'); // 引入cityJson.js
Page({
  data: {
    imgdata: app.globalData.imgdata,
    cityCodeJson: [], // city.js
    machineList: [] // 机器列表
  },
  onLoad: function () {
    // city.js 引入data
    this.setData({
      cityCodeJson: cityCodeJson.city
    })
    // 定位并获取机器列表
    this.setPosition();
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
          machineList: response
        })
      })
  },
  // 设置机器id
  setStorgeId: function (e) {
    const machineId = e.currentTarget.dataset.machineid;
    wx.setStorageSync('machineId', machineId)
    wx.switchTab({
      url: '../shouye/shouye'
    });
  }
})