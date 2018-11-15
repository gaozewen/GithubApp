import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View,
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
  }

  componentDidMount = () => {
    this.loadData(DATA_TYPE.INIT, this.props.timespan)
  }

  componentWillReceiveProps = (nextProps) => { // 将要收到的新的 timespan
    if (nextProps.timespan !== this.props.timespan) {
      this.loadData(DATA_TYPE.INIT, nextProps.timespan)
    }
  }


  /**
   * 获取 Trending 数据的 url
   *
   * @param {*} timespan
   * @param {*} languageType
   * @memberof TrendingTab
   */
  getFetchUrl(timespan, languageType) {
    return `${API_URL + languageType}?since=${timespan.searchText}${QUERY_STR}`
  }

  getCollectionKeys = async () => {
    const keys = await collectionDao.getCollectionKeys().catch(() => { })
    if (keys && keys.length > 0) {
      this.setState({ collectionKeys: keys })
    } else {
      this.setState({ collectionKeys: [] })
    }
  }

  loadData = async (dataType, timespan) => { // 根据 url 获取查询条件相关的 github 仓库数据
    if (this.state.isLoading) return
    this.setState({ isLoading: true }) // lock

    await this.getCollectionKeys() // 初始化 收藏 keys

    const { dataSource } = this.state
    const { tabLabel } = this.props // 上面组件传过来的 timespan
    const { fetchRepository, fetchNetRepository } = gitHubRepoDao

    const reqUrl = this.getFetchUrl(timespan, tabLabel)
    let items = []
    if (dataType === DATA_TYPE.INIT) { // 初始化
      items = await fetchRepository(reqUrl).catch(err => console.log(err))
    } else { // 刷新数据
      items = await fetchNetRepository(reqUrl).catch(err => console.log(err))
    }

    if (items && items.length > 0) {
      const repoCellArray = [] // 将数据转化为 model
      items.forEach(item => repoCellArray.push(
        new RepoCell(item, CheckUtils.checkIsCollected(item, this.state.collectionKeys)),
      ))
      this.setState({
        isLoading: false, // 获取最新数据 unLock
        dataSource: dataSource.cloneWithRows(repoCellArray),
      })
      return
    }
    this.setState({ isLoading: false })
  }

  onSelect = (item) => {
    const { navigation } = this.props
    navigation.navigate('RepositoryDetail', { item })
  }

  onCollect = (item, isCollected) => { // 点击小星星 callback
    if (isCollected) { // 收藏，保存到数据库
      collectionDao.collect(item.fullName.toString(), JSON.stringify(item))
      return
    }
    // 取消收藏，删除数据库中数据
    collectionDao.unCollect(item.fullName.toString())
  }

  renderRow = (repoCell) => {
    return (
      <TrendingRepoCell
        repoCell={repoCell}
        onSelect={(item) => { this.onSelect(item) }}
        onCollect={(item, isCollected) => { this.onCollect(item, isCollected) }}
      />
    )
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
