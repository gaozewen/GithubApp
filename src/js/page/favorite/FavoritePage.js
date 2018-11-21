import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {
  StyleSheet, View,
} from 'react-native'
// libs
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
// common
import HeaderBar from '../../common/HeaderBar'
// components
import FavoriteTab from './FavoriteTab'
import { USE_IN } from '../../expand/dao/GitHubRepoDao'
import MoreMenu from '../MoreMenu'
// constants
import { MENU } from '../../constants/Menu'
// utils
import ViewUtils from '../../utils/ViewUtils'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

export default class FavoritePage extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount = () => {
  }

  // 渲染更多菜单
  renderMoreMenu = () => {
    return (
      <MoreMenu
        {...this.props}
        ref={(menu) => { this.menu = menu }}
        menus={[
          MENU.Share, MENU.Custom_Theme,
          MENU.About_Author, MENU.About,
        ]}
        onMoreMenuSelect={(e) => {
          if (e === MENU.Custom_Theme) {
            // this.setState({
            //   customThemeViewVisible: true,
            // })
          }
        }}
      />
    )
  }

  renderContent = () => {
    return (
      <ScrollableTabView
        tabBarBackgroundColor="#2196F3"
        tabBarActiveTextColor="#fff"
        tabBarInactiveTextColor="#fff"
        tabBarUnderlineStyle={{ backgroundColor: '#e7e7e7', height: 2, marginVertical: 1 }}
        renderTabBar={() => <ScrollableTabBar />}
      >
        <FavoriteTab tabLabel="最热" useIn={USE_IN.POPULAR} {...this.props} />
        <FavoriteTab tabLabel="趋势" useIn={USE_IN.TRENDING} {...this.props} />
      </ScrollableTabView>
    )
  }

  render() {
    return (
      <View style={styles.root}>
        <HeaderBar
          title="收藏"
          rightButton={ViewUtils.getMoreMenuButton(() => this.menu.showDialog())}
        />
        {this.renderContent()}
        {this.renderMoreMenu()}
      </View>
    )
  }
}
