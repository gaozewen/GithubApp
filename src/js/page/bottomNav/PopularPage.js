import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text,
} from 'react-native'

// libs
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'

// components
import HeaderBar from '../../common/HeaderBar'
import DataRepository from '../../expand/dao/DataRepository'

import PopularTab from './PopularTab'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'

export default class Popular extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props)
    // this.dataRepository = new DataRepository()
    this.state = {
      result: '',
    }
  }

  componentDidMount = () => {

  }

  render() {
    const { result } = this.state
    return (
      <View style={styles.root}>
        <HeaderBar
          title="最热"
          sytle={{ backgroundColor: '#6495ED' }}
        />
        <ScrollableTabView
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
