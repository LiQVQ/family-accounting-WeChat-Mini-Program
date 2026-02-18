// app.js
App({
  onLaunch: function() {
    // 尝试从本地存储加载数据
    const savedData = wx.getStorageSync('appData');
    if (savedData) {
      this.globalData = savedData;
    } else {
      // 初始化默认数据
      this.globalData = {
        records: [
          {
            id: '1',
            amount: '150.00',
            type: 'income',
            date: '2023-08-15',
            note: '工资收入'
          },
          {
            id: '2',
            amount: '45.50',
            type: 'expense',
            date: '2023-08-16',
            note: '午餐'
          },
          {
            id: '3',
            amount: '200.00',
            type: 'income',
            date: '2023-08-17',
            note: '兼职收入'
          },
          {
            id: '4',
            amount: '120.00',
            type: 'expense',
            date: '2023-08-18',
            note: '购物'
          }
        ],
        categories: [
          { id: 'income', name: '收入' },
          { id: 'expense', name: '支出' }
        ]
      };
      // 保存初始数据到本地
      wx.setStorageSync('appData', this.globalData);
    }
  },
  
  // 添加记账记录
  addRecord: function(record) {
    const newRecord = {
      id: Date.now().toString(),
      ...record
    };
    
    this.globalData.records.unshift(newRecord);
    // 保存到本地存储
    wx.setStorageSync('appData', this.globalData);
  },
  
  // 删除记账记录
  deleteRecord: function(id) {
    this.globalData.records = this.globalData.records.filter(record => record.id !== id);
    // 保存到本地存储
    wx.setStorageSync('appData', this.globalData);
  }
});