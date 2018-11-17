import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, DeviceEventEmitter,
  ListView, RefreshControl,
} from 'react-native'

// components
import TrendingRepoCell from './TrendingRepoCell'
// dao
import GitHubRepoDao, { USE_IN } from '../../expand/dao/GitHubRepoDao'
import CollectionDao from '../../expand/dao/CollectionDao'
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

const API_URL = 'https://github.com/trending/'
const QUERY_STR = '&per_page=20'
const DATA_TYPE = {
  INIT: 'init data',
  REFRESHING: 'pull down refreshing',
  MORE: 'fetch more',
}
const gitHubRepoDao = new GitHubRepoDao(USE_IN.TRENDING)
const collectionDao = new CollectionDao(USE_IN.TRENDING)
export default class TrendingTab extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    timespan: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      // 重复数据不渲染
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
      isLoading: false, // 是否正在加载数据
      collectionKeys: [], // 所有用户收藏项目的 keys
    }
    this.items = []
    this.isNeedSync = false
  }

  componentDidMount = () => {
    this.loadData(DATA_TYPE.INIT, this.props.timespan)
    this.listener = DeviceEventEmitter.addListener(EmitActions.SYNC_TRENDING_PAGE, () => {
      this.isNeedSync = true
    })
  }

  componentWillUnmount = () => {
    if (this.listener) {
      this.listener.remove()
    }
  }

  componentWillReceiveProps = (nextProps) => { // 将要收到的新的 timespan
    if (nextProps.timespan !== this.props.timespan) {
      this.loadData(DATA_TYPE.INIT, nextProps.timespan)
    } else if (this.isNeedSync) {
      this.isNeedSync = false
      this.syncingData()
    }
  }

  // 同步数据
  syncingData = async () => {
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


  getFetchUrl = (timespan, languageType) => { // 获取 Trending 数据的 url
    return `${API_URL + languageType}?since=${timespan.searchText}${QUERY_STR}`
  }

  loadData = async (dataType, timespan, isSyncing) => { // 根据 url 获取查询条件相关的 github 仓库数据
    if (this.state.isLoading) return
    this.setState({ isLoading: true }) // lock
    const { tabLabel } = this.props // 上面组件传过来的 timespan
    const { fetchRepository, fetchNetRepository } = gitHubRepoDao
    if (!isSyncing) { // 同步 状态不需要重新获取
      const reqUrl = this.getFetchUrl(timespan, tabLabel)
      if (dataType === DATA_TYPE.INIT) { // 初始化
        const result = await fetchRepository(reqUrl).catch(err => console.log(err))
        this.items = result.items || result
      } else { // 刷新数据
        const result = await fetchNetRepository(reqUrl).catch(err => console.log(err))
        this.items = result.items || result
      }
    }
    await this.syncingData() // 比对 key 同步数据
    this.setState({
      isLoading: false, // 获取最新数据 unLock
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
    navigation.navigate('RepositoryDetail', { item, isCollected, syncCellStarState })
  }

  renderRow = (repoCell) => {
    return (
      <TrendingRepoCell
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
      collectionDao.collect(item.fullName.toString(), JSON.stringify(item))
    } else { // 取消收藏，删除数据库中数据
      collectionDao.unCollect(item.fullName.toString())
    }
  }

  render() {
    const { dataSource, isLoading } = this.state
    return (
      <View style={styles.root}>
        <ListView
          dataSource={dataSource}
          renderRow={repoCell => this.renderRow(repoCell)}
          refreshControl={(
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => this.loadData(DATA_TYPE.REFRESHING, this.props.timespan)}
              colors={['#2196F3']}
              title="Loading..."
              titleColor="#2196F3"
              tintColor="#2196F3"
            />
          )}
        />
      </View>
    )
  }
}
