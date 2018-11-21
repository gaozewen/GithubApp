import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text, WebView, TextInput,
} from 'react-native'

import HeaderBar from '../common/HeaderBar'
import ToastUtils from '../utils/ToastUtils'

const URL = 'https://www.gaozewen.com'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  back: {
    fontSize: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    margin: 2,
  },
})

export default class WebViewTest extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props)
    this.state = {
      url: URL,
      title: '',
      canGoBack: false,
    }
  }

  componentDidMount = () => {
    this.state = {
      url: URL,
      title: '',
      canGoBack: false,
    }
  }

  goBack = () => {
    const { canGoBack } = this.state
    if (canGoBack) {
      this.webView.goBack()
    } else {
      ToastUtils.showShort('已经到顶了！')
    }
  }

  go = () => {
    this.setState({ url: this.text })
  }

  onNavigationStateChange = (e) => {
    this.setState({
      canGoBack: e.canGoBack,
      title: e.title,
    })
  }

  render() {
    const { url, title } = this.state
    return (
      <View style={styles.root}>
        <HeaderBar
          title={title}
          sytle={{ backgroundColor: '#6495ED' }}
        />
        <View style={styles.row}>
          <Text
            style={styles.back}
            onPress={() => { this.goBack() }}
          >
            返回
          </Text>
          <TextInput
            style={styles.input}
            defaultValue={url}
            onChangeText={(text) => {
              this.text = text
            }}
          />
          <Text
            style={styles.back}
            onPress={() => { this.go() }}
          >
            前往
          </Text>
        </View>
        <WebView
          style={{ zIndex: -1 }}
          ref={(webView) => { this.webView = webView }}
          source={{ uri: url }}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
        />
      </View>
    )
  }
}
