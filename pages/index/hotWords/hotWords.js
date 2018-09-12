const app = getApp();
var optionsObj = {};

Page({
  data: {
    imgdata: app.globalData.imgdata,
    machineList: [],
    searchName: ''
  },
  onLoad: function (options) {
    optionsObj = options;
    const searchName = options.name;
    console.info(searchName)
    this.setData({
      searchName: searchName
    })
    // 获取搜索列表
    this.getSearchGoods(searchName);
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
  getSearchGoods: function (searchName){
    const that = this;
    app.fetch({
      url: '/fastfood/foodmachine/keyword/search',
      data: {
        keyword: searchName
      }
    })
      .then((response) => {
          that.setData({
            machineList: response
          });
      })
  }
})