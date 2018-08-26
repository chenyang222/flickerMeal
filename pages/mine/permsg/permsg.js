// pages/mine/permsg/permsg.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgdata: app.globalData.imgdata,
    userimg:'',//用户头像
    userid:'',//用户ID
    usernickname:'',//昵称
    usersex:'',//用户性别
    userphone:'',//用户手机号
    tempFilePaths: '',
    flag: true,//昵称遮罩
    searchinput:'',//昵称框
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
    var that = this;
    wx.setNavigationBarTitle({
      title: '个人信息'
    })
    app.fetch({
      url: '/account/user/info'
    })
      .then((response) => {
        console.info(response)
        this.setData({
          userimg: response.headimgurl,
          userphone: response.mobile,
          usernickname: response.nickname ? response.nickname : '闪客' + (Math.random() * 1000).toFixed(0)
        })
        if (response.sex == 1) {
          that.setData({
            usersex: '男',
          })
        } else if (response.sex == 2) {
          that.setData({
            usersex: '女',
          })
        }
      })
  },
  loadmsg:function(){
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + 'userInfo/getAppUserDetail.action',
      method: "GET",
      data: {
        userId: 1
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res);
          that.setData({
            userimg: res.data.data.photo,
            usernickname: res.data.data.nickName,
            userid: res.data.data.id,
            
            usersex: res.data.data.sex,
            usertel: res.data.data.phone,//待到修改手机号页面
            userphone: res.data.data.phone.substr(0, 3) + "****" + res.data.data.phone.substr(7)
          })
          if (res.data.data.sex == 1) {
            that.setData({
              usersex: '男',
            })
          } else if (res.data.data.sex == 2){
            that.setData({
              usersex: '女',
            })
          }
        }
      }
    })
  },
  chooseimage: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      // itemColor: "#CED63A",
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

    wx.chooseImage({
      count: 3,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...  
        console.log(tempFilePaths[0])
        wx.uploadFile({
          url: `https://sc.jergavin.com/mini/uplodFile/uploadAttach.action`,
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            filename: 1
          }, success: function (res) {
            // res.data = JSON.parse(res.data);
            // if (res.statusCode != 200 || res.data.code != 0) {
            //   wx.showModal({
            //     title: '上传文件错误',
            //     content: '上传错误:' + JSON.stringify(res),
            //     showCancel: false,
            //   });
            //   return;
            // }
            var xxx = JSON.parse(res.data);
            console.log(xxx[0].fileName);
            wx.request({
              url: app.globalData.baseUrl + 'userInfo/updateAppUser.action',
              method: "POST",
              data: {
                flag: 1,
                data: xxx[0].fileUrl,
                userId: 1
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                if (res.data.code == 0) {
                  console.log(xxx[0].fileName);
                  console.log(res);
                  that.loadmsg();
                }
              }
            })
          },
          fail: function (err) {
            wx.hideLoading();
            wx.showModal({
              title: '上传文件错误',
              content: err.message,
              showCancel: false,
            });
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
        wx.request({
          url: app.globalData.baseUrl + 'userInfo/updateAppUser.action',
          method: "POST",
          data: {
            flag: 2,
            data: that.data.nickname,
            userId: 1
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            if (res.data.code == 0) {
              that.setData({ 
                flag: true,
                searchinput:''
              })
              that.loadmsg();
            }
          }
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
    wx.request({
      url: app.globalData.baseUrl + 'userInfo/updateAppUser.action',
      method: "POST",
      data: {
        flag: 3,
        data: that.data.menu,
        userId: 1
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.loadmsg();
        }
      }
    })
    console.log(that.data.menu)
  },
  bindMenu2: function () {
    var that = this;
    this.setData({
      menu: 2,
      actionSheetHidden: !this.data.actionSheetHidden
    })
    wx.request({
      url: app.globalData.baseUrl + 'userInfo/updateAppUser.action',
      method: "POST",
      data: {
        flag: 3,
        data: that.data.menu,
        userId: 1
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.loadmsg();
        }
      }
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
})

