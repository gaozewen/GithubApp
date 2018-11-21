import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, Modal, View, Text, Image,
  TouchableOpacity, StatusBar,
} from 'react-native'
// imgs
import IMG_ARROW_TOP from '../../assets/images/arrow_top.png' // eslint-disable-line
// utils
import DeviceUtils from '../utils/DeviceUtils'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingTop: 44 + (DeviceUtils.isIphoneX() ? 24 : 0),
  },
  arrow: {
    width: 16,
    height: 6,
    marginRight: 18,
    resizeMode: 'contain', // 显示整张图片，图片等比例缩放
  },
  content: {
    // width: 100,
    backgroundColor: '#fff',
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 0.3,
    borderBottomColor: 'darkgray',
  },
  icon: {
    width: 16,
    height: 16,
    margin: 10,
    marginLeft: 15,
  },
  text: { // item 的文字
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
    paddingRight: 15,
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
    theme: PropTypes.object,
    menus: PropTypes.array.isRequired,
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
    StatusBar.setBackgroundColor('rgba(0,0,0,0.6)')
  }

  dismiss() {
    StatusBar.setBackgroundColor('transparent')
    this.setState({ visiable: false })
  }

  render() {
    const {
      theme, menus, onSelect, onClose,
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
          <Image style={styles.arrow} source={IMG_ARROW_TOP} />
          <View
            style={styles.content}
          >
            {menus.map((item, i) => (
              <TouchableOpacity
                key={item}
                onPress={() => onSelect(item)}
                underlayColor="transparent"
              >
                <View style={i !== menus.length - 1 ? styles.row : {
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                }}
                >
                  <Image
                    source={item.icon}
                    resizeMode="stretch"
                    style={[
                      styles.icon, { tintColor: '#2196F3' },
                      theme.styles.icon,
                    ]}
                  />
                  <Text style={styles.text}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}
