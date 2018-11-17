import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, WebView,
} from 'react-native'

import HeaderBar from '../common/HeaderBar'
import ViewUtils from '../utils/ViewUtils';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

export default class WebViewPage extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props)
    const { navigation } = this.props
    const url = navigation.getParam('url', 'https://blog.csdn.net/github_38313789')
    const title = navigation.getParam('title', '高泽文的博客')
    this.state = {
      url,
      title,
      canGoBack: false,
    }
  }

  componentDidMount = () => {
  }

  onBackPress = () => {
    const { navigation } = this.props
    const { canGoBack } = this.state
    if (canGoBack) {
      this.webView.goBack()
    } else {
      navigation.pop()
    }
  }

  onNavigationStateChange = (e) => {
    this.setState({ canGoBack: e.canGoBack })
  }

  render() {
    const { url, title } = this.state
    return (
      <View style={styles.root}>
        <HeaderBar
          title={title}
          leftButton={ViewUtils.getBackButton(() => { this.onBackPress() })}
        />
        <WebView
          ref={(webView) => { this.webView = webView }}
          source={{ uri: url }}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
        />
      </View>
    )
  }
}
