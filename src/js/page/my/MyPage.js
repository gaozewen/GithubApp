import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text,
} from 'react-native'
// commons
import HeaderBar from '../../common/HeaderBar'
// dao
import { USE_IN } from '../../expand/dao/LanguageDao'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

export default class MyPage extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  componentDidMount = () => {

  }

  render() {
    const { navigation } = this.props
    return (
      <View style={styles.root}>
        <HeaderBar
          title="我的"
        />
        <Text
          onPress={() => {
            navigation.navigate('CustomKeyPage', { useIn: USE_IN.POPULAR })
          }}
        >
          自定义标签页
        </Text>
        <Text
          onPress={() => {
            navigation.navigate('SortKeyPage', { useIn: USE_IN.POPULAR })
          }}
        >
          已订阅标签排序页
        </Text>
        <Text
          onPress={() => {
            navigation.navigate('CustomKeyPage', {
              isRemoveKeyPage: true,
              useIn: USE_IN.POPULAR,
            })
          }}
        >
          标签移除页
        </Text>
        <Text
          onPress={() => {
            navigation.navigate('CustomKeyPage', { useIn: USE_IN.TRENDING })
          }}
        >
          自定义标语言
        </Text>
        <Text
          onPress={() => {
            navigation.navigate('SortKeyPage', { useIn: USE_IN.TRENDING })
          }}
        >
          语言排序
        </Text>
      </View>
    )
  }
}
