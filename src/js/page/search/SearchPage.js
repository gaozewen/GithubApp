import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  Dimensions, ListView, RefreshControl,
} from 'react-native'
// commons
import HeaderBar from '../../common/HeaderBar'
// utils
import ViewUtils from '../../utils/ViewUtils'
import ToastUtils from '../../utils/ToastUtils'
import CheckUtils from '../../utils/CheckUtils'
// dao
import CollectionDao, { USE_IN } from '../../expand/dao/CollectionDao'
// model
import RepoCell from '../../expand/model/RepoCell'
// components
import PopularRepoCell from '../popular/PopularRepoCell'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

const API_URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars&page=1&per_page='
const collectionDao = new CollectionDao(USE_IN.POPULAR)
export default class SearchPage extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      rightButtonText: '搜索',
      isLoading: false,
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
    }
    this.currentPage = 1 // 当前页
    this.collectionKeys = [] // 所有用户收藏项目的 keys
    this.items = []
    this.isNeedSync = false // 是否需要同步数据
  }

  componentDidMount = () => {

  }

  loadData = async (isRefresh) => {
    if (this.state.isLoading) return
    try {
      this.setState({ isLoading: true })
      if (isRefresh) { // 刷新数据
        this.currentPage = 1
      }
      const reqUrl = this.genFetchUrl(this.text)
      if (reqUrl === null) {
        this.setState({ isLoading: false })
        return
      }
      const resp = await fetch(reqUrl)
      // total_count: 784810, incomplete_results: false, items:...
      const result = JSON.parse(resp._bodyText)
      // !this 页面已销毁
      if (!this || !result || !result.items || result.items.length === 0) {
        ToastUtils.showShort('主人，什么都没有找到哟，请换一种姿势呢')
        this.setState({ isLoading: false, rightButtonText: '搜索' })
        return
      }
      this.items = result.items
      await this.syncingData() // 比对 keys 同步 收藏状态
      this.currentPage += 1 // 加载更多 时使用
      this.setState({ isLoading: false, rightButtonText: '搜索' })
    } catch (error) {
      this.setState({ isLoading: false, rightButtonText: '搜索' })
    }
  }

  genFetchUrl = (key) => {
    if (!key || key.trim().length === 0) {
      ToastUtils.showShort('搜索内容不能为空')
      return null
    }
    return API_URL + key + QUERY_STR + this.currentPage * 20
  }

  getCollectionKeys = async () => {
    const keys = await collectionDao.getCollectionKeys().catch(() => { })
    if (keys && keys.length > 0) {
      this.collectionKeys = keys
    } else {
      this.collectionKeys = []
    }
  }

  syncingData = async () => { // 同步 数据
    await this.getCollectionKeys() // 初始化 收藏 keys
    const { dataSource } = this.state
    const repoCellArray = [] // 将数据转化为 model
    this.items.forEach(item => repoCellArray.push(
      new RepoCell(item, CheckUtils.checkIsCollected(item, this.collectionKeys)),
    ))
    this.setState({
      dataSource: dataSource.cloneWithRows(repoCellArray),
    })
  }


  getTitleView = () => {
    return (
      <TextInput
        style={{
          width: (Dimensions.get('window').width - 100),
          height: 30,
          alignSelf: 'center',
          paddingTop: 2,
          paddingRight: 20,
          paddingBottom: 2,
          paddingLeft: 20,
          borderRadius: 50,
          fontSize: 16,
          backgroundColor: '#fff',
        }}
        ref={(input) => { this.input = input }}
        placeholder="请输入标签"
        placeholderTextColor="#9E9E9E"
        clearTextOnFocus
        selectionColor="#2196F3"
        underlineColorAndroid="transparent"
        returnKeyType="search"
        onChangeText={(text) => { this.text = text }}
        onSubmitEditing={() => { this.loadData(true) }}
      />
    )
  }

  onBackPress = () => {
    this.input.blur() // 隐藏键盘
    const { navigation } = this.props
    navigation.pop()
  }

  onRightButtonClick = () => {
    const { rightButtonText } = this.state
    this.input.blur() // 隐藏键盘
    if (rightButtonText === '搜索') {
      this.setState({ rightButtonText: '取消' })
      this.loadData(true)
    } else {
      this.setState({ rightButtonText: '搜索', isLoading: false })
    }
  }

  getRightButton = () => {
    return (
      <TouchableOpacity
        style={{ marginRight: 5, alignItems: 'center', justifyContent: 'center' }}
        onPress={() => { this.onRightButtonClick() }}
      >
        <Text style={{ color: '#fff', fontSize: 18 }}>{this.state.rightButtonText}</Text>
      </TouchableOpacity>
    )
  }

  onSelect = (item, isCollected, syncCellStarState) => {
    const { navigation } = this.props
    navigation.navigate('RepositoryDetail', { item, isCollected, syncCellStarState })
  }

  renderRow = (repoCell) => {
    return (
      <PopularRepoCell
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
    const { dataSource, isLoading } = this.state
    return (
      <View style={styles.root}>
        <HeaderBar
          titleView={this.getTitleView()}
          leftButton={ViewUtils.getBackButton(() => { this.onBackPress() })}
          rightButton={this.getRightButton()}
        />
        {
          this.text ? (
            <ListView
              dataSource={dataSource}
              renderRow={repoCell => this.renderRow(repoCell)}
              onEndReached={() => this.loadData()}
              onEndReachedThreshold={20}
              refreshControl={(
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={() => this.loadData(true)}
                  colors={['#2196F3']}
                  title="Loading..."
                  titleColor="#2196F3"
                  tintColor="#2196F3"
                />
              )}
            />
          ) : null
        }

      </View>
    )
  }
}
