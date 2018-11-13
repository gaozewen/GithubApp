# RepositoryCell.js

- 当 仓库 卡片被点击的时候，希望把这个事件告诉 Popular 页面
- 这时候通过 props 来调用来调用 Popular 组件传下来的方法

# PopularTab.js 中

- 编写 onSelect 方法

# 注意 z-index 
~~~javascript
<WebView
  style={{ zIndex: -1 }}
  startInLoadingState
  ref={(webView) => { this.webView = webView }}
  source={{ uri: url }}
  onNavigationStateChange={e => this.onNavigationStateChange(e)}
/>
~~~
