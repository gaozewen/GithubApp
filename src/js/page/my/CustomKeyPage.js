import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text, ScrollView, Image,
  TouchableOpacity, Alert,
} from 'react-native'

// libs
import CheckBox from 'react-native-check-box'
// common
import HeaderBar from '../../common/HeaderBar'
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
  line: {
    height: 0.3,
    backgroundColor: 'darkgray',
  },
})

export default class CustomKeyPage extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.languageDao = new LanguageDao(USE_IN.POPULAR) // 初始化 dao
    this.changeValues = [] // 初始化改变的 checkbox
    this.state = {
      dataArray: [],
    }
  }

  loadData = () => { // 初始话 页面数据
    const { fetch } = this.languageDao
    fetch()
      .then((result) => {
        this.setState({
          dataArray: result,
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  componentDidMount = () => {
    this.loadData() // 初始化页面数据
  }

  isAllUnChecked = () => { // 判断是否只剩一个被选中
    let checked = 0
    this.state.dataArray.forEach((item) => {
      if (item.checked) checked++
    })
    return checked === 0 // 只剩一个
  }

  onBack = () => {
    if (this.isAllUnChecked()) {
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
      {
        text: '保存',
        onPress: () => {
          this.languageDao.save(this.state.dataArray)
          navigation.pop()
        },
      },
    ])
  }

  onSave = () => { // 退出此界面时 保存用户设置
    if (this.isAllUnChecked()) {
      Alert.alert('提示', '主人,至少要保留一个哦！')
      return
    }
    const { navigation } = this.props
    if (this.changeValues.length > 0) {
      this.languageDao.save(this.state.dataArray)
    }
    navigation.pop()
  }

  toggleCheckbox = (item) => {
    item.checked = !item.checked
    this.forceUpdate() // 强制刷新
    // this.setState((state) => {
    //   return {
    //     dataArray: [...state.dataArray],
    //   }
    // })
  }

  onClick = (item) => {
    this.toggleCheckbox(item)
    ArrayUtils.updateArray(this.changeValues, item) // 更新 发生变化的checkbox数组
  }

  renderCheckBox = (item) => { // CheckBox
    const leftText = item.name
    return (
      <CheckBox
        style={{ flex: 1, padding: 10 }}
        onClick={() => this.onClick(item)}
        leftText={leftText}
        isChecked={item.checked}
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
          <View style={{ flexDirection: 'row' }}>
            {this.renderCheckBox(dataArray[i])}
            {this.renderCheckBox(dataArray[i + 1])}
          </View>
          <View style={styles.line} />
        </View>,
      )
    }
    views.push( // 补上少的 2 个 或 1 个
      <View key={dataArray[len - 1].name}>
        <View style={{ flexDirection: 'row' }}>
          {len % 2 === 0 ? this.renderCheckBox(dataArray[len - 2]) : null}
          {this.renderCheckBox(dataArray[len - 1])}
        </View>
        <View style={styles.line} />
      </View>,
    )
    return views
  }

  render() {
    const rightButton = (
      <TouchableOpacity
        onPress={() => {
          this.onSave()
        }}
      >
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 20, color: '#fff' }}>保存</Text>
        </View>
      </TouchableOpacity>
    )
    return (
      <View style={styles.root}>
        <HeaderBar
          title="自定义标签"
          leftButton={ViewUtils.getBackButton(() => { this.onBack() })}
          rightButton={rightButton}
        />
        <ScrollView>
          {this.renderCheckBoxList()}
        </ScrollView>
      </View>
    )
  }
}
