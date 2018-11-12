import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {
  StyleSheet, View,
  ListView, RefreshControl,
} from 'react-native'

// dao
import DataRepository from '../../expand/dao/DataRepository'

// components
import RepositoryCell from '../../common/RepositoryCell'

// https://api.github.com/search/repositories?q=ios&sort=stars
const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars&page=1&per_page='

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
      isLoading: false, // 是否正在加载数据
      currentPage: 1, // 当前页
    }
  }

  componentDidMount = () => {
    this.loadData()
  }


  loadData = async (isMore) => { // 根据 url 获取查询条件相关的 github 仓库数据
    const { isLoading, dataSource, currentPage } = this.state
    if (isLoading) return // lock
    this.setState({
      isLoading: true,
    })
    const { tabLabel } = this.props
    const { fetchNetRepository } = this.dataRepository
    // 返回的时 js 对象 包含 总记录数 ...,展示位字符串需  JSON.stringify(result)
    let reqUrl = URL + tabLabel + QUERY_STR + currentPage * 20
    if (!isMore) { // 下拉刷新，则需还原当前页
      this.setState({
        currentPage: 1,
      })
      reqUrl = URL + tabLabel + QUERY_STR + 20
    }
    const result = await fetchNetRepository(reqUrl)
    this.setState({
      dataSource: dataSource.cloneWithRows(result.items),
      isLoading: false,
      currentPage: (currentPage < 100 ? currentPage + 1 : 1),
    })
  }


  renderRow = (data) => {
    return (
      <RepositoryCell data={data} />
    )
  }

  render() {
    const { dataSource, isLoading } = this.state
    return (
      <View style={styles.root}>
        <ListView
          dataSource={dataSource}
          renderRow={data => this.renderRow(data)}
          onEndReached={() => this.loadData(true)}
          onEndReachedThreshold={20}
          refreshControl={(
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => this.loadData()}
              colors={['#2196F3']}
              title="Loading..."
              titleColor="#2196F3"
              tintColor="#2196F3"
            />
          )}
        />
      </View>
    )
  }
}
