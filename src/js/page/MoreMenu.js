import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Linking,
} from 'react-native'
// commons
import MenuDialog from '../common/MenuDialog'
// constants
import { MENU } from '../constants/Menu'
// dao
import { USE_IN } from '../expand/dao/LanguageDao'
// share
import UShare from '../common/UShare'
// ini
import SHARE from '../../assets/ini/share.json'

export default class MoreMenu extends Component {
  static propTypes = {
    theme: PropTypes.object,
    menus: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired,
  }

  showDialog = () => {
    this.dialog.show()
  }

  closeDialog = () => {
    this.dialog.dismiss()
  }

  onMoreMenuSelect = (tab) => {
    this.closeDialog()

    const { theme, navigation } = this.props
    let routeName
    let params
    const url = 'mailto://crazycodeboy@gmail.com'
    const shareApp = SHARE.share_app
    switch (tab) {
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
      case MENU.About:
        routeName = 'AboutPage'
        params = { theme }
        break
      case MENU.Feedback:
        Linking.canOpenURL(url).then((supported) => {
          if (!supported) {
            console.log(`Can't handle url: ${url}`)
          } else {
            Linking.openURL(url)
          }
        }).catch(err => console.error('An error occurred', err))
        break
      case MENU.Share:
        UShare.share(
          shareApp.title, shareApp.content,
          shareApp.imgUrl, shareApp.url,
          () => { }, () => { },
        )
        break
      default:
        break
    }
    if (routeName) {
      navigation.navigate(routeName, params)
    }
  }

  render() {
    const { theme, menus } = this.props
    return (
      <MenuDialog
        theme={theme}
        ref={(dialog) => { this.dialog = dialog }}
        menus={menus}
        onSelect={tab => this.onMoreMenuSelect(tab)}
      />
    )
  }
}
