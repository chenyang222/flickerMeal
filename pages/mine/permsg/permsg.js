// pages/mine/permsg/permsg.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgdata: app.globalData.imgdata,
    userHeadImg: app.globalData.imgdata + '/mine/cf_nologin.png',//用户头像
    userid:'',//用户ID
    usernickname:'',//昵称
    usersex:'',//用户性别
    userphone:'',//用户手机号
    tempFilePaths: '',
    flag: true,//昵称遮罩
    nickname:'',//昵称框
    searchinput: '',
    actionSheetHidden: true,
    actionSheetItems: [
      { bindtap: 'Menu1', txt: '男' },
      { bindtap: 'Menu2', txt: '女' }
    ],
    menu: '',
    productInfo: {}  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '个人信息'
    })
  },
  // 页面数据加载
  pageInit:function(){
    var that = this;
    app.fetch({
      url: '/account/user/info'
    })
      .then((response) => {
        console.info(response)
        this.setData({
          userHeadImg: response.headimgurl ? response.headimgurl : this.data.userHeadImg,
          userphone: response.mobile,
          usernickname: response.nickname ? response.nickname : '闪餐' + response.userId
        })
        if (response.sex == 1) {
          that.setData({
            usersex: '男',
          })
        } else if (response.sex == 2) {
          that.setData({
            usersex: '女',
          })
        } else if (response.sex == 0) {
          that.setData({
            usersex: '暂未设置',
          })
        }
      })
  },
  chooseimage: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    var that = this;
    const token = wx.getStorageSync("token");
    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        wx.showToast({
          icon: "loading",
          title: "正在上传"
        })
        console.log(tempFilePaths[0])
        wx.uploadFile({
          url: 'https://shanchan.jergavin.com/account/user/upload/headimgurl',
          filePath: tempFilePaths[0],
          name: 'file',
          header: { 
            "Content-Type": "multipart/form-data",
            "Authorization": token
          },
          success: function (res) {
            var data = res.data;
            console.info(JSON.parse(data))
            if (JSON.parse(data).errcode == 0) {
              wx.showToast({
                title: '头像上传成功',
                icon: 'none',
                duration: 2000
              })
              that.pageInit();
              wx.hideToast();              
            } else {
              wx.showToast({
                title: JSON.parse(data).errmsg,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function () {
            that.pageInit();
            wx.hideToast();
          }
        })
      }
    });  
  },
  userimg:function(userimgs){
    wx.request({
      url: app.globalData.baseUrl + 'userInfo/updateAppUser.action',
      method: "POST",
      data: {
        flag: 1,
        data: userimgs,
        userId:1
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res);
        }
      }
    })
  },
  bindReplaceInput: function (e) {
    var that = this;
    that.setData({
      nickname: e.detail.value,
    })
  },//昵称
  nichshow:function(){
    this.setData({ flag: false }) 
  },//修改昵称显示
  nichhide: function () {
    this.setData({ flag: true })
  },//修改昵称隐藏
  nickconfirm:function(){
      var that = this;
      console.log(that.data.nickname);
      if (that.data.nickname) {
        app.fetch({
          url: '/account/user/modifyInfo',
          method: 'post',
          data: {
            nickname: that.data.nickname
          }
        })
          .then((response) => {
            console.info(response)
            that.setData({ 
              flag: true,
              nickname:'',
              searchinput: ''
            })
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000
            })
            that.pageInit();
          })
      }else{
        wx.showToast({
          title: '昵称不能为空',
          icon: 'none',
          duration: 2000
        })
      }
  },//昵称修改
  actionSheetTap: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenu1: function (e) {
    var that = this;
    that.setData({
      menu: 1,
      actionSheetHidden: !this.data.actionSheetHidden
    })
    app.fetch({
      url: '/account/user/modifyInfo',
      method: 'post',
      data: {
        sex: 1
      }
    })
      .then((response) => {
        console.info(response)
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 2000
        })
        that.pageInit();
      })
  },
  bindMenu2: function () {
    var that = this;
    this.setData({
      menu: 2,
      actionSheetHidden: !this.data.actionSheetHidden
    })
    app.fetch({
      url: '/account/user/modifyInfo',
      method: 'post',
      data: {
        sex: 2
      }
    })
      .then((response) => {
        console.info(response)
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 2000
        })
        that.pageInit();
      })
  },
  invisetel:function(e){
    var that = this;
    console.log(that.data.usertel);
    // var a = e.target.id;
    // console.log(e.target);
    // url = '../invisephone/invisephone'
    if (that.data.usertel ){
      wx.navigateTo({
        url: '/pages/mine/invisephone/invisephone?edittel=' + that.data.usertel
      })
    }
    
  },//跳到绑定新手机号
  setserect:function(){
    var that = this;
    console.log(that.data.usertel);
    if (that.data.usertel){
      wx.navigateTo({
        url: '/pages/mine/setsecret/setsecret?edittel=' + that.data.usertel
      })
    }
  },//跳到修改密码
  invisepaypsd:function(){
    var that = this;
    console.log(that.data.usertel);
    if (that.data.usertel) {
      wx.navigateTo({
        url: '/pages/mine/invisepaypsd/invisepaypsd?edittel=' + that.data.usertel
      })
    }
  },
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.pageInit();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

