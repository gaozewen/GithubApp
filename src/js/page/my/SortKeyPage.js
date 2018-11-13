import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text, TouchableOpacity, Alert,
} from 'react-native'
// libs
import SortableListView from 'react-native-sortable-listview'
// commons
import HeaderBar from '../../common/HeaderBar'
// dao
import LanguageDao, { USE_IN } from '../../expand/dao/LanguageDao'
// components
import SortCell from './SortCell'
// utils
import ArrayUtils from '../../utils/ArrayUtils'
import ViewUtils from '../../utils/ViewUtils'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

export default class SortKeyPage extends Component {
  static propTypes = {
    navigation: PropTypes.object,
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
    // 初始化 sortedWholeArray
    this.sortedWholeArray = ArrayUtils.clone(this.originalWholeArray)
  }

  initData = () => {
    const { fetch } = this.languageDao
    fetch()
      .then((result) => {
        this.getCheckedItems(result)
      })
      .catch((err) => { console.log(err) })
  }

  componentDidMount = () => {
    this.initData()
  }

  onBack = () => {
    const { navigation } = this.props
    const { sortingArray } = this.state
    if (ArrayUtils.isEqual(this.originalCheckedArray, sortingArray)) { // 未排序
      navigation.pop()
      return
    }
    Alert.alert('提示', '是否保存修改吗？', [
      { text: '不保存', onPress: () => { navigation.pop() } },
      { text: '保存', onPress: () => { this.onSave(true) } },
    ])
  }

  onSave = (isSorted) => {
    const { navigation } = this.props
    const { sortingArray } = this.state
    if (isSorted || !ArrayUtils.isEqual(this.originalCheckedArray, sortingArray)) { // 排序了
      this.getSortedWholeArray(sortingArray) // 设置 排序后的 完整数组 序列
      this.languageDao.save(this.sortedWholeArray) // 保存最终排序到数据库
    }
    navigation.pop()
  }

  getSortedWholeArray = (sortingArray) => {
    for (let i = 0; i < this.originalCheckedArray.length; i++) {
      // 获取 原始 checked 数组 index 为 i 的值
      const item = this.originalCheckedArray[i]
      // 找出 该值在 原始 完整 数组中的 索引
      const index = this.originalWholeArray.indexOf(item)
      // 将 设置 排序后的 完整 数组
      this.sortedWholeArray.splice(index, 1, sortingArray[i])
    }
  }

  render() {
    const rightButton = (
      <TouchableOpacity
        onPress={() => { this.onSave() }}
      >
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 20, color: '#fff' }}>保存</Text>
        </View>
      </TouchableOpacity>
    )
    return (
      <View style={styles.root}>
        <HeaderBar
          title="标签排序"
          sytle={{ backgroundColor: '#6495ED' }}
          leftButton={ViewUtils.getBackButton(() => { this.onBack() })}
          rightButton={rightButton}
        />
        <SortableListView
          style={{ flex: 1 }}
          data={this.state.sortingArray}
          order={Object.keys(this.state.sortingArray)}
          onRowMoved={(e) => {
            // 在 to 的 位置， 增加 (// 删除 from 位置的元素，并通过 [0] 获取) 的元素
            this.state.sortingArray.splice(e.to, 0, this.state.sortingArray.splice(e.from, 1)[0])
            // this.forceUpdate() // 强制刷新，即强制 执行 render() 方法
          }}
          renderRow={row => <SortCell data={row} />}
        />
      </View>
    )
  }
}
