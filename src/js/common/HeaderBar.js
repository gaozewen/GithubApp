import React, { PureComponent } from 'react'

import {
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  View,
  ViewPropTypes,
  NativeModules,
} from 'react-native'
import PropTypes from 'prop-types'
// utils
import DeviceUtils from '../utils/DeviceUtils'

const { StatusBarManager } = NativeModules
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT

const NAV_BAR_HEIGHT_ANDROID = 50
const NAV_BAR_HEIGHT_IOS = 44
const STATUS_BAR_HEIGHT = DeviceUtils.isIphoneX() ? 0 : 20
const StatusBarShapek = {
  backgroundColor: PropTypes.string,
  barStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
  hidden: PropTypes.bool,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2196F3',
    paddingTop: STATUSBAR_HEIGHT,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
  },
  middleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
  },
  title: {
    fontSize: 16,
    color: '#fff',
  },
  statusBar: {
    height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
  },
})


export default class HeaderBar extends PureComponent {
  static propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    titleView: PropTypes.element,
    hide: PropTypes.bool,
    leftButton: PropTypes.element,
    rightButton: PropTypes.element,
    statusBar: PropTypes.shape(StatusBarShapek),
  }

  static defaultProps = {
    statusBar: {
      backgroundColor: 'transparent',
      // barStyle: 'light-content',
      hidden: false,
      translucent: true,
    },
  }

  render() {
    // statusBar ios 自定义的 状态栏 样式属性
    const {
      style, statusBar, titleView, title, leftButton, rightButton,
    } = this.props
    const status = (
      // <View style={styles.statusBar}>
      <StatusBar {...statusBar} />
      // </View>
    )
    const middle = titleView || (
      <Text style={styles.title}>{title}</Text>
    )
    const content = (
      <View style={styles.navBar}>
        <View>{leftButton}</View>
        <View style={styles.middleContainer}>
          {middle}
        </View>
        <View>{rightButton}</View>
      </View>
    )
    return (
      <View style={[styles.container, style]}>
        {status}
        {content}
      </View>
    )
  }
}
