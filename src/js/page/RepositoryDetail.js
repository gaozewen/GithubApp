import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, WebView, TouchableOpacity, Image,
} from 'react-native'
// commons
import HeaderBar from '../common/HeaderBar'
// utils
import ViewUtils from '../utils/ViewUtils'
// imgs
import IMG_STAR from '../../assets/images/ic_star.png'
import IMG_UNSTAR from '../../assets/images/ic_star_navbar.png'
// dao
import CollectionDao, { USE_IN } from '../expand/dao/CollectionDao'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

const TRENDING_URL = 'https://github.com/'
const collectionPopularDao = new CollectionDao(USE_IN.POPULAR)
const collectionTrendingDao = new CollectionDao(USE_IN.TRENDING)
export default class RepositoryDetail extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props)
    const { navigation } = this.props
    this.item = navigation.getParam('item')
    const title = this.item.full_name || this.item.fullName // 前者为 popular 后者 为 trending 页的数据
    const url = this.item.html_url || (TRENDING_URL + title)

    this.isCollected = this.props.navigation.getParam('isCollected', false)
    this.syncCellStarState = this.props.navigation.getParam('syncCellStarState', null)
    this.syncFavoritePage = this.props.navigation.getParam('syncFavoritePage', null)
    this.state = {
      theme: navigation.getParam('theme'),
      title,
      url,
      canGoBack: false,
      isCollected: this.isCollected,
      collectionIcon: this.isCollected ? IMG_STAR : IMG_UNSTAR,
    }
  }

  componentDidMount = () => {

  }

  onNavigationStateChange = (e) => {
    this.setState({
      canGoBack: e.canGoBack,
    })
  }

  onBack = () => {
    const { navigation } = this.props
    const { canGoBack } = this.state
    if (canGoBack) {
      this.webView.goBack()
    } else {
      navigation.pop()
    }
  }

  setCollectionState = (isCollected) => {
    this.setState({
      isCollected,
      collectionIcon: isCollected ? IMG_STAR : IMG_UNSTAR,
    })
  }

  onCollectionIconHandler = () => { // 处理 收藏按钮 点击事件
    const isCollected = !this.state.isCollected
    this.setCollectionState(isCollected) // 迅速渲染详情页 小星星 图标
    this.onCollect(this.item, isCollected) // 将收藏状态 及信息 保存到数据库
    if (this.syncCellStarState) {
      this.syncCellStarState(isCollected) // 同步更新 RepoCell 的 收藏状态
    }
    if (this.syncFavoritePage) {
      this.syncFavoritePage(isCollected) // 同步更新 收藏页
    }
  }

  onCollect = (item, isCollected) => { // 点击小星星 callback
    const key = item.id ? item.id : item.fullName
    const dao = item.id ? collectionPopularDao : collectionTrendingDao
    if (isCollected) { // 收藏，保存到数据库
      dao.collect(key.toString(), JSON.stringify(item))
    } else { // 取消收藏，删除数据库中数据
      dao.unCollect(key.toString())
    }
  }


  renderRightButton = () => {
    const { collectionIcon } = this.state
    return (
      <TouchableOpacity onPress={() => this.onCollectionIconHandler()}>
        <Image style={{ width: 22, height: 22, marginRight: 10 }} source={collectionIcon} />
      </TouchableOpacity>
    )
  }

  render() {
    const { theme, title, url } = this.state
    return (
      <View style={styles.root}>
        <HeaderBar
          title={title}
          style={theme.styles.headerBar}
          leftButton={ViewUtils.getBackButton(() => { this.onBack() })}
          rightButton={this.renderRightButton()}
        />
        <WebView
          style={{ zIndex: -1 }}
          startInLoadingState
          ref={(webView) => { this.webView = webView }}
          source={{ uri: url }}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
        />
      </View>
    )
  }
}
