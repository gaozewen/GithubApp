# 创建 model Timespan.js

# API

- show  // 打开天狂
- dismiss // 关闭团狂

# props

- menus // 弹框内容
- onSelect // item 被选中的回调
- theme // 支持自定义主题

# 注意 trendingTab 页的传参
~~~javascript
  componentWillReceiveProps = (nextProps) => { // 将要收到的新的 timespan
    if (nextProps.timespan !== this.props.timespan) {
      this.loadData(DATA_TYPE.INIT, nextProps.timespan)
    }
  }
~~~

