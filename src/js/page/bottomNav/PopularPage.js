import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text, TextInput,
} from 'react-native'

import HeaderBar from '../../common/HeaderBar'

import DataRepository from '../../expand/dao/DataRepository'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'

export default class Popular extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props)
    this.dataRepository = new DataRepository()
    this.state = {
      result: '',
    }
  }

  componentDidMount = () => {

  }

  getUrl = (key) => {
    return URL + key + QUERY_STR
  }

  onLoad = async () => {
    // 根据 url 获取查询条件相关的 github 仓库数据
    const url = this.getUrl(this.text)
    const result = await this.dataRepository.fetchNetRepository(url)
    this.setState({
      result: JSON.stringify(result),
    })
  }

  render() {
    const { result } = this.state
    return (
      <View style={styles.root}>
        <HeaderBar
          title="最热"
          sytle={{ backgroundColor: '#6495ED' }}
        />
        <Text
          onPress={() => {
            this.onLoad()
          }}
        >
          获取数据
        </Text>
        <TextInput
          style={{ height: 40, borderWidth: 1 }}
          onChangeText={(text) => { this.text = text }}
        />
        <Text
          style={{ height: 500 }}
        >
          {result}
        </Text>
      </View>
    )
  }
}
