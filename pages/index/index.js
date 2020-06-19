//index.js
//获取应用实例
const app = getApp()

Page({
  data:
  {
    msg: 'mini program',
    userInfo: '',
    isShow: true
  },

  handClick(){
    //点击跳转到指定页面
    //保留当前页面，跳转到应用内的某个页面。
    // wx.navigateTo({
    //   url:'/pages/list/list'
    // })

    //当定义了tabBar之后，需要由wx.switchTab接管，原来的wx.navigateTo不可用
    wx.switchTab({
      url: '/pages/list/list',
    })
  },

  //简写为getUserInfo(){}
  getUserInfo: function () {
    //判断用户是否授权
    wx.getSetting({
      success: (data)=> {
        console.log(data)
        console.log('成功')
        if (data.authSetting['scope.userInfo']) {
          //用户已经授权
          this.setData({
            isShow: false
          })
        } else {
          //没有授权
          this.setData({
            isShow: true
          })
        }
      },
    })



    //获取用户登录的信息
    wx.getUserInfo({
      success: (data) => {
        console.log(data)

        //更新data中userInfo
        this.setData({
          userInfo: data.userInfo
        });
      },
      fail: () => {
        console.log('获取用户数据失败')
      },
    })

  },


  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log("页面加载")
    console.log(this)
    this.getUserInfo()
  },

  
  handleGetUserInfo(data) {
    console.log('用户点击了', data)
    //判断用户点击的是否是允许
    if (data.detail.rawData) {
      //用户点击的是允许
      this.getUserInfo();
    }
  },
})

