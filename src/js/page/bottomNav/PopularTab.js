import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text, ListView,
} from 'react-native'

// dao
import DataRepository from '../../expand/dao/DataRepository'

// components
import RepositoryCell from './RepositoryCell'

// https://api.github.com/search/repositories?q=ios&sort=stars
const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

export default class PopularTab extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props)
    this.dataRepository = new DataRepository()
    this.state = {
      // 重复数据不渲染
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
    }
  }

  componentDidMount = () => {
    this.loadData()
  }


  loadData = async () => { // 根据 url 获取查询条件相关的 github 仓库数据
    const { tabLabel } = this.props
    const { dataSource } = this.state
    const { fetchNetRepository } = this.dataRepository
    // 返回的时 js 对象 包含 总记录数 ...,展示位字符串需  JSON.stringify(result)
    const result = await fetchNetRepository(URL + tabLabel + QUERY_STR)
    this.setState({
      dataSource: dataSource.cloneWithRows(result.items),
    })
  }

  renderRow = (data) => {
    return (
      <RepositoryCell data={data} />
    )
  }

  render() {
    const { dataSource } = this.state
    return (
      <View>
        <ListView
          dataSource={dataSource}
          renderRow={data => this.renderRow(data)}
        />
      </View>
    )
  }
}
