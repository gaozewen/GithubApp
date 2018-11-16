import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  // StyleSheet, Text, Image, Dimensions,
} from 'react-native'
// utils
import ViewUtils from '../../utils/ViewUtils'
// constants
import { MENU } from '../../constants/Menu'
// commons
import AboutCommon, { ABOUT_IN } from './AboutCommon'

export default class AboutPage extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.aboutCommon = new AboutCommon(props, state => this.updateState(state), ABOUT_IN.ABOUT_APP)
  }

  updateState = (state) => {
    this.setState(state)
  }

  onClick = (navigateTo) => {
    const { navigation } = this.props
    let routeName
    let params
    switch (navigateTo) {
      case MENU.Website:
        break
      case MENU.About_Author:
        break
      case MENU.Feedback:
        break
      default:
        break
    }
    if (routeName) {
      navigation.navigate(routeName, params)
    }
  }

  render() {
    const params = {
      name: 'GitHub Popular',
      description: '这是一个用来查看GitHub最受欢迎与最热项目的App,它基于React Native支持Android和iOS双平台。',
      avatar: 'https://avatars0.githubusercontent.com/u/26213278?s=400&u=89f3a6d81cf0dcc083340f0759769c3617f0d6f1&v=4',
      backgroundImg: 'http://www.devio.org/io/GitHubPopular/img/for_githubpopular_about_me.jpg',
    }
    const content = (
      <View>
        {ViewUtils.getSettingItem(() => this.onClick(), MENU.Website.icon, MENU.Website.name, { tintColor: '#2196F3' })}
        {ViewUtils.getSettingItem(() => this.onClick(), MENU.About_Author.icon, MENU.About_Author.name, { tintColor: '#2196F3' })}
        {ViewUtils.getSettingItem(() => this.onClick(), MENU.Feedback.icon, MENU.Feedback.name, { tintColor: '#2196F3' })}
      </View>
    )
    return this.aboutCommon.render(params, content)
  }
}
