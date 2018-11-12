import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text,
} from 'react-native'

import HeaderBar from '../../common/HeaderBar'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

export default class SortCell extends Component {
  static propTypes = {
    data: PropTypes.object,
  }

  componentDidMount = () => {

  }

  render() {
    const { data } = this.props
    return (
      <View style={styles.root}>
        <Text>{data.name}</Text>
      </View>
    )
  }
}
