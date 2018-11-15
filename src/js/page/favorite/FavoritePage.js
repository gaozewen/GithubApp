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
import FavoriteTab from './FavoriteTab'
import { USE_IN } from '../../expand/dao/GitHubRepoDao';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

export default class FavoritePage extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount = () => {
  }


  renderContent = () => {
    return (
      <ScrollableTabView
        tabBarBackgroundColor="#2196F3"
        tabBarActiveTextColor="#fff"
        tabBarInactiveTextColor="#fff"
        tabBarUnderlineStyle={{ backgroundColor: '#e7e7e7', height: 2, marginVertical: 1 }}
        renderTabBar={() => <ScrollableTabBar />}
      >
        <FavoriteTab tabLabel="最热" useIn={USE_IN.POPULAR} {...this.props} />
        <FavoriteTab tabLabel="趋势" useIn={USE_IN.TRENDING} {...this.props} />
      </ScrollableTabView>
    )
  }

  render() {
    return (
      <View style={styles.root}>
        <HeaderBar
          title="收藏"
          sytle={{ backgroundColor: '#6495ED' }}
        />
        {this.renderContent()}
      </View>
    )
  }
}
