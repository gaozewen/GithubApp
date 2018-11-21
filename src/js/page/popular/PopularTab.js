import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View,
  ListView, RefreshControl,
  DeviceEventEmitter,
} from 'react-native'
// dao
import GitHubRepoDao, { USE_IN } from '../../expand/dao/GitHubRepoDao'
import CollectionDao from '../../expand/dao/CollectionDao'
// components
import PopularRepoCell from './PopularRepoCell'
// model
import RepoCell from '../../expand/model/RepoCell'
// utils
import CheckUtils from '../../utils/CheckUtils'
// constants
import EmitActions from '../../constants/EmitActions'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

// https://api.github.com/search/repositories?q=ios&sort=stars
const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars&page=1&per_page='
const DATA_TYPE = {
  INIT: 'init data',
  REFRESHING: 'pull down refreshing',
  MORE: 'fetch more',
}
// 为什么设置为全局，是因为 在所有的 页签下都能使用，无需为 每个页签重复创建
const gitHubRepoDao = new GitHubRepoDao(USE_IN.POPULAR)
const collectionDao = new CollectionDao(USE_IN.POPULAR)
export default class PopularTab extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    theme: PropTypes.object,
  }

  constructor(props) {
    super(props)
    const { theme } = this.props
    this.state = {
      theme,
      // 重复数据不渲染
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
      isLoading: false, // 是否正在加载数据
      currentPage: 1, // 当前页
      collectionKeys: [], // 所有用户收藏项目的 keys
    }
    this.items = []
    this.isNeedSync = false // 是否需要同步数据
  }

  componentDidMount = () => {
    this.loadData(DATA_TYPE.INIT)
    this.listener = DeviceEventEmitter.addListener(EmitActions.SYNC_POPULAR_PAGE, () => {
      this.isNeedSync = true
    })
  }

  componentWillUnmount = () => {
    if (this.listener) {
      this.listener.remove()
    }
  }


  componentWillReceiveProps = (nextProps) => {
    if (this.isNeedSync) {
      this.isNeedSync = false
      this.syncingData()
    } else if (nextProps.theme !== this.state.theme) {
      this.setState({ theme: nextProps.theme })
      this.syncingData()
    }
  }

  syncingData = async () => { // 同步 数据
    await this.getCollectionKeys() // 初始化 收藏 keys
    const { dataSource } = this.state
    const repoCellArray = [] // 将数据转化为 model
    this.items.forEach(item => repoCellArray.push(
      new RepoCell(item, CheckUtils.checkIsCollected(item, this.state.collectionKeys)),
    ))
    this.setState({
      dataSource: dataSource.cloneWithRows(repoCellArray),
    })
  }

  getCollectionKeys = async () => {
    const keys = await collectionDao.getCollectionKeys().catch(() => { })
    if (keys && keys.length > 0) {
      this.setState({ collectionKeys: keys })
    } else {
      this.setState({ collectionKeys: [] })
    }
  }

  loadData = async (dataType) => { // 根据 url 获取查询条件相关的 github 仓库数据
    if (this.state.isLoading) return
    this.setState({ isLoading: true }) // lock

    const { currentPage } = this.state
    const { tabLabel } = this.props
    const { fetchRepository, fetchNetRepository } = gitHubRepoDao

    let reqUrl = URL + tabLabel + QUERY_STR + currentPage * 20
    if (dataType === DATA_TYPE.INIT) { // 初始化
      const result = await fetchRepository(reqUrl).catch(err => console.log(err))
      this.items = result.items || result // result 是 网络直接获取的 不是 本地数据
    } else if (dataType === DATA_TYPE.REFRESHING) { // 刷新数据
      this.setState({ currentPage: 1 })
      reqUrl = URL + tabLabel + QUERY_STR + 20
      const result = await fetchNetRepository(reqUrl).catch(err => console.log(err))
      this.items = result.items || result
    } else if (dataType === DATA_TYPE.MORE) { // 加载更多
      const result = await fetchNetRepository(reqUrl).catch(err => console.log(err))
      this.items = result.items || result
    }

    await this.syncingData() // 比对 keys 同步 收藏状态

    this.setState({
      isLoading: false, // 获取最新数据 unLock
      currentPage: (currentPage < 100 ? currentPage + 1 : 1),
    })
  }

  /**
   * 选中 RepoCell 进入详情页面
   *
   * @param {*} item RepoCell 信息
   * @param {Boolean} isCollected RepoCell 中的 收藏状态
   * @param {Function} syncCellStarState (传入 detail 页 收藏状态)用来更新 RepoCell 收藏状态的方法
   * @memberof TrendingTab
   */
  onSelect = (item, isCollected, syncCellStarState) => {
    const { navigation } = this.props
    const { theme } = this.state
    navigation.navigate('RepositoryDetail', {
      theme, item, isCollected, syncCellStarState,
    })
  }

  renderRow = (repoCell) => {
    return (
      <PopularRepoCell
        theme={this.state.theme}
        repoCell={repoCell}
        onSelect={(item, isCollected, syncCellStarState) => {
          this.onSelect(item, isCollected, syncCellStarState)
        }}
        onCollect={(item, isCollected) => { this.onCollect(item, isCollected) }}
      />
    )
  }

  onCollect = (item, isCollected) => { // 点击小星星 callback
    if (isCollected) { // 收藏，保存到数据库
      collectionDao.collect(item.id.toString(), JSON.stringify(item))
    } else { // 取消收藏，删除数据库中数据
      collectionDao.unCollect(item.id.toString())
    }
  }


  render() {
    const { theme, dataSource, isLoading } = this.state
    return (
      <View style={styles.root}>
        <ListView
          dataSource={dataSource}
          renderRow={repoCell => this.renderRow(repoCell)}
          onEndReached={() => this.loadData(DATA_TYPE.MORE)}
          onEndReachedThreshold={20}
          refreshControl={(
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => this.loadData(DATA_TYPE.REFRESHING)}
              colors={[theme.themeColor]}
              title="Loading..."
              titleColor={theme.themeColor}
              tintColor={theme.themeColor}
            />
          )}
        />
      </View>
    )
  }
}
