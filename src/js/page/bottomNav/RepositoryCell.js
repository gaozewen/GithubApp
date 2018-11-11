import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text,
} from 'react-native'

export default class RepositoryCell extends Component {
  static propTypes = {
    data: PropTypes.object,
  }

  componentDidMount = () => {

  }

  render() {
    const { data } = this.props
    return (
      <View style={{ margin: 10 }}>
        <Text>{data.full_name}</Text>
        <Text>{data.description}</Text>
        <Text>{data.owner.avatar_url}</Text>
        <Text>{data.stargazers_count}</Text>
      </View>
    )
  }
}
