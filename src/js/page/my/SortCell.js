import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text, Image,
  TouchableHighlight,
} from 'react-native'

// imgs
import IMG_SORT from '../../../assets/images/my/ic_sort.png'

const styles = StyleSheet.create({
  root: {
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    tintColor: '#2196F3',
    height: 16,
    width: 16,
    marginRight: 10,
  },

})

export default class SortCell extends Component {
  static propTypes = {
    theme: PropTypes.object,
    data: PropTypes.object,
  }

  componentDidMount = () => {

  }

  render() {
    const { theme, data, sortHandlers } = this.props
    return (
      <TouchableHighlight
        underlayColor="#eee"
        style={styles.root}
        {...sortHandlers}
      >
        <View style={styles.row}>
          <Image style={[styles.img, theme.styles.icon]} source={IMG_SORT} />
          <Text>{data.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}
