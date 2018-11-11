import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text,
} from 'react-native'

import NavigatorUtils from '../utils/NavigatorUtils'

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
})

export default class WelcomePage extends Component {
  propTypes = {
    navigation: PropTypes.object,
  }

  componentDidMount = () => {
    const { navigation } = this.props
    this.timer = setTimeout(() => {
      NavigatorUtils.resetToHomePage({ navigation }) // 重置到首页也就是初始页为 HomePage
    }, 2000)
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
