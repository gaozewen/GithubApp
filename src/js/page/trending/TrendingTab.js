import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View,
  ListView, RefreshControl,
} from 'react-native'

// dao
import DataRepository, { USE_IN } from '../../expand/dao/DataRepository'

// components
import TrendingRepoCell from './TrendingRepoCell'

const API_URL = 'https://github.com/trending/'
const QUERY_STR = '&per_page=20'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

const DATA_TYPE = {
  INIT: 'init data',
  REFRESHING: 'pull down refreshing',
  MORE: 'fetch more',
}

export default class TrendingTab extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.dataRepository = new DataRepository(USE_IN.TRENDING)
    this.state = {
      // 重复数据不渲染
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
      isLoading: false, // 是否正在加载数据
    }
  }

  componentDidMount = () => {
    this.loadData(DATA_TYPE.INIT)
  }


  /**
   * 获取 Trending 数据的 url
   *
   * @param {*} timespan
   * @param {*} languageType
   * @memberof TrendingTab
   */
  getFetchUrl(timespan, languageType) {
    return API_URL + languageType + timespan + QUERY_STR
  }

  loadData = async (dataType) => { // 根据 url 获取查询条件相关的 github 仓库数据
    if (this.state.isLoading) return
    this.setState({ isLoading: true }) // lock

    const { dataSource } = this.state
    const { tabLabel } = this.props
    const { fetchRepository, fetchNetRepository } = this.dataRepository

    const reqUrl = this.getFetchUrl('?since=daily', tabLabel)
    let items = []
    if (dataType === DATA_TYPE.INIT) { // 初始化
      items = await fetchRepository(reqUrl).catch(err => console.log(err))
    } else { // 刷新数据
      items = await fetchNetRepository(reqUrl).catch(err => console.log(err))
    }

    if (items && items.length > 0) {
      this.setState({
        isLoading: false, // 获取最新数据 unLock
        dataSource: dataSource.cloneWithRows(items),
      })
      return
    }
    this.setState({ isLoading: false })
  }

  onSelect = (item) => {
    const { navigation } = this.props
    navigation.navigate('RepositoryDetail', { item })
  }

  renderRow = (data) => {
    return (
      <TrendingRepoCell
        data={data}
        onSelect={(item) => { this.onSelect(item) }}
      />
    )
  }

  render() {
    const { dataSource, isLoading } = this.state
    return (
      <View style={styles.root}>
        <ListView
          dataSource={dataSource}
          renderRow={data => this.renderRow(data)}
          refreshControl={(
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => this.loadData(DATA_TYPE.REFRESHING)}
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
