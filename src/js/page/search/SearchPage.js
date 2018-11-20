import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  Dimensions,
} from 'react-native'
// commons
import HeaderBar from '../../common/HeaderBar'
// utils
import ViewUtils from '../../utils/ViewUtils'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

export default class SearchPage extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      rightButtonText: '搜索',
    }
  }

  componentDidMount = () => {

  }

  getTitleView = () => {
    return (
      <TextInput
        style={{
          width: (Dimensions.get('window').width - 100),
          height: 30,
          alignSelf: 'center',
          paddingTop: 2,
          paddingRight: 20,
          paddingBottom: 2,
          paddingLeft: 20,
          borderRadius: 50,
          fontSize: 16,
          backgroundColor: '#fff',
        }}
        ref={(input) => { this.input = input }}
        placeholder="搜索您感兴趣的内容"
        placeholderTextColor="#9E9E9E"
        clearTextOnFocus
        selectionColor="#2196F3"
        underlineColorAndroid="transparent"
        returnKeyType="search"
        onChangeText={() => { }}
        onSubmitEditing={() => { }}
      />
    )
  }

  updateState = (state) => {
    this.setState(state)
  }

  onBackPress = () => {
    this.input.blur() // 隐藏键盘
    const { navigation } = this.props
    navigation.pop()
  }

  onRightButtonClick = () => {
    const { rightButtonText } = this.state
    this.input.blur() // 隐藏键盘
    if (rightButtonText === '搜索') {
      this.updateState({ rightButtonText: '取消' })
    } else {
      this.updateState({ rightButtonText: '搜索' })
    }
  }

  getRightButton = () => {
    return (
      <TouchableOpacity
        style={{ marginRight: 5, alignItems: 'center', justifyContent: 'center' }}
        onPress={() => { this.onRightButtonClick() }}
      >
        <Text style={{ color: '#fff', fontSize: 18 }}>{this.state.rightButtonText}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.root}>
        <HeaderBar
          titleView={this.getTitleView()}
          leftButton={ViewUtils.getBackButton(() => { this.onBackPress() })}
          rightButton={this.getRightButton()}
        />
        <Text> 我是 SearchPage  页</Text>
      </View>
    )
  }
}
