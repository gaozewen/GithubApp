import React from 'react'
import {
  StyleSheet, View, Image, Text,
  TouchableOpacity,
} from 'react-native'

// imgs
import IMG_BACK from '../../assets/images/ic_arrow_back_white_36pt.png'

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
}
