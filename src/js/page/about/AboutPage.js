import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View, Linking,
  // StyleSheet, Text, Image, Dimensions,
} from 'react-native'
// utils
import ViewUtils from '../../utils/ViewUtils'
// constants
import { MENU } from '../../constants/Menu'
// commons
import AboutCommon, { ABOUT_IN } from './AboutCommon'
// config
import CONFIG from '../../../assets/ini/config.json'

export default class AboutPage extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.aboutCommon = new AboutCommon(props, state => this.updateState(state), ABOUT_IN.ABOUT_APP)
    this.state = {
      theme: this.props.navigation.getParam('theme'),
      repoCellArray: [],
    }
  }

  componentDidMount = () => {
    this.aboutCommon.componentDidMount()
  }

  updateState = (state) => {
    this.setState(state)
  }

  onClick = (navigateTo) => {
    const { navigation } = this.props
    const { theme } = this.state
    const url = 'mailto://crazycodeboy@gmail.com'
    let routeName
    let params
    switch (navigateTo) {
      case MENU.Website:
        routeName = 'WebViewPage'
        params = {
          theme,
          title: 'GitHub Popular',
          url: 'http://www.devio.org/io/GitHubPopular/',
        }
        break
      case MENU.About_Author:
        routeName = 'AboutMePage'
        params = { theme }
        break
      case MENU.Feedback:
        Linking.canOpenURL(url).then((supported) => {
          if (!supported) {
            console.log(`Can't handle url:${url}`)
          } else {
            Linking.openURL(url)
          }
        })
        break
      default:
        break
    }
    if (routeName) {
      navigation.navigate(routeName, params)
    }
  }

  render() {
    const { theme } = this.state
    const params = {
      name: 'GitHub Popular',
      description: '这是一个用来查看GitHub最受欢迎与最热项目的App,它基于React Native支持Android和iOS双平台。',
      avatar: CONFIG.author.avatar1,
      backgroundImg: CONFIG.author.backgroundImg1,
    }
    const content = (
      <View>
        {this.aboutCommon.renderRepoCells(this.state.repoCellArray)}
        {ViewUtils.getSettingItem(() => this.onClick(MENU.Website),
          MENU.Website.icon, MENU.Website.name, theme.styles.icon)}
        {ViewUtils.getSettingItem(() => this.onClick(MENU.About_Author),
          MENU.About_Author.icon, MENU.About_Author.name, theme.styles.icon)}
        {ViewUtils.getSettingItem(() => this.onClick(MENU.Feedback),
          MENU.Feedback.icon, MENU.Feedback.name, theme.styles.icon)}
      </View>
    )
    return this.aboutCommon.render(params, content)
  }
}
