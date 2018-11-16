import React from 'react'
import {
  StyleSheet, View, Image, Text,
  TouchableOpacity, TouchableHighlight,
} from 'react-native'

// imgs
import IMG_BACK from '../../assets/images/ic_arrow_back_white_36pt.png'
import IMG_TIAOZHUAN from '../../assets/images/ic_tiaozhuan.png'

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 0.3,
    borderBottomColor: 'darkgray',
  },
})

export default class ViewUtils {
  static getBackButton(callback) {
    return (
      <TouchableOpacity
        style={{ padding: 8 }}
        onPress={callback}
      >
        <Image
          style={{ width: 26, height: 26, tintColor: '#fff' }}
          source={IMG_BACK}
        />
      </TouchableOpacity>
    )
  }

  static getRightButton(title, callBack) {
    return (
      <TouchableOpacity
        style={{ alignItems: 'center' }}
        onPress={callBack}
      >
        <View style={{ marginRight: 10 }}>
          <Text style={{ fontSize: 20, color: '#FFFFFF' }}>{title}</Text>
        </View>
      </TouchableOpacity>
    )
  }


  /**
    * 获取设置页的Item
    * @param callBack 单击item的回调
    * @param icon 左侧图标
    * @param text 显示的文本
    * @param tintStyle 图标着色
    * @param expandableIco 右侧图标
    * @return {XML}
    */
  static getSettingItem(callBack, icon, text, tintStyle, expandableIco) {
    return (
      <TouchableHighlight
        onPress={callBack}
      >
        <View style={[styles.item]}>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            {icon
              ? (
                <Image
                  source={icon}
                  resizeMode="stretch"
                  style={[{
                    opacity: 1, width: 16, height: 16, marginRight: 10,
                  }, tintStyle]}
                />
              )
              : (
                <View style={{
                  opacity: 1, width: 16, height: 16, marginRight: 10,
                }}
                />
              )
            }
            <Text>{text}</Text>
          </View>
          <Image
            source={expandableIco || IMG_TIAOZHUAN}
            style={[{
              marginRight: 10,
              height: 22,
              width: 22,
              alignSelf: 'center',
              opacity: 1,
            }, tintStyle]}
          />
        </View>
      </TouchableHighlight>
    )
  }
}
