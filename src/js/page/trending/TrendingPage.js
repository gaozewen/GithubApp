import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {
  StyleSheet, View, DeviceEventEmitter,
} from 'react-native'
// libs
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
// common
import HeaderBar from '../../common/HeaderBar'
// components
import TrendingTab from './TrendingTab'
// dao
import LanguageDao, { USE_IN } from '../../expand/dao/LanguageDao'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

export default class TrendingPage extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props)
    this.languageDao = new LanguageDao(USE_IN.TRENDING)
    this.state = {
      languages: [],
    }
  }

  initData = async () => {
    const { fetch } = this.languageDao
    const result = await fetch().catch(err => console.log(err))
    if (result && result.length > 0) {
      this.setState({
        languages: result,
      })
    }
  }

  componentDidMount = () => {
    this.initData()

    this.listener = DeviceEventEmitter.addListener('update_TrendingPage_page_labels', () => {
      this.initData()
    })
  }

  componentWillUnmount = () => {
    if (this.listener) {
      this.listener.remove()
    }
  }


  render() {
    const { languages } = this.state
    const content = languages.length > 0 // 防止 ScrollableTabView 因无法计算 TrendingPageTab 的个数 而导致页面无限渲染
      ? (
        <ScrollableTabView
          tabBarBackgroundColor="#2196F3"
          tabBarActiveTextColor="#fff"
          tabBarInactiveTextColor="#fff"
          tabBarUnderlineStyle={{ backgroundColor: '#e7e7e7', height: 2, marginVertical: 1 }}
          renderTabBar={() => <ScrollableTabBar />}
        >
          {languages.map(item => (item.checked
            ? <TrendingTab key={item.name} tabLabel={item.name} {...this.props} /> : null))}
        </ScrollableTabView>
      )
      : null
    return (
      <View style={styles.root}>
        <HeaderBar
          title="趋势"
          sytle={{ backgroundColor: '#6495ED' }}
        />
        {content}
      </View>
    )
  }
}
