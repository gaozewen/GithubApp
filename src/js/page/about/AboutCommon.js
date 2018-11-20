import React from 'react'
import {
  StyleSheet, View, Text, Image, Dimensions,
} from 'react-native'
// libs
import ParallaxScrollView from 'react-native-parallax-scroll-view'
// utils
import ViewUtils from '../../utils/ViewUtils'
import CheckUtils from '../../utils/CheckUtils'
// dao
import CollectionDao, { USE_IN } from '../../expand/dao/CollectionDao'
import RepoUtils from '../../expand/dao/RepoUtils'
// models
import RepoCell from '../../expand/model/RepoCell'
// components
import PopularRepoCell from '../popular/PopularRepoCell'
// config
import CONFIG from '../../../assets/ini/config.json'

const window = Dimensions.get('window')
// const AVATAR_SIZE = 120
const AVATAR_SIZE = 90
const ROW_HEIGHT = 60
// const PARALLAX_HEADER_HEIGHT = 350
const PARALLAX_HEADER_HEIGHT = 280
const STICKY_HEADER_HEIGHT = 70

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT,
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    // width: window.width,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10,
  },
  fixedSection: {
    position: 'absolute',
    left: 0,
    bottom: 2,
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20,
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    // paddingTop: 100,
    paddingTop: 60,
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2,
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5,
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
  },
  row: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    height: ROW_HEIGHT,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  rowText: {
    fontSize: 20,
  },
})

export const ABOUT_IN = {
  ABOUT_APP: 'about_app',
  ABOUT_AUTHOR: 'about_author',
}

class AboutCommon {
  constructor(props, updateState, aboutIn) {
    this.props = props
    this.updateState = updateState
    this.aboutIn = aboutIn
    this.collectionDao = new CollectionDao(USE_IN.POPULAR)
    this.repos = []
    this.collectionKeys = null // 为什么设置为 null 因为判断会方便一些
    this.repoUtils = new RepoUtils(this)
  }

  componentDidMount = () => {
    if (this.aboutIn === ABOUT_IN.ABOUT_APP) { // 关于页面只需要加载这一个开源项目
      this.repoUtils.fetchRepo(CONFIG.info.currentRepoUrl)
    } else if (this.aboutIn === ABOUT_IN.ABOUT_AUTHOR) {
      const urls = []
      CONFIG.items.forEach((item) => { urls.push(CONFIG.info.url + item) })
      this.repoUtils.fetchRepoList(urls)
    }
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

  renderRepoCells(repoCellArray) { // 渲染 当前app 这个项目，或 作者的所有开源项目
    if (!repoCellArray || repoCellArray.length === 0) return null // 不渲染任何东西
    const cells = repoCellArray.map((repoCell) => {
      return (
        <PopularRepoCell
          key={repoCell.item}
          repoCell={repoCell}
          onSelect={(item, isCollected, syncCellStarState) => {
            this.onSelect(item, isCollected, syncCellStarState)
          }}
          onCollect={(item, isCollected) => { this.onCollect(item, isCollected) }}
        />
      )
    })
    return cells
  }

  onCollect = (item, isCollected) => { // 点击小星星 callback
    if (isCollected) { // 收藏，保存到数据库
      this.collectionDao.collect(item.id.toString(), JSON.stringify(item))
    } else { // 取消收藏，删除数据库中数据
      this.collectionDao.unCollect(item.id.toString())
    }
  }

  getParallaxConfig(params) {
    const config = {}
    config.renderBackground = () => (
      <View key="background">
        <Image source={{
          uri: params.backgroundImg,
          width: window.width,
          height: PARALLAX_HEADER_HEIGHT,
        }}
        />
        <View style={{
          position: 'absolute',
          top: 0,
          width: window.width,
          backgroundColor: 'rgba(0,0,0,.4)',
          height: PARALLAX_HEADER_HEIGHT,
        }}
        />
      </View>
    )
    config.renderForeground = () => (
      <View key="parallax-header" style={styles.parallaxHeader}>
        <Image
          style={styles.avatar}
          source={{
            uri: params.avatar,
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
          }}
        />
        <Text style={styles.sectionSpeakerText}>{params.name}</Text>
        <Text style={styles.sectionTitleText}>{params.description}</Text>
      </View>
    )

    config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    )

    config.renderFixedHeader = () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtils.getBackButton(() => this.props.navigation.pop())}
      </View>
    )
    return config
  }

  render(params, content) {
    const config = this.getParallaxConfig(params)
    return (
      <ParallaxScrollView
        backgroundColor="#2196F3"
        headerBackgroundColor="#333"
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        backgroundSpeed={10}
        {...config}
      >
        {content}
      </ParallaxScrollView>
    )
  }
}


export default AboutCommon
