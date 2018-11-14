import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, Modal, View, Text, Image,
  TouchableOpacity,
} from 'react-native'
// imgs
import IMG_ARROW_TOP from '../../../assets/images/arrow_top.png' // eslint-disable-line
// utils
import DeviceUtils from '../../utils/DeviceUtils'
// model
import Timespan from '../../expand/model/Timespan'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: 44 + (DeviceUtils.isIphoneX() ? 24 : 0),
  },
  arrow: {
    width: 16,
    height: 6,
    resizeMode: 'contain', // 显示整张图片，图片等比例缩放
  },
  content: {
    width: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 3,
  },
  text: { // item 的文字
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
    opacity: 0.82,
    padding: 8,
    paddingLeft: 26,
    paddingRight: 26,
  },
})

export const TimespanArray = [ // 时间间隔
  new Timespan('今 天', 'daily'),
  new Timespan('本 周', 'weekly'),
  new Timespan('本 月', 'monthly'),
]

/**
 * 全屏弹框组件
 *
 * @export
 * @class MenuDialog
 * @extends {Component}
 */
export default class MenuDialog extends Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func,
  }

  state = {
    visiable: false, // 默认不显示
  }

  componentDidMount = () => {

  }

  show() {
    this.setState({ visiable: true })
  }

  dismiss() {
    this.setState({ visiable: false })
  }

  render() {
    const { onSelect, onClose } = this.props
    const { visiable } = this.state
    return (
      <Modal
        // animationType="fade"
        transparent
        hardwareAccelerated
        visible={visiable}
        onRequestClose={() => { onClose() }}
      >
        <TouchableOpacity
          style={styles.root}
          onPress={() => { this.dismiss() }}
        >
          <Image style={{ tintColor: 'rgba(0,0,0,0.5)' }} source={IMG_ARROW_TOP} />
          <View
            style={styles.content}
          >
            {TimespanArray.map(item => (
              <TouchableOpacity
                key={item.searchText}
                onPress={() => onSelect(item)}
                underlayColor="transparent"
              >
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                  <Text style={styles.text}>{item.showText}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}
