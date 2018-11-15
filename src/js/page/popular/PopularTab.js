import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View,
  ListView, RefreshControl,
  // DeviceEventEmitter,
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
  }

  constructor(props) {
    super(props)
    this.state = {
      // 重复数据不渲染
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
      isLoading: false, // 是否正在加载数据
      currentPage: 1, // 当前页
      collectionKeys: [], // 所有用户收藏项目的 keys
    }
  }

  componentDidMount = () => {
    this.loadData(DATA_TYPE.INIT)
    // this.listener = DeviceEventEmitter.addListener('collection_update', () => {
    //   this.loadData(DATA_TYPE.INIT)
    // })
  }

  componentWillUnmount = () => {
    // if (this.listener) {
    //   this.listener.remove()
    // }
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

    await this.getCollectionKeys() // 初始化 收藏 keys

    const { dataSource, currentPage } = this.state
    const { tabLabel } = this.props
    const { fetchRepository, fetchNetRepository } = gitHubRepoDao

    let reqUrl = URL + tabLabel + QUERY_STR + currentPage * 20
    let items = []
    if (dataType === DATA_TYPE.INIT) { // 初始化
      items = await fetchRepository(reqUrl).catch(err => console.log(err))
    } else if (dataType === DATA_TYPE.REFRESHING) { // 刷新数据
      this.setState({ currentPage: 1 })
      reqUrl = URL + tabLabel + QUERY_STR + 20
      items = await fetchNetRepository(reqUrl).catch(err => console.log(err))
    } else if (dataType === DATA_TYPE.MORE) { // 加载更多
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
        currentPage: (currentPage < 100 ? currentPage + 1 : 1),
      })
      return
    }
    this.setState({ isLoading: false })
  }

  onSelect = (item) => { // 点击小卡片 callback
    const { navigation } = this.props
    navigation.navigate('RepositoryDetail', { item })
  }

  onCollect = (item, isCollected) => { // 点击小星星 callback
    // const callback = () => DeviceEventEmitter.emit('collection_update')
    if (isCollected) { // 收藏，保存到数据库
      collectionDao.collect(item.id.toString(), JSON.stringify(item))
      return
    }
    // 取消收藏，删除数据库中数据
    collectionDao.unCollect(item.id.toString())
  }

  renderRow = (repoCell) => {
    return (
      <PopularRepoCell
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
          onEndReached={() => this.loadData(DATA_TYPE.MORE)}
          onEndReachedThreshold={20}
          refreshControl={(
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => this.loadData(DATA_TYPE.REFRESHING)}
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
