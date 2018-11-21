import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text,
} from 'react-native'
// utils
import NavigatorUtils from '../utils/NavigatorUtils'
// dao
import ThemeDao from '../expand/dao/ThemeDao'

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
})

export default class WelcomePage extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  // constructor(props) {
  //   super(props)
  // }

  componentDidMount = async () => {
    const { navigation } = this.props
    this.theme = await new ThemeDao().getTheme()
    this.timer = setTimeout(() => {
      NavigatorUtils.resetToHomePage({ navigation, theme: this.theme, selectedTab: 'tb_popular' }) // 重置到首页也就是初始页为 HomePage
    }, 500)
  }

  componentWillUnmount = () => {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }


  render() {
    return (
      <View style={styles.root}>
        <Text> 我是 欢迎页</Text>
      </View>
    )
  }
}
