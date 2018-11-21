import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View,
  ListView, RefreshControl,
  DeviceEventEmitter,
} from 'react-native'
// dao
import CollectionDao, { USE_IN } from '../../expand/dao/CollectionDao'
// components
import PopularRepoCell from '../popular/PopularRepoCell'
import TrendingRepoCell from '../trending/TrendingRepoCell'
// model
import RepoCell from '../../expand/model/RepoCell'
// contants
import EmitActions from '../../constants/EmitActions'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

export default class FavoriteTab extends Component {
  static propTypes = {
    theme: PropTypes.object,
    navigation: PropTypes.object,
    useIn: PropTypes.string,
  }

  constructor(props) {
    super(props)
    const { useIn } = this.props
    const isPopular = useIn === USE_IN.POPULAR
    this.collectionDao = new CollectionDao(isPopular ? USE_IN.POPULAR : USE_IN.TRENDING)
    this.FavoriteRepoCell = isPopular ? PopularRepoCell : TrendingRepoCell
    this.state = { // 重复数据不渲染
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
      isLoading: false, // 是否正在加载数据
    }
    this.items = []
    this.isNeedSync = false
    this.emitAction = isPopular ? EmitActions.SYNC_POPULAR_PAGE : EmitActions.SYNC_TRENDING_PAGE
  }

  componentDidMount = () => {
    this.loadData()
  }

  componentWillUnmount = () => {
  }

  componentWillReceiveProps = () => {
    this.syncingData()
  }

  // 抛出事件 让其他组件更新数据
  emitToSyncData = () => {
    DeviceEventEmitter.emit(this.emitAction)
  }

  syncingData = async () => { // 同步数据
    this.items = await this.collectionDao.getCollectionItems().catch(err => console.log(err))
    const { dataSource } = this.state
    const repoCellArray = [] // 将数据转化为 model
    this.items.forEach(item => repoCellArray.push(
      new RepoCell(item, true),
    ))
    this.setState({
      dataSource: dataSource.cloneWithRows(repoCellArray),
    })
  }

  loadData = async () => { // 根据 url 获取查询条件相关的 github 仓库数据
    if (this.state.isLoading) return
    this.setState({ isLoading: true }) // lock
    await this.syncingData() // 同步数据
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
  onSelect = (item, isCollected) => {
    const { navigation } = this.props
    const { theme } = this.props
    const syncFavoritePage = () => {
      this.syncingData()
      this.emitToSyncData()
    }
    navigation.navigate('RepositoryDetail', {
      theme, item, isCollected, syncFavoritePage,
    })
  }

  renderRow = (repoCell, FavoriteRepoCell) => {
    return (
      <FavoriteRepoCell
        theme={this.props.theme}
        repoCell={repoCell}
        onSelect={(item, isCollected) => {
          this.onSelect(item, isCollected)
        }}
        onCollect={(item) => { this.onCollect(item) }}
      />
    )
  }

  onCollect = (item) => { // 点击小星星 callback , 值做 取消收藏逻辑
    const key = item.id ? item.id : item.fullName
    this.collectionDao.unCollect(key.toString()) // 取消收藏，删除数据库中数据
    this.syncingData()
    this.emitToSyncData()
  }

  render() {
    const { theme } = this.props
    const { dataSource, isLoading } = this.state
    return (
      <View style={styles.root}>
        <ListView
          enableEmptySections // 允许数据为空
          dataSource={dataSource}
          renderRow={repoCell => this.renderRow(repoCell, this.FavoriteRepoCell)}
          onEndReachedThreshold={20}
          refreshControl={(
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => this.loadData()}
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
