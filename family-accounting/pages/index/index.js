// pages/index/index.js
Page({
  data: {
    records: [],
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    statsShake: false,
    pageAnimation: true,
    // 筛选相关
    startDate: '2023-01-01',
    endDate: '',
    filterType: 'all',
    searchKeyword: '',
    filteredRecords: [],
    // 用于日期选择
    today: ''
  },
  
  onLoad: function() {
    // 初始化 endDate 和 today
    const today = this.formatDate(new Date());
    this.setData({
      endDate: today,
      today: today
    });
    
    this.loadRecords();
  },
  
  onShow: function() {
    // 页面显示时触发过渡动画
    this.setData({ pageAnimation: true });
    setTimeout(() => {
      this.setData({ pageAnimation: false });
    }, 300);
    
    this.loadRecords();
  },
  
  loadRecords: function() {
    const app = getApp();
    const records = app.globalData.records;
    this.setData({ records: records });
    
    // 计算统计数据
    this.calculateStats(records);
    
    // 应用筛选
    this.applyFilters();
  },
  
  calculateStats: function(records) {
    let totalIncome = 0;
    let totalExpense = 0;
    
    records.forEach(record => {
      if (record.type === 'income') {
        totalIncome += parseFloat(record.amount);
      } else {
        totalExpense += parseFloat(record.amount);
      }
    });
    
    // 触发统计数字的抖动效果
    this.setData({
      statsShake: true
    }, () => {
      this.setData({
        totalIncome: totalIncome.toFixed(2),
        totalExpense: totalExpense.toFixed(2),
        balance: (totalIncome - totalExpense).toFixed(2)
      }, () => {
        // 重置抖动效果
        setTimeout(() => {
          this.setData({ statsShake: false });
        }, 500);
      });
    });
  },
  
  onAddRecord: function() {
    wx.navigateTo({
      url: '../add/add',
      success: () => {
        this.setData({ pageAnimation: true });
      }
    });
  },
  
  onDeleteRecord: function(e) {
    const id = e.currentTarget.dataset.id;
    const app = getApp();
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记账记录吗？',
      success: function(res) {
        if (res.confirm) {
          app.deleteRecord(id);
          
          // 添加删除动画效果
          const records = this.data.records.map(record => {
            if (record.id === id) {
              return { ...record, isDeleting: true };
            }
            return record;
          });
          
          this.setData({ 
            records: records,
            pageAnimation: false // 禁止页面过渡
          });
          
          // 等待动画结束后移除记录
          setTimeout(() => {
            const newRecords = records.filter(record => record.id !== id);
            this.setData({ 
              records: newRecords,
              pageAnimation: true // 重新启用页面过渡
            });
            this.loadRecords();
          }, 300);
        }
      }.bind(this)
    });
  },
  
  // 筛选相关方法
  onStartDateChange: function(e) {
    const newStartDate = e.detail.value;
    this.setData({ startDate: newStartDate });
    
    // 验证开始时间不能大于结束时间
    if (newStartDate > this.data.endDate) {
      this.setData({ endDate: newStartDate });
    }
    
    this.applyFilters();
  },
  
  onEndDateChange: function(e) {
    const newEndDate = e.detail.value;
    this.setData({ endDate: newEndDate });
    
    // 验证结束时间不能小于开始时间
    if (newEndDate < this.data.startDate) {
      wx.showToast({
        title: '结束时间不能早于开始时间',
        icon: 'none',
        duration: 1500
      });
      this.setData({ endDate: this.data.startDate });
    }
    
    this.applyFilters();
  },
  
  onFilterType: function(e) {
    this.setData({ filterType: e.currentTarget.dataset.type });
    this.applyFilters();
  },
  
  onSearchInput: function(e) {
    this.setData({ searchKeyword: e.detail.value });
    this.applyFilters();
  },
  
  // 新增：清除所有筛选条件
  onClearFilters: function() {
    // 重置所有筛选条件
    const today = this.formatDate(new Date());
    this.setData({
      startDate: '2023-01-01',
      endDate: today,
      filterType: 'all',
      searchKeyword: '',
      filteredRecords: this.data.records
    });
    
    // 显示提示
    wx.showToast({
      title: '筛选已清除',
      icon: 'success',
      duration: 1000
    });
  },
  
  applyFilters: function() {
    const { records, startDate, endDate, filterType, searchKeyword } = this.data;
    
    // 格式化日期
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // 过滤记录
    let filtered = records.filter(record => {
      // 时间范围过滤
      const recordDate = new Date(record.date);
      if (recordDate < start || recordDate > end) {
        return false;
      }
      
      // 类型过滤
      if (filterType !== 'all' && record.type !== filterType) {
        return false;
      }
      
      // 备注搜索
      if (searchKeyword && !record.note.toLowerCase().includes(searchKeyword.toLowerCase())) {
        return false;
      }
      
      return true;
    });
    
    this.setData({ filteredRecords: filtered });
  },
  
  // 格式化日期
  formatDate: function(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
});