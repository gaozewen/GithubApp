import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View,
  ListView, RefreshControl,
} from 'react-native'

// dao
import DataRepository, { USE_IN } from '../../expand/dao/DataRepository'

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

const DATA_TYPE = {
  INIT: 'init data',
  REFRESHING: 'pull down refreshing',
  MORE: 'fetch more',
}

export default class PopularTab extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.dataRepository = new DataRepository(USE_IN.POPULAR)
    this.state = {
      // 重复数据不渲染
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
      isLoading: false, // 是否正在加载数据
      currentPage: 1, // 当前页
    }
  }

  componentDidMount = () => {
    this.loadData(DATA_TYPE.INIT)
  }


  loadData = async (dataType) => { // 根据 url 获取查询条件相关的 github 仓库数据
    if (this.state.isLoading) return
    this.setState({ isLoading: true }) // lock

    const { dataSource, currentPage } = this.state
    const { tabLabel } = this.props
    const { fetchRepository, fetchNetRepository } = this.dataRepository

    let reqUrl = URL + tabLabel + QUERY_STR + currentPage * 20
    let items = []
    if (dataType === DATA_TYPE.INIT) { // 初始化
      items = await fetchRepository(reqUrl).catch(err => console.log(err))
    } else if (dataType === DATA_TYPE.REFRESHING) { // 刷新数据
      this.setState({ currentPage: 1 })
      reqUrl = URL + tabLabel + QUERY_STR + 20
      items = await fetchNetRepository(reqUrl).catch(err => console.log(err))
    } else if (dataType === DATA_TYPE.MORE) { // 加载更多
      items = await fetchNetRepository(reqUrl).catch(err => console.log(err))
    }

    if (items && items.length > 0) {
      this.setState({
        isLoading: false, // 获取最新数据 unLock
        dataSource: dataSource.cloneWithRows(items),
        currentPage: (currentPage < 100 ? currentPage + 1 : 1),
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
      <RepositoryCell
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
          onEndReached={() => this.loadData(DATA_TYPE.MORE)}
          onEndReachedThreshold={20}
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
