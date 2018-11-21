import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, TouchableOpacity, Image,
} from 'react-native'
// libs
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
// common
import HeaderBar from '../../common/HeaderBar'
// components
import PopularTab from './PopularTab'
import MoreMenu from '../MoreMenu'
// dao
import LanguageDao, { USE_IN } from '../../expand/dao/LanguageDao'
// imgs
import IMG_SEARCH from '../../../assets/images/ic_search_white_48pt.png'
// constants
import { MENU } from '../../constants/Menu'
// utils
import ViewUtils from '../../utils/ViewUtils'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

export default class PopularPage extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    theme: PropTypes.object,
  }

  constructor(props) {
    super(props)
    const { theme } = this.props
    this.languageDao = new LanguageDao(USE_IN.POPULAR)
    this.state = {
      languages: [],
      theme,
    }
  }

  initData = async () => {
    const { fetch } = this.languageDao
    const result = await fetch().catch(err => console.log(err))
    if (result && result.length > 0) {
      this.setState({
        languages: result,
      })
    }
  }

  componentDidMount = () => {
    this.initData()
  }

  // 渲染更多菜单
  renderMoreMenu() {
    return (
      <MoreMenu
        theme={this.state.theme}
        {...this.props}
        ref={(menu) => { this.menu = menu }}
        menus={[
          MENU.Custom_Key, MENU.Sort_Key, MENU.Remove_Key,
          MENU.Share, MENU.Custom_Theme, MENU.About_Author, MENU.About,
        ]}
      />
    )
  }

  render() {
    const { navigation } = this.props
    const { theme, languages } = this.state
    const rightButton = (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => navigation.navigate('SearchPage', { theme })}>
          <View style={{ padding: 5, marginRight: 8 }}>
            <Image style={{ width: 24, height: 24 }} source={IMG_SEARCH} />
          </View>
        </TouchableOpacity>
        {ViewUtils.getMoreMenuButton(() => this.menu.showDialog())}
      </View>
    )
    const content = languages.length > 0 // 防止 ScrollableTabView 因无法计算 PopularTab 的个数 而导致页面无限渲染
      ? (
        <ScrollableTabView
          tabBarBackgroundColor={theme.themeColor}
          tabBarActiveTextColor="#fff"
          tabBarInactiveTextColor="#fff"
          tabBarUnderlineStyle={{ backgroundColor: '#e7e7e7', height: 2, marginVertical: 1 }}
          renderTabBar={() => <ScrollableTabBar />}
        >
          {
            languages.map(item => (item.checked
              ? (
                <PopularTab
                  key={item.name}
                  tabLabel={item.name}
                  {...this.props}
                  theme={theme}
                />
              )
              : null))
          }
        </ScrollableTabView>
      )
      : null
    return (
      <View style={styles.root}>
        <HeaderBar
          title="最热"
          style={theme.styles.headerBar}
          rightButton={rightButton}
        />
        {content}
        {this.renderMoreMenu()}
      </View>
    )
  }
}
