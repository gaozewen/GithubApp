// import React from 'react'
import { Platform, ToastAndroid, Alert } from 'react-native'

export default class ToastUtils {
  static showShort = (content, isAlert) => {
    if (!content) return null
    if (isAlert || Platform.OS === 'ios') return Alert.alert('提示', content.toString())
    return ToastAndroid.show(content.toString(), ToastAndroid.SHORT)
  }

  static showLong = (content, isAlert) => {
    if (!content) return null
    if (isAlert || Platform.OS === 'ios') return Alert.alert('提示', content.toString())
    return ToastAndroid.show(content.toString(), ToastAndroid.LONG)
  }
}
