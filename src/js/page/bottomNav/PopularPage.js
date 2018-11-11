import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {
  StyleSheet, View,
} from 'react-native'

// libs
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'

// components
import HeaderBar from '../../common/HeaderBar'

import PopularTab from './PopularTab'

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
    this.state = {
      // result: '',
    }
  }

  componentDidMount = () => {

  }

  render() {
    // const { result } = this.state
    return (
      <View style={styles.root}>
        <HeaderBar
          title="最热"
          sytle={{ backgroundColor: '#6495ED' }}
        />
        <ScrollableTabView
          tabBarBackgroundColor="#2196F3"
          tabBarActiveTextColor="#fff"
          tabBarInactiveTextColor="#fff"
          tabBarUnderlineStyle={{ backgroundColor: '#e7e7e7', height: 2, marginVertical: 1 }}
          renderTabBar={() => <ScrollableTabBar />}
        >
          <PopularTab tabLabel="JAVA" />
          <PopularTab tabLabel="IOS" />
          <PopularTab tabLabel="Android" />
        </ScrollableTabView>
      </View>
    )
  }
}
