
const app = getApp(); 
// // Page({

// //   data: {
// //     imgdata: app.globalData.imgdata,
// //   },

// //   onLoad: function (options) {
// //     // document.getElementById('#getLocation').onclick = function () {
// //     // this.getloaction();
// //     // };
// //   },
// //   getloaction: function () {
// //     wx.getLocation({
// //       type: 'gcj02', //返回可以用于wx.openLocation的经纬度
// //       success: function (res) {
// //         var latitude = res.latitude
// //         var longitude = res.longitude
// //         console.log(latitude);
// //         console.log(longitude)
// //         wx.openLocation({
// //           latitude: latitude,
// //           longitude: longitude,
// //           scale: 28
// //         })
// //       }
// //     })
// //   }

// // })

Page({
  data: {
    imgdata: app.globalData.imgdata,
    markers: [{
      iconPath: app.globalData.imgdata+"/yh_map.png",
      id: 0,
      latitude: 39.9158275736,
      longitude: 116.4396016107,
      width: 30,
      height: 30
    }],
    polyline: [{
      points: [{
        longitude: 116.4396016107,
        latitude: 39.9158275736
      }, {
          longitude: 116.4396016107,
          latitude: 39.9158275736
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: app.globalData.imgdata+'/yh_map.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 30,
        height: 30
      },
      clickable: true
    }]
  },
  onLoad: function (options) {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res);
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        console.log(latitude);
        console.log(longitude);
      }
    })

  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})




// // 引用百度地图微信小程序JSAPI模块 
// var bmap = require('../../../utils/bmap-wx.js');
// var wxMarkerData = [];
// Page({
//   data: {
//     markers: [],
//     latitude: '',
//     longitude: '',
//     placeData: ''
//   },
//   makertap: function (e) {
//     var that = this;
//     var id = e.markerId;
//     that.showSearchInfo(wxMarkerData, id);
//     that.changeMarkerColor(wxMarkerData, id);
//   },
//   onLoad: function () {
//     var that = this;
//     // 新建百度地图对象 
//     var BMap = new bmap.BMapWX({
//       ak: 'FWcsLOiPpo7fh8r0iUf34dj9VVzCYS3m'
//     });
//     var fail = function (data) {
//       console.log(data)
//     };
//     var success = function (data) {
//       wxMarkerData = data.wxMarkerData;
//       that.setData({
//         markers: wxMarkerData
//       });
//       that.setData({
//         latitude: wxMarkerData[0].latitude
//       });
//       that.setData({
//         longitude: wxMarkerData[0].longitude
//       });
//     }
//     // 发起POI检索请求 
//     BMap.search({
//       "query": '酒店',
//       fail: fail,
//       success: success,
//       // 此处需要在相应路径放置图片文件 
//       iconPath: '../../img/marker_red.png',
//       // 此处需要在相应路径放置图片文件 
//       iconTapPath: '../../img/marker_red.png'
//     });
//   },
//   showSearchInfo: function (data, i) {
//     var that = this;
//     that.setData({
//       placeData: {
//         title: '名称：' + data[i].title + '\n',
//         address: '地址：' + data[i].address + '\n',
//         telephone: '电话：' + data[i].telephone
//       }
//     });
//   },
//   changeMarkerColor: function (data, i) {
//     var that = this;
//     var markers = [];
//     for (var j = 0; j < data.length; j++) {
//       if (j == i) {
//         // 此处需要在相应路径放置图片文件 
//         data[j].iconPath = "../../img/marker_yellow.png";
//       } else {
//         // 此处需要在相应路径放置图片文件 
//         data[j].iconPath = "../../img/marker_red.png";
//       }
//       markers[j](data[j]);
//     }
//     that.setData({
//       markers: markers
//     });
//   }
// })