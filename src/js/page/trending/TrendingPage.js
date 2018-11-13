import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text, TextInput,
} from 'react-native'
// commons
import HeaderBar from '../../common/HeaderBar'
// dao
import DataRepository, { USE_IN } from '../../expand/dao/DataRepository'

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
    this.dataRepository = new DataRepository(USE_IN.TRENDING)
    this.state = {
      data: '',
    }
  }

  componentDidMount = () => {

  }

  initData = async () => {
    const url = `${URL + this.Text}?per_page=20`
    const result = await this.dataRepository
      .fetchRepository(url)
      .catch(err => console.log(err))

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
          onPress={() => { this.initData() }}
        >
          加载数据
        </Text>
        <Text>{this.state.data}</Text>
      </View>
    )
  }
}
