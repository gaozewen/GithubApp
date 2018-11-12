import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text,
} from 'react-native'
// libs
import SortableListView from 'react-native-sortable-listview'
// commons
import HeaderBar from '../../common/HeaderBar'
// dao
import LanguageDao, { USE_IN } from '../../expand/dao/LanguageDao'
// utils
import ArrayUtils from '../../utils/ArrayUtils'
// components
import SortCell from './SortCell'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

export default class SortKeyPage extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props)
    this.languageDao = new LanguageDao(USE_IN.POPULAR)
    this.originalWholeArray = [] // ↓ 原始完整数组，用来做对比
    this.originalCheckedArray = [] // ↓ 原始的 被选中的 标签
    this.state = {
      sortingArray: [], // ↓ 正在被排序的，checked 的数组
    }
    this.sortedWholeArray = [] // ↓ 排序后的完整的数组
  }

  getCheckedItems = (allLanguages) => {
    // 初始化 originalWholeArray
    this.originalWholeArray = allLanguages
    const sortingArray = []
    allLanguages.forEach((item) => {
      if (item.checked) sortingArray.push(item)
    })
    // 初始化 originalCheckedArray
    this.originalCheckedArray = ArrayUtils.clone(sortingArray)
    // 初始化 sortingArray
    this.setState({ sortingArray })
  }

  initData = () => {
    const { fetch } = this.languageDao
    fetch()
      .then((result) => {
        this.getCheckedItems(result)
      })
      .catch((err) => { })
  }

  componentDidMount = () => {
    this.initData()
  }

  render() {
    const { sortingArray } = this.state
    return (
      <View style={styles.root}>
        <HeaderBar
          title="欢迎"
          sytle={{ backgroundColor: '#6495ED' }}
        />
        <SortableListView
          style={{ flex: 1 }}
          data={sortingArray}
          order={Object.keys(sortingArray)}
          onRowMoved={(e) => {
            sortingArray.splice(e.to, 0, sortingArray.splice(e.from, 1)[0])
            this.forceUpdate()
          }}
          renderRow={row => <SortCell data={row} />}
        />
      </View>
    )
  }
}
