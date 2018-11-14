import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, Modal, View, Text, Image,
  TouchableOpacity,
} from 'react-native'
// imgs
import IMG_ARROW_TOP from '../../assets/images/arrow_top@3x.png'
// utils
import DeviceUtils from '../utils/DeviceUtils'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  arrow: {
    marginTop: 56 + (DeviceUtils.isIphoneX() ? 24 : 0),
    width: 16,
    height: 6,
    marginRight: 18,
    resizeMode: 'contain', // 显示整张图片，图片等比例缩放
  },
  text: { // item 的文字
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
    paddingRight: 15,
  },
  line: { // 分割线
    height: 0.3,
    backgroundColor: 'darkgray',
  },
})

/**
 * 全屏弹框组件
 *
 * @export
 * @class MenuDialog
 * @extends {Component}
 */
export default class MenuDialog extends Component {
  static propTypes = {
    menus: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    theme: PropTypes.object,
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
    const {
      menus, onSelect, onClose, theme,
    } = this.props
    const { visiable } = this.state
    return (
      <Modal
        transparent
        visible={visiable}
        onRequestClose={() => { onClose() }}
      >
        <TouchableOpacity
          style={styles.root}
          onPress={() => { this.dismiss() }}
        >
          <Image source={IMG_ARROW_TOP} />
          <View
            style={styles.content}
          >
            {menus.map((item, i) => (
              <TouchableOpacity
                key={item}
                onPress={() => onSelect(item)}
                underlayColor="transparent"
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={item.icon} resizeMode="stretch" style={[styles.icon, theme.styles.tabBarSelectedIcon]} />
                  <Text style={styles.text}>{item.name}</Text>
                  {i !== menus.length - 1 ? <View style={styles.line} /> : null}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}
