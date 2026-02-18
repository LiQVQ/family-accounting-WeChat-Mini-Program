// pages/stats/stats.js
Page({
  data: {
    records: [],
    incomeData: [],
    expenseData: [],
    categories: ['餐饮', '交通', '购物', '娱乐', '其他'],
    selectedCategory: 'all',
    chartOption: {}
  },
  
  onLoad: function() {
    this.loadRecords();
  },
  
  loadRecords: function() {
    const app = getApp();
    const records = app.globalData.records;
    this.setData({ records: records });
    
    // 处理数据用于图表
    this.processChartData(records);
    
    // 设置图表配置
    this.setChartOption();
  },
  
  processChartData: function(records) {
    // 按类别统计收入和支出
    const incomeCategories = {};
    const expenseCategories = {};
    
    // 初始化类别数据
    const categories = this.data.categories;
    
    categories.forEach(category => {
      incomeCategories[category] = 0;
      expenseCategories[category] = 0;
    });
    
    // 统计数据
    records.forEach(record => {
      const category = record.category || '其他';
      
      if (record.type === 'income') {
        incomeCategories[category] += parseFloat(record.amount);
      } else {
        expenseCategories[category] += parseFloat(record.amount);
      }
    });
    
    // 转换为图表需要的格式
    const incomeData = categories.map(category => ({
      name: category,
      value: incomeCategories[category]
    }));
    
    const expenseData = categories.map(category => ({
      name: category,
      value: expenseCategories[category]
    }));
    
    this.setData({
      incomeData: incomeData,
      expenseData: expenseData
    });
  },
  
  setChartOption: function() {
    const { incomeData, expenseData, categories } = this.data;
    
    this.setData({
      chartOption: {
        tooltip: {
          trigger: 'axis',
          formatter: '{b0}: {c0}<br/>{b1}: {c1}'
        },
        legend: {
          data: ['收入', '支出'],
          right: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: categories,
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value',
          name: '金额'
        },
        series: [
          {
            name: '收入',
            type: 'bar',
            barWidth: '60%',
            data: incomeData.map(item => item.value),
            itemStyle: {
              color: '#4CAF50'
            }
          },
          {
            name: '支出',
            type: 'bar',
            barWidth: '60%',
            data: expenseData.map(item => item.value),
            itemStyle: {
              color: '#F44336'
            }
          }
        ]
      }
    });
  }
});