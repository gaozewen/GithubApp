import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text, ScrollView, TouchableHighlight, Image,
} from 'react-native'
// commons
import HeaderBar from '../../common/HeaderBar'
// dao
import { USE_IN } from '../../expand/dao/LanguageDao'
// imgs
import IMG_TRENDING from '../../../assets/images/ic_trending.png'
import IMG_TIAOZHUAN from '../../../assets/images/ic_tiaozhuan.png'
// constants
import { MENU } from '../../constants/Menu'
// utils
import ViewUtils from '../../utils/ViewUtils'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f3f3f4',
  },
  logo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    height: 90,
    backgroundColor: '#fff',
    borderBottomWidth: 0.3,
    borderBottomColor: 'darkgray',
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: '#757575',
  },
  extraLine: {
    borderBottomWidth: 0.3,
    borderBottomColor: 'darkgray',
  },
})

export default class MyPage extends Component {
  static propTypes = {
    theme: PropTypes.object,
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      theme: this.props.theme,
    }
  }

  componentDidMount = () => {

  }

  onClick = (navigateTo) => {
    const { navigation } = this.props
    const { theme } = this.state
    let routeName
    let params
    switch (navigateTo) {
      case MENU.About:
        routeName = 'AboutPage'
        params = { theme }
        break
      case MENU.Custom_Key:
        routeName = 'CustomKeyPage'
        params = { theme, useIn: USE_IN.POPULAR }
        break
      case MENU.Sort_Key:
        routeName = 'SortKeyPage'
        params = { theme, useIn: USE_IN.POPULAR }
        break
      case MENU.Remove_Key:
        routeName = 'CustomKeyPage'
        params = { theme, isRemoveKeyPage: true, useIn: USE_IN.POPULAR }
        break
      case MENU.Custom_Language:
        routeName = 'CustomKeyPage'
        params = { theme, useIn: USE_IN.TRENDING }
        break
      case MENU.Sort_Language:
        routeName = 'SortKeyPage'
        params = { theme, useIn: USE_IN.TRENDING }
        break
      case MENU.Custom_Theme:
        routeName = 'CustomTheme'
        params = { theme }
        break
      case MENU.About_Author:
        routeName = 'AboutMePage'
        params = { theme }
        break
      default:
        break
    }
    if (routeName) {
      navigation.navigate(routeName, params)
    }
  }

  getItem(tag, icon, text) {
    return ViewUtils.getSettingItem(
      () => this.onClick(tag), icon, text, this.state.theme.styles.icon,
    )
  }

  renderLogo = () => {
    const { theme } = this.state
    return (
      <TouchableHighlight onPress={() => this.onClick(MENU.About)}>
        <View style={styles.logo}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={IMG_TRENDING}
              style={[{ width: 40, height: 40, marginRight: 10 }, theme.styles.icon]}
            />
            <Text style={{ color: '#757575' }}>GitHub Popular</Text>
          </View>
          <Image
            source={IMG_TIAOZHUAN}
            style={[{ marginRight: 10, height: 22, width: 22 }, theme.styles.icon]}
          />
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    return (
      <View style={styles.root}>
        <HeaderBar
          title="我的"
          style={this.state.theme.styles.headerBar}
        />
        <ScrollView>
          {/* Logo */}
          {this.renderLogo()}
          {/* 最热管理 */}
          <View style={styles.extraLine}><Text style={styles.groupTitle}>最热管理</Text></View>
          {this.getItem(MENU.Custom_Key, MENU.Custom_Key.icon, MENU.Custom_Key.name)}
          {this.getItem(MENU.Sort_Key, MENU.Sort_Key.icon, MENU.Sort_Key.name)}
          {this.getItem(MENU.Remove_Key, MENU.Remove_Key.icon, MENU.Remove_Key.name)}
          {/* 趋势管理 */}
          <View style={styles.extraLine}><Text style={styles.groupTitle}>趋势管理</Text></View>
          {this.getItem(MENU.Custom_Language, MENU.Custom_Language.icon, MENU.Custom_Language.name)}
          {this.getItem(MENU.Sort_Language, MENU.Sort_Language.icon, MENU.Sort_Language.name)}
          {/* 设置 */}
          <View style={styles.extraLine}><Text style={styles.groupTitle}>设置</Text></View>
          {this.getItem(MENU.Custom_Theme, MENU.Custom_Theme.icon, MENU.Custom_Theme.name)}
          {this.getItem(MENU.About_Author, MENU.About_Author.icon, MENU.About_Author.name)}
        </ScrollView>
      </View>
    )
  }
}
