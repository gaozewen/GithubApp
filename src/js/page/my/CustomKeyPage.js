import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, ScrollView, Image, Alert, DeviceEventEmitter,
} from 'react-native'

// libs
// import CheckBox from 'react-native-check-box'
// common
import HeaderBar from '../../common/HeaderBar'
import CheckBox from '../../common/CheckBox'
// utils
import ViewUtils from '../../utils/ViewUtils'
import ArrayUtils from '../../utils/ArrayUtils'

// dao
import LanguageDao, { USE_IN } from '../../expand/dao/LanguageDao'
// imgs
import IMG_CHECKED from '../../../assets/images/my/ic_check_box.png'
import IMG_UNCHECKED from '../../../assets/images/my/ic_check_box_outline_blank.png'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.3,
    borderColor: 'darkgray',
  },
})

export default class CustomKeyPage extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.isRemoveKeyPage = props.navigation.getParam('isRemoveKeyPage', false) // RemovePage
    this.use_in = props.navigation.getParam('useIn', USE_IN.POPULAR)
    this.changeValues = [] // 初始化改变的 checkbox
    this.state = {
      dataArray: [],
    }
  }

  componentDidMount = () => {
    this.languageDao = new LanguageDao(this.use_in) // 初始化 dao
    this.loadData() // 初始化页面数据
  }

  loadData = () => { // 初始话 页面数据
    const { fetch } = this.languageDao
    fetch()
      .then((result) => {
        if (this.isRemoveKeyPage) { // RemovePage
          this.originalArray = result // 数据库中原始数据
          const unSubscribeArray = [] // 获取未订阅的 标签
          result.forEach((item) => { // 剔除 已订阅的 标签
            if (!item.checked) {
              unSubscribeArray.push(item)
            }
          })
          result = unSubscribeArray
        }
        this.setState({
          dataArray: result,
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  isAllUnChecked = () => { // 判断是否只剩一个被选中
    let checked = 0
    this.state.dataArray.forEach((item) => {
      if (item.checked) checked++
    })
    return checked === 0 // 只剩一个
  }

  onBack = () => {
    if (!this.isRemoveKeyPage && this.isAllUnChecked()) {
      Alert.alert('提示', '主人,至少要保留一个哦！')
      return
    }
    const { navigation } = this.props
    if (this.changeValues.length === 0) {
      navigation.pop()
      return
    }
    Alert.alert('提示', '要保存修改吗？', [
      { text: '不保存', onPress: () => { navigation.pop() } },
      { text: '保存', onPress: () => { this.onSave(false) } },
    ])
  }

  onSave = (isNeedVerify) => { // 退出此界面时 保存用户设置
    if (!this.isRemoveKeyPage && isNeedVerify && this.isAllUnChecked()) {
      Alert.alert('提示', '主人,至少要保留一个哦！')
      return
    }
    const { navigation } = this.props

    if (this.changeValues.length > 0) {
      if (this.isRemoveKeyPage) { // RemovePage
        this.changeValues.forEach((item) => {
          ArrayUtils.remove(this.originalArray, item)
        })
        this.languageDao.save(this.originalArray)
      } else {
        this.languageDao.save(this.state.dataArray)
      }
      DeviceEventEmitter.emit('update_home')
      return
    }
    navigation.pop()
  }

  changeItemValue = (item) => {
    // 改变原始数组中元素的值，
    // 因为会根据 this.changeValues 是否有值
    // 从而来 进行 save 操作 保存的是 this.state.dataArray
    item.checked = !item.checked
  }

  onClick = (item) => {
    this.changeItemValue(item)
    ArrayUtils.updateArray(this.changeValues, item) // 更新 发生变化的checkbox数组
  }

  renderCheckBox = (item) => { // CheckBox
    const leftText = item.name
    const isChecked = item.checked
    return (
      <CheckBox
        style={{ flex: 1, padding: 10 }}
        onClick={() => this.onClick(item)}
        leftText={leftText}
        isChecked={isChecked}
        checkedImage={<Image style={{ tintColor: '#2196F3' }} source={IMG_CHECKED} />}
        unCheckedImage={<Image style={{ tintColor: '#2196F3' }} source={IMG_UNCHECKED} />}
      />
    )
  }

  renderCheckBoxList = () => { // 展示 列表页面
    const { dataArray } = this.state
    if (!dataArray || dataArray.length === 0) return null
    const len = dataArray.length
    const views = []
    for (let i = 0, l = len - 2; i < l; i += 2) {
      views.push(
        <View key={dataArray[i].name}>
          <View style={styles.row}>
            {this.renderCheckBox(dataArray[i])}
            {this.renderCheckBox(dataArray[i + 1])}
          </View>
        </View>,
      )
    }
    views.push( // 补上少的 2 个 或 1 个
      <View key={dataArray[len - 1].name}>
        <View style={styles.row}>
          {len % 2 === 0 ? this.renderCheckBox(dataArray[len - 2]) : null}
          {this.renderCheckBox(dataArray[len - 1])}
        </View>
      </View>,
    )
    return views
  }

  render() {
    const rightButtonTitle = this.isRemoveKeyPage ? '移除' : '保存' // RemovePage
    let title = this.isRemoveKeyPage ? '标签移除' : '自定义标签'
    title = this.use_in === USE_IN.TRENDING ? '自定义语言' : title
    return (
      <View style={styles.root}>
        <HeaderBar
          title={title}
          leftButton={ViewUtils.getBackButton(() => { this.onBack() })}
          rightButton={ViewUtils.getRightButton(rightButtonTitle, () => { this.onSave(true) })}
        />
        <ScrollView>
          {this.renderCheckBoxList()}
        </ScrollView>
      </View>
    )
  }
}
