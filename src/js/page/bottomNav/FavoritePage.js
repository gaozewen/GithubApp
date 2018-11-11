import React from 'react'
import {
  StyleSheet, View, Text,
} from 'react-native'


const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
})

export default () => {
  return (
    <View style={styles.root}>
      <Text> 我是 Favorite页</Text>
    </View>
  )
}