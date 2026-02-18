// pages/settings/settings.js
Page({
  data: {
    // 设置项
    settings: [
      { id: 'theme', name: '主题颜色', value: 'default', options: [
        { value: 'default', name: '默认' },
        { value: 'dark', name: '深色模式' }
      ]},
      { id: 'notification', name: '通知提醒', value: 'on', options: [
        { value: 'on', name: '开启' },
        { value: 'off', name: '关闭' }
      ]}
    ]
  },
  
  // 设置选项变化
  onSettingChange: function(e) {
    const { id, value } = e.currentTarget.dataset;
    const settings = this.data.settings.map(setting => {
      if (setting.id === id) {
        return { ...setting, value };
      }
      return setting;
    });
    
    this.setData({ settings });
  }
});