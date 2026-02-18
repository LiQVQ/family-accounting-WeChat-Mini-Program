// pages/add/add.js
Page({
  data: {
    amount: '',
    type: 'income',
    date: '',
    note: '',
    today: ''
  },
  
  onLoad: function() {
    // 设置默认日期为今天
    const today = this.formatDate(new Date());
    this.setData({
      date: today,
      today: today
    });
  },
  
  onTypeChange: function(e) {
    this.setData({ type: e.currentTarget.dataset.type });
  },
  
  onAmountInput: function(e) {
    this.setData({ amount: e.detail.value });
  },
  
  onNoteInput: function(e) {
    this.setData({ note: e.detail.value });
  },
  
  onDateChange: function(e) {
    this.setData({ date: e.detail.value });
  },
  
  onSubmit: function() {
    const { amount, type, date, note } = this.data;
    
    // 验证输入
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      wx.showToast({
        title: '请输入有效的金额',
        icon: 'none'
      });
      return;
    }
    
    if (!date) {
      wx.showToast({
        title: '请选择日期',
        icon: 'none'
      });
      return;
    }
    
    // 添加记录到全局数据
    const app = getApp();
    app.addRecord({
      amount: amount,
      type: type,
      date: date,
      note: note
    });
    
    // 返回上一页
    wx.navigateBack({
      delta: 1
    });
  },
  
  formatDate: function(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
});