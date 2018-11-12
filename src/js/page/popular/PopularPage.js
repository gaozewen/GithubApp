import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {
  StyleSheet, View,
} from 'react-native'
// libs
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
// common
import HeaderBar from '../../common/HeaderBar'
// components
import PopularTab from './PopularTab'
// dao
import LanguageDao, { USE_IN } from '../../expand/dao/LanguageDao'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

export default class Popular extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props)
    this.languageDao = new LanguageDao(USE_IN.POPULAR)
    this.state = {
      languages: [],
    }
  }

  initData = () => {
    const { fetch } = this.languageDao
    fetch()
      .then((result) => {
        this.setState({
          languages: result,
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  componentDidMount = () => {
    this.initData()
  }

  render() {
    const { languages } = this.state
    const content = languages.length > 0 // 防止 ScrollableTabView 因无法计算 PopularTab 的个数 而导致页面无限渲染
      ? (
        <ScrollableTabView
          tabBarBackgroundColor="#2196F3"
          tabBarActiveTextColor="#fff"
          tabBarInactiveTextColor="#fff"
          tabBarUnderlineStyle={{ backgroundColor: '#e7e7e7', height: 2, marginVertical: 1 }}
          renderTabBar={() => <ScrollableTabBar />}
        >
          {languages.map(item => (item.checked
            ? <PopularTab key={item.name} tabLabel={item.name} /> : null))}
        </ScrollableTabView>
      )
      : null
    return (
      <View style={styles.root}>
        <HeaderBar
          title="最热"
          sytle={{ backgroundColor: '#6495ED' }}
        />
        {content}
      </View>
    )
  }
}
