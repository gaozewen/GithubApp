import React from 'react'
import PropTypes from 'prop-types'
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
// base
import BaseComponent from '../BaseComponent'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

export default class FavoritePage extends BaseComponent {
  static propTypes = {
    theme: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      theme: this.props.theme,
    }
  }

  componentDidMount = () => {
    super.componentDidMount()
  }

  // 渲染更多菜单
  renderMoreMenu() {
    return (
      <MoreMenu
        theme={this.state.theme}
        {...this.props}
        ref={(menu) => { this.menu = menu }}
        menus={[
          MENU.Share, MENU.Custom_Theme,
          MENU.About_Author, MENU.About,
        ]}
      />
    )
  }

  renderContent() {
    const { theme } = this.state
    return (
      <ScrollableTabView
        tabBarBackgroundColor={theme.themeColor}
        tabBarActiveTextColor="#fff"
        tabBarInactiveTextColor="#fff"
        tabBarUnderlineStyle={{ backgroundColor: '#e7e7e7', height: 2, marginVertical: 1 }}
        renderTabBar={() => <ScrollableTabBar />}
      >
        <FavoriteTab tabLabel="最热" useIn={USE_IN.POPULAR} {...this.props} theme={theme} />
        <FavoriteTab tabLabel="趋势" useIn={USE_IN.TRENDING} {...this.props} theme={theme} />
      </ScrollableTabView>
    )
  }

  render() {
    return (
      <View style={styles.root}>
        <HeaderBar
          style={this.state.theme.styles.headerBar}
          title="收藏"
          rightButton={ViewUtils.getMoreMenuButton(() => this.menu.showDialog())}
        />
        {this.renderContent()}
        {this.renderMoreMenu()}
      </View>
    )
  }
}
