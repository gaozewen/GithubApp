因为 https://api.github.com/repos/crazycodeboy/GitHubPopular
这种 接口返回的是一个对象，不是一个 items 集合，所以需要处理

fetchNet 和 save 的时候的格式

fetchNet 的时候 获取的是 result  而不是 result.items
save 的时候 保存的是 item  而不是 items

根据 USE_IN 来判断是否是关于我的 页面


aboutPage
componentDidMount = () => {
    this.aboutCommon.componentDidMount()
  }

~~~JAVASCRIPT
saveRespositoryToLocal = (url, items, callback) => {
    if (!url || !items || (!url.includes('per_page=20') && !url.includes('crazycodeboy'))) return // 不是第一页就 返回
    let wrapData
    if (this.use_in === USE_IN.MY_GITHUB_PROJECT) {
      wrapData = { item: items, update_date: new Date().getTime() }
    } else {
      wrapData = { items, update_date: new Date().getTime() }
    }
    AsyncStorage.setItem(url, JSON.stringify(wrapData), callback) // 只保存第一页的数据
  }
~~~

~~~javascript
if (this.use_in === USE_IN.MY_GITHUB_PROJECT && result) { // my
  this.saveRespositoryToLocal(url, result)
  resolve(result)
} else if (result && result.items) { // popular
  this.saveRespositoryToLocal(url, result.items)
  resolve(result.items)
} else {
  reject(new Error('responseData is null'))
}
~~~
