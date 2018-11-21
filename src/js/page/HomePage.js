import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, Image, DeviceEventEmitter,
} from 'react-native'
// libs
import TabNavigator from 'react-native-tab-navigator'
// images
import IMG_POPULAR from '../../assets/images/ic_polular.png'
import IMG_TRENDING from '../../assets/images/ic_trending.png'
import IMG_FAVORITE from '../../assets/images/ic_favorite.png'
import IMG_MY from '../../assets/images/ic_my.png'
// utils
import NavigatorUtils from '../utils/NavigatorUtils'
// pages
import PopularPage from './popular/PopularPage'
import TrendingPage from './trending/TrendingPage'
import FavoritePage from './favorite/FavoritePage'
import MyPage from './my/MyPage'
// eimit
import EmitActions from '../constants/EmitActions'
// dao
import ThemeDao from '../expand/dao/ThemeDao'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F5FCFF',
    backgroundColor: '#f3f3f4',
  },
  image: {
    height: 22,
    width: 22,
  },
  page1: {
    flex: 1,
    backgroundColor: 'pink',
  },
  page2: {
    flex: 1,
    backgroundColor: 'green',
  },
})

export default class HomePage extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props)
    const { navigation } = props
    const selectedTab = navigation.getParam('selectedTab', 'tb_my')
    const theme = navigation.getParam('theme')
    this.state = {
      selectedTab, // 初始化 默认选中的 tab 页
      theme, // 主题
    }
  }

  componentDidMount = () => {
    this.listener = DeviceEventEmitter.addListener(
      EmitActions.SYNC_HOME_PAGE.EVENT,
      action => this.onAction(action),
    )
  }

  componentWillUnmount = () => {
    if (this.listener) {
      this.listener.remove()
    }
  }

  onAction = async (action) => {
    const { navigation } = this.props
    const { selectedTab } = this.state
    const theme = await new ThemeDao().getTheme()
    switch (action) {
      case EmitActions.SYNC_HOME_PAGE.FROM_CUSTOM_PAGE:
      case EmitActions.SYNC_HOME_PAGE.FROM_SEARCH_PAGE:
        NavigatorUtils.resetToHomePage({ theme, navigation, selectedTab })
        break
      default:
        break
    }
  }

  /**
   * 渲染 当前 tab 页内容
   *
   * @param {*} PageComponent
   * @param {*} selectedTab
   * @param {*} title
   * @param {*} iconImg
   * @returns
   * @memberof HomePage
   */
  renderTabItem(PageComponent, selectedTab, title, iconImg) {
    const { theme } = this.state
    return (
      <TabNavigator.Item
        selected={this.state.selectedTab === selectedTab}
        selectedTitleStyle={theme.styles.selectedTitle}
        title={title}
        renderIcon={() => <Image style={styles.image} source={iconImg} />}
        renderSelectedIcon={() => (
          <Image
            style={[styles.image, theme.styles.icon]}
            source={iconImg}
          />
        )}
        // badgeText="1"
        onPress={() => this.setState({ selectedTab })}
      >
        <PageComponent navigation={this.props.navigation} theme={theme} />
      </TabNavigator.Item>
    )
  }


  render() {
    return (
      <View style={styles.container}>
        <TabNavigator>
          {this.renderTabItem(PopularPage, 'tb_popular', '最热', IMG_POPULAR)}
          {this.renderTabItem(TrendingPage, 'tb_trending', '趋势', IMG_TRENDING)}
          {this.renderTabItem(FavoritePage, 'tb_favorite', '收藏', IMG_FAVORITE)}
          {this.renderTabItem(MyPage, 'tb_my', '我的', IMG_MY)}
        </TabNavigator>
      </View>
    )
  }
}
