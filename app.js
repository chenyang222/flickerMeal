//app.js
App({
  onLaunch: function () {},
  // 公共数据配置
  globalData: {
    // imgdata: '/images',//正常图片展示的地址
    imgdata: 'https://shanchan.jergavin.com/wxapp/images',//正常图片展示的地址
    api: 'https://shanchan.jergavin.com', // 接口请求api
    ak: 'NPfvQSlaxLvtuBWm4YDVwecQNoTACuUY', // 填写申请到的ak
    openid: ''
  },
  //跳转登录页
  jumpLogin: function () {
    wx.redirectTo({
      url: '/pages/login/login'
    })
  },
  // 登陆
  login: function () {
    // 本地存储获取token
    const token = wx.getStorageSync("token");
    const oldDate = wx.getStorageSync("oldDate");
    if (token && !this.verifyToken(oldDate)) {
      wx.reLaunch({
        url: '/pages/index/machine/machine'
      })
    } else {
      const that = this;
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: "https://shanchan.jergavin.com/oauth2/token/wechatApp?js_code=" + res.code,
              data: {
                code: res.code
              },
              success: function (res) {
                console.info(res)
                if (res.data.errcode == 0) {
                  // 正常进入
                  that.handleToken(res.data)
                  wx.reLaunch({
                    url: '/pages/index/machine/machine'
                  })
                } else if (res.data.errcode == 40004) {
                  // 此账号当前尚未注册
                  that.globalData.openid = res.data.data;
                } else if (res.data.errcode == 40001) {
                  // 需要重新授权
                } else {
                  wx.showToast({
                    title: res.data.errmsg,
                    icon: 'none',
                    duration: 1000,
                    mask: true
                  })
                }
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });
    }
  },
  /**
   *  token data处理
   */
  handleToken: function (data) {
    const token = data.data.access_token;
    const expires_in = data.data.expires_in;
    let timeStamp = new Date().getTime() + Number(expires_in * 1000);
    const oldDate = new Date(timeStamp);
    wx.setStorageSync('token', token);
    wx.setStorageSync('oldDate', oldDate);
  },
  /**
   * Token验证
   * return true  未过期
   * return false 已过期
  */
  verifyToken: function (oldDate) {
    const nowDate = new Date();
    if (oldDate > nowDate) {
      return false;
    }
    return true;
  },
  // 公共fetch配置
  fetch: function ({ method = "GET", url, data = {} }) {
    // 本地存储获取token
    const token = wx.getStorageSync("token");
    // token 日期
    const oldDate = wx.getStorageSync("oldDate");
    // token 是否过期
    if (token && this.verifyToken(oldDate)) {
      wx.showToast({
        title: '登陆信息已过期，将自动重新登陆',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      wx.setStorageSync('token', '');
      wx.setStorageSync('oldDate', '');
      wx.reLaunch({
        url: '/pages/login/login'
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    let header = {};
    // header设置token
    if (method == 'post') {
      header = {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }
    if (token) {
      header["Authorization"] = token;
    }
    // promise 封装 wx.request
    return new Promise((resolve, reject) => {
      wx.request({
        method: method,
        url: this.globalData.api + url,
        data: data,
        header: header,
        success: function (response) {
          wx.hideLoading()
          // 接口返回 errcode 统一处理
          if (response.data.errcode == 0) {
            resolve(response.data.data)
          } else if (response.data.errcode == 10003) {
            wx.showToast({
              title: '登陆信息已过期，将自动重新登陆',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            wx.setStorageSync('token', '');
            wx.setStorageSync('oldDate', '');
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/login/login'
              })
            },1000)
          } else {
            wx.showToast({
              title: response.data.errmsg,
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        },
        fail: function (response) {
          wx.hideLoading()
          reject(response)
        }
      })
    })
  }
})
