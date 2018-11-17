# CheckUtils.js

checkIsExpired

# RepoUtils,

# AboutCommon
~~~javascript
constructor(props, updateState, aboutIn) {
  this.props = props
  this.updateState = updateState
  this.aboutIn = aboutIn
  this.collectionDao = new CollectionDao(USE_IN.POPULAR)
  this.repos = []
  this.collectionKeys = null // 为什么设置为 null 因为判断会方便一些
}

/**
 * 通知数据发生改变
 * @param {*} items 仓库 对象 数组
 */
onNotifyDataChanged(items) {
  this.updateFavorite(items)
}

/**
 * 更新 作者 开源项目的 用户收藏状态
 * @param {*} repos
 */
updateFavorite = async (repos) => {
  if (!repos) return // 数据为null 直接返回
  if (repos) this.repos = repos
  if (!this.collectionKeys) { // 为空 去数据库中查询数据加载
    this.collectionKeys = await this.collectionDao.getCollectionKeys()
  }
  const repoCellArray = [] // 将数据转化为 model
  this.repos.forEach(item => repoCellArray.push(
    new RepoCell(item, CheckUtils.checkIsCollected(item, this.collectionKeys)),
  ))
  this.updateState({ repoCellArray }) // AboutPage 这类 主页面传过来的方法
}

onSelect = (item, isCollected, syncCellStarState) => {
  const { navigation } = this.props
  navigation.navigate('RepositoryDetail', { item, isCollected, syncCellStarState })
}

renderAuthorOpenSourceProjects(repoCellArray) {
  if (!repoCellArray || repoCellArray.length === 0) return null // 不渲染任何东西
  return repoCellArray.map((repoCell) => {
    return (
      <PopularRepoCell
        key={repoCell.item.id}
        repoCell={repoCell}
        onSelect={(item, isCollected, syncCellStarState) => {
          this.onSelect(item, isCollected, syncCellStarState)
        }}
        onCollect={(item, isCollected) => { this.onCollect(item, isCollected) }}
      />
    )
  })
}

onCollect = (item, isCollected) => { // 点击小星星 callback
  if (isCollected) { // 收藏，保存到数据库
    this.collectionDao.collect(item.id.toString(), JSON.stringify(item))
  } else { // 取消收藏，删除数据库中数据
    this.collectionDao.unCollect(item.id.toString())
  }
}

~~~
