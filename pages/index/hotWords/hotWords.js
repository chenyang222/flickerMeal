const app = getApp();
var optionsObj = {};

Page({
  data: {
      imgdata: app.globalData.imgdata,
      searchResultList: [],
      pageSize: 10,
      currentPage: 1
  },
  onLoad: function (options) {
    optionsObj = options;
    const that = this;
    var searchName = options.name;
    // 获取搜索列表
    that.getSearchGoods(that, searchName);
  },
  goSearch: function(){
    if (optionsObj.from == "searchpage") {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateTo({
        url: '../search/search?from=hotwordspage',
      })
    }
  },
  getSearchGoods: function(that, search){
    wx.request({
      url: app.globalData.baseUrl + 'tFood/querySearchFoodList.action',
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        iDisplayStart: that.data.currentPage,//起始条数
        iDisplayLength: that.data.pageSize,//每页显示数量
        foodName: search
      },
      success: function(res){
        console.log(res);
        if (res.data.aData && res.data.aData.length > 0){
          that.setData({
            searchResultList: res.data.aData
          });
        }
      },
      fail: function(){
        wx.showToast({
          title: '数据异常',
          icon: 'none'
        })
      }
    })
  }
})