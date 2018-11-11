import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text, TextInput,
  AsyncStorage,
} from 'react-native'
import Toast, { DURATION } from 'react-native-easy-toast'
import HeaderBar from '../common/HeaderBar'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

const KEY = 'TEXT'
export default class AsyncStorageTest extends Component {
  onFetch = () => {
    AsyncStorage.getItem(KEY, (error, result) => {
      if (!error) {
        if (result !== '' && result != null) {
          this.toast.show(result, DURATION.LENGTH_SHORT)
        } else {
          this.toast.show('内容为空', DURATION.LENGTH_SHORT)
        }
      } else {
        this.toast.show('报错', DURATION.LENGTH_SHORT)
      }
    })
  }

  onRemove = () => {
    AsyncStorage.removeItem(KEY, (error) => {
      if (error) {
        this.toast.show('移除失败', DURATION.LENGTH_SHORT)
      } else {
        this.toast.show('删除成功', DURATION.LENGTH_SHORT)
      }
    })
  }

  onSave = () => {
    AsyncStorage.setItem(KEY, this.text, (error) => {
      if (error) {
        this.toast.show(error, DURATION.LENGTH_SHORT)
      } else {
        this.toast.show('保存成功', DURATION.LENGTH_SHORT)
      }
    })
  }

  render() {
    return (
      <View style={styles.root}>
        <HeaderBar
          title="欢迎"
          sytle={{ backgroundColor: '#6495ED' }}
        />
        <TextInput
          style={{ borderWidth: 1, height: 40, margin: 6 }}
          onChangeText={(text) => { this.text = text }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Text
            onPress={() => this.onFetch()}
          >
            取出
          </Text>
          <Text
            onPress={() => this.onRemove()}
          >
            移除
          </Text>
          <Text
            onPress={() => this.onSave()}
          >
            保存
          </Text>
        </View>
        <Toast ref={(toast) => { this.toast = toast }} />
        {/* <View style={{ flexDirection: 'row', margin: 5 }}>
          <Text>{this.state.content}</Text>
        </View> */}
      </View>
    )
  }
}
