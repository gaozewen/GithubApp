import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text,
} from 'react-native'

import HeaderBar from '../../common/HeaderBar'

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
            navigation.navigate('CustomKeyPage')
          }}
        >
          自定义标签页
        </Text>
        <Text
          onPress={() => {
            navigation.navigate('SortKeyPage')
          }}
        >
          已订阅标签排序页
        </Text>
        <Text
          onPress={() => {
            navigation.navigate('CustomKeyPage', {
              isRemoveKeyPage: true,
            })
          }}
        >
          标签移除页
        </Text>
      </View>
    )
  }
}
