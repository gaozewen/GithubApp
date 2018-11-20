import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, TouchableOpacity, Image,
} from 'react-native'
// libs
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
// common
import HeaderBar from '../../common/HeaderBar'
// components
import PopularTab from './PopularTab'
// dao
import LanguageDao, { USE_IN } from '../../expand/dao/LanguageDao'
// imgs
import IMG_SEARCH from '../../../assets/images/ic_search_white_48pt.png'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

export default class PopularPage extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.languageDao = new LanguageDao(USE_IN.POPULAR)
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
  }

  render() {
    const { navigation } = this.props
    const { languages } = this.state
    const rightButton = (
      <TouchableOpacity onPress={() => navigation.navigate('SearchPage')}>
        <View style={{ padding: 5, marginRight: 8 }}>
          <Image style={{ width: 24, height: 24 }} source={IMG_SEARCH} />
        </View>
      </TouchableOpacity>
    )
    const content = languages.length > 0 // 防止 ScrollableTabView 因无法计算 PopularTab 的个数 而导致页面无限渲染
      ? (
        <ScrollableTabView
          tabBarBackgroundColor="#2196F3"
          tabBarActiveTextColor="#fff"
          tabBarInactiveTextColor="#fff"
          tabBarUnderlineStyle={{ backgroundColor: '#e7e7e7', height: 2, marginVertical: 1 }}
          renderTabBar={() => <ScrollableTabBar />}
        >
          {
            languages.map(item => (item.checked
              ? (
                <PopularTab
                  key={item.name}
                  tabLabel={item.name}
                  {...this.props}
                />
              )
              : null))
          }
        </ScrollableTabView>
      )
      : null
    return (
      <View style={styles.root}>
        <HeaderBar
          title="最热"
          sytle={{ backgroundColor: '#6495ED' }}
          rightButton={rightButton}
        />
        {content}
      </View>
    )
  }
}
