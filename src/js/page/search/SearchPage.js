import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  Dimensions, ListView, RefreshControl, DeviceEventEmitter,
} from 'react-native'
// commons
import HeaderBar from '../../common/HeaderBar'
// utils
import ViewUtils from '../../utils/ViewUtils'
import ToastUtils from '../../utils/ToastUtils'
import CheckUtils from '../../utils/CheckUtils'
// dao
import CollectionDao, { USE_IN } from '../../expand/dao/CollectionDao'
import LanguageDao from '../../expand/dao/LanguageDao'
// model
import RepoCell from '../../expand/model/RepoCell'
// components
import PopularRepoCell from '../popular/PopularRepoCell'
// actions
import EmitActions from '../../constants/EmitActions'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  input: {
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
  },
  bottomButton: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
    height: 40,
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
    borderRadius: 3,
  },
})

const API_URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars&page=1&per_page='
const collectionDao = new CollectionDao(USE_IN.POPULAR)
const languageDao = new LanguageDao(USE_IN.POPULAR)
export default class SearchPage extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      theme: this.props.navigation.getParam('theme'),
      rightButtonText: '搜索',
      isLoading: false,
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      isShowBottomButton: false,
      currentKey: null,
    }

    this.keys = [] // 本地数据库中已存在的 所有自定义标签
    this.currentPage = 1 // 当前页
    this.collectionKeys = [] // 所有用户收藏项目的 keys
    this.items = []
    this.isKeysChanged = false // 是否添加了标签
    this.isCancel = false
  }

  componentDidMount = () => {
  }

  componentWillUnmount = () => {
    if (this.isKeysChanged) {
      DeviceEventEmitter.emit(
        EmitActions.SYNC_HOME_PAGE.EVENT,
        EmitActions.SYNC_HOME_PAGE.FROM_SEARCH_PAGE,
      )
    }
  }

  getAllKeys = async () => { // 获取所有标签
    this.keys = await languageDao.fetch()
  }

  checkKeyIsExist = (keys, key) => { // 检查 key 是否存在于 本地数据库中
    const k = key.toLowerCase()
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].name.toLowerCase() === k) {
        return true
      }
    }
    return false
  }

  loadData = async (isRefresh) => {
    if (this.state.isLoading) return
    try {
      this.setState({ isLoading: true, rightButtonText: '取消' })
      if (isRefresh) { // 刷新数据
        this.currentPage = 1
      }
      const reqUrl = this.genFetchUrl(this.text)
      if (reqUrl === null) {
        this.setState({ isLoading: false })
        return
      }
      const resp = await fetch(reqUrl)
      if (this.isCancel) {
        this.setState({ isLoading: false, rightButtonText: '搜索', isShowBottomButton: false })
        this.isCancel = false
        return
      }
      // total_count: 784810, incomplete_results: false, items:...
      const result = JSON.parse(resp._bodyText)
      // !this 页面已销毁
      if (!this || !result || !result.items || result.items.length === 0) {
        ToastUtils.showShort('主人，什么都没有找到哟，请换一种姿势呢')
        this.setState({ isLoading: false, rightButtonText: '搜索', isShowBottomButton: false })
        return
      }
      this.items = result.items
      await this.syncingData() // 比对 keys 同步 收藏状态
      this.currentPage += 1 // 加载更多 时使用

      // 判断是否显示 底部 添加标签按钮
      await this.getAllKeys()
      if (!this.checkKeyIsExist(this.keys, this.text)) { // 不存在
        this.setState({ currentKey: this.text, isShowBottomButton: true })
      } else { // 存在
        this.setState({ isShowBottomButton: false })
      }
      this.setState({ isLoading: false, rightButtonText: '搜索' })
    } catch (error) {
      this.setState({ isLoading: false, rightButtonText: '搜索', isShowBottomButton: false })
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

  // HeaderBar Start
  onBackPress = () => {
    this.input.blur() // 隐藏键盘
    const { navigation } = this.props
    navigation.pop()
  }

  getTitleView = () => {
    return (
      <TextInput
        style={styles.input}
        ref={(input) => { this.input = input }}
        placeholder="请输入标签"
        placeholderTextColor="#9E9E9E"
        clearTextOnFocus
        selectionColor={this.state.theme.themeColor}
        underlineColorAndroid="transparent"
        returnKeyType="search"
        onChangeText={(text) => { this.text = text }}
        onSubmitEditing={() => { this.loadData(true) }}
      />
    )
  }

  onRightButtonClick = () => {
    const { rightButtonText } = this.state
    this.input.blur() // 隐藏键盘
    if (rightButtonText === '搜索') {
      this.setState({ rightButtonText: '取消' })
      this.loadData(true)
    } else {
      this.isCancel = true
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

  renderHeaderBar = () => {
    return (
      <HeaderBar
        style={this.state.theme.styles.headerBar}
        titleView={this.getTitleView()}
        leftButton={ViewUtils.getBackButton(() => { this.onBackPress() })}
        rightButton={this.getRightButton()}
      />
    )
  }

  // list start
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

  renderList = () => {
    const { theme, dataSource, isLoading } = this.state
    return (
      <ListView
        dataSource={dataSource}
        renderRow={repoCell => this.renderRow(repoCell)}
        onEndReached={() => this.loadData()}
        onEndReachedThreshold={20}
        refreshControl={(
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => this.loadData(true)}
            colors={[theme.themeColor]}
            title="Loading..."
            titleColor={theme.themeColor}
            tintColor={theme.themeColor}
          />
        )}
      />
    )
  }

  // 底部 button start

  saveKey = async () => {
    const { currentKey } = this.state
    await this.getAllKeys()
    if (this.checkKeyIsExist(this.keys, currentKey)) {
      this.isKeysChanged = true
      this.setState({ isShowBottomButton: false })
      ToastUtils.showShort('添加成功')
    } else {
      const key = { path: currentKey, name: currentKey, checked: true }
      this.keys.unshift(key)
      languageDao.save(this.keys, () => {
        this.isKeysChanged = true
        this.setState({ isShowBottomButton: false })
        ToastUtils.showShort('添加成功')
      }, () => { ToastUtils.showShort('添加失败') })
    }
  }

  renderBottomButton = () => {
    return (
      <TouchableOpacity
        style={[styles.bottomButton, { backgroundColor: this.state.theme.themeColor }]}
        onPress={() => this.saveKey()}
      >
        <View>
          <Text style={{ fontSize: 18, color: '#fff', fontWeight: '500' }}>添加标签</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.root}>
        {this.renderHeaderBar()}
        {this.text ? this.renderList() : null}
        {this.state.isShowBottomButton ? this.renderBottomButton() : null}
      </View>
    )
  }
}
