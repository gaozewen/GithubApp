import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text, TextInput,
} from 'react-native'
import GitHubTrending from 'GitHubTrending'

import HeaderBar from '../common/HeaderBar'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

const URL = 'https://github.com/trending/'

export default class TrendingTest extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props)
    this.trending = new GitHubTrending()
    this.state = {
      data: '',
    }
  }

  componentDidMount = () => {

  }

  onLoad = async () => {
    const url = URL + this.Text
    const result = await this.trending.fetchTrending(url).catch(err => console.log(err))
    this.setState({
      data: JSON.stringify(result),
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
          style={{ height: 30, borderWidth: 1 }}
          onChangeText={(text) => { this.text = text }}
        />
        <Text
          onPress={() => { this.onLoad() }}
        >
          加载数据
        </Text>
        <Text>{this.state.data}</Text>
      </View>
    )
  }
}
