- PopularRepoCell.js
- PopularTab.js
- TrendingRepoCell.js
- TrendingTab.js
- RepositoryDetail.js

1. 在 PopularRepoCell 中 将 更新 Cell 状态的 方法 setCollectionState(isCollected) 
2. 通过 上层组件 PopularTab 传递进来的 onSelect 方法 传递出去
3. 在 PopularTab 的 onSelect 方法中 将 setCollectionState 通过 路由 传递 到 RepositoryDetail 页面
4. 在 详情页 更新 收藏状态后 调用 setCollectionState 方法 同步更新 cell 中的 star 状态
