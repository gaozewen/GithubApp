import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {
  StyleSheet, View, Image, Text,
  TouchableOpacity,
} from 'react-native'
// libs
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
// common
import HeaderBar from '../../common/HeaderBar'
// components
import TrendingTab from './TrendingTab'
// dao
import LanguageDao, { USE_IN } from '../../expand/dao/LanguageDao'
// imgs
import IMG_DROP_DOWN from '../../../assets/images/ic_spinner_triangle.png'
// components
import TrendingDialog, { TimespanArray } from './TrendingDialog'


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
      timespan: TimespanArray[0],
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

  renderTitleView = () => {
    const { timespan } = this.state
    return (
      <View>
        <TouchableOpacity onPress={() => this.dialog.show()}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#fff', fontWeight: '400' }}>{timespan.showText}</Text>
            <Text style={{ fontSize: 16, color: '#fff', fontWeight: '400' }}> 趋 势 </Text>
            <Image
              style={{
                width: 12, height: 12, marginLeft: 5, marginBottom: 5,
              }}
              source={IMG_DROP_DOWN}
            />
          </View>

        </TouchableOpacity>
      </View>
    )
  }

  onSelectTimespan = (timespan) => {
    this.dialog.dismiss()
    this.setState({ timespan })
  }

  renderTrendingDialog = () => {
    return (
      <TrendingDialog
        ref={(dialog) => { this.dialog = dialog }}
        onSelect={timespan => this.onSelectTimespan(timespan)}
      />
    )
  }

  renderContent = () => {
    const { timespan, languages } = this.state
    // 防止 ScrollableTabView 因无法计算 TrendingPageTab 的个数 而导致页面无限渲染
    if (languages.length === 0) return null
    return (
      <ScrollableTabView
        tabBarBackgroundColor="#2196F3"
        tabBarActiveTextColor="#fff"
        tabBarInactiveTextColor="#fff"
        tabBarUnderlineStyle={{ backgroundColor: '#e7e7e7', height: 2, marginVertical: 1 }}
        renderTabBar={() => <ScrollableTabBar />}
      >
        {languages.map(item => (
          item.checked
            ? (
              <TrendingTab
                key={item.name}
                tabLabel={item.name}
                timespan={timespan}
                {...this.props}
              />
            )
            : null
        ))}
      </ScrollableTabView>
    )
  }

  render() {
    return (
      <View style={styles.root}>
        <HeaderBar
          titleView={this.renderTitleView()}
          sytle={{ backgroundColor: '#6495ED' }}
        />
        {this.renderContent()}
        {this.renderTrendingDialog()}
      </View>
    )
  }
}
