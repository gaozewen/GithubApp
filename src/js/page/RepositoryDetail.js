import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, WebView,
} from 'react-native'
// commons
import HeaderBar from '../common/HeaderBar'
// utils
import ViewUtils from '../utils/ViewUtils'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

export default class RepositoryDetail extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.item = this.props.navigation.getParam('item')
    const title = this.item.full_name
    const url = this.item.html_url
    this.state = {
      title,
      url,
      canGoBack: false,
    }
  }

  componentDidMount = () => {

  }

  onNavigationStateChange = (e) => {
    this.setState({
      canGoBack: e.canGoBack,
    })
  }

  onBack = () => {
    const { navigation } = this.props
    const { canGoBack } = this.state
    if (canGoBack) {
      this.webView.goBack()
    } else {
      navigation.pop()
    }
  }

  render() {
    const { title, url } = this.state
    return (
      <View style={styles.root}>
        <HeaderBar
          title={title}
          sytle={{ backgroundColor: '#6495ED' }}
          leftButton={ViewUtils.getBackButton(() => { this.onBack() })}
        />
        <WebView
          style={{ zIndex: -1 }}
          startInLoadingState
          ref={(webView) => { this.webView = webView }}
          source={{ uri: url }}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
        />
      </View>
    )
  }
}
