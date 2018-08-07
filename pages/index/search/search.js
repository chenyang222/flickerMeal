const app = getApp();

Page({
  data: {
      imgdata: app.globalData.imgdata,
      inputVal: '',
      searchListArr: [],//搜索历史
      HotSearch: [],//热门搜索
      isSearch: false
  },
  onLoad: function (options) {
    const that = this;
    wx.setNavigationBarTitle({
      title: '搜索'
    })
    var userId = wx.getStorageSync('shancanuserid');
    //console.log(options, userId);
    /*
    * 初始化搜索历史
    * 1.获取最近10条搜索记录
    */
    this.getSearchHistoryLatest(that)

    // 获取热门搜索
    this.getHotSearch(that);
  },
  bindKeyInput:function(e){//输入搜索内容
    if (e.detail.value.trim().length>0){
      this.setData({
        inputVal: e.detail.value,
        isSearch: true 
      });
    } else {
      this.setData({
        isSearch: false 
      });
    }
  },
  searchGoods: function(){//点击搜索时
    const that = this;
    if (this.data.inputVal.trim()){
      //todo
      wx.navigateTo({
        url: '../hotWords/hotWords?from=searchpage&name=' + this.data.inputVal,
      })
    } else {
      wx.showToast({
        title: '搜索内容为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }
  },
  goIndex: function(e){//跳转首页
    wx.switchTab({
      url: '../shouye/shouye',
    })
  },
  getSearchHistoryLatest: function (that, userId) {//获取最近10条搜索记录
    wx.request({
      url: app.globalData.baseUrl + 'userFindHistory/queryUserFindHistoryList.action',
      data: { userId: userId},
      success: function(res){
        console.log(res);
        if(res.data.code == 0){
          if (res.data.data && res.data.data.length>0){
            that.setData({
              searchListArr: res.data.data
            });
          }
        }
      }
    })
  },
  clearHistory:function(){//清空历史搜索
    //todo
    this.setData({ searchListArr: []});
  },
  clickSearchHistory: function(e){//点击搜索历史
    console.log(e);
    this.setData({
      inputVal: e.currentTarget.dataset.name
    });
    
  },
  getHotSearch: function (that){//获取热门搜索
    wx.request({
      url: app.globalData.baseUrl + 'hostWord/getAllAppHotword.action',
      method: 'POST',
      data: {},
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function(res){
        // console.log(res);
        if(res.data.code == 1){
          if(res.data.data && res.data.data.length>0){
            that.setData({ HotSearch: res.data.data});
          }
        }
      },
      fail: function(){

      }
    })
  },
  clickHotSearch: function (e) {//点击热门历史
    this.setData({
      inputVal: e.currentTarget.dataset.name
    });
  }
})