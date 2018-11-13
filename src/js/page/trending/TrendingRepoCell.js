import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text, Image,
  TouchableOpacity,
} from 'react-native'
// libs
import HTMLView from 'react-native-htmlview'
// imgs
import IMG_STAR from '../../../assets/images/ic_star.png'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  cell_container: {
    backgroundColor: '#fff',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor: '#dddddd',
    borderWidth: 0.5,
    borderRadius: 2,
    // just ios
    shadowColor: 'gray',
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    // just ios
    // android
    elevation: 4,
  },
  // content start
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121',
  },
  desc: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575',
  },
  // bottom start
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottom_item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 22,
    width: 22,
  },
  star: {
    width: 22,
    height: 22,
  },
})

export default class TrendingRepoCell extends Component {
  static propTypes = {
    data: PropTypes.object,
    onSelect: PropTypes.func,
  }

  componentDidMount = () => {

  }

  render() {
    const { data, onSelect } = this.props
    return (
      <TouchableOpacity
        style={styles.root}
        onPress={() => onSelect(data)}
      >

        <View style={styles.cell_container}>

          <Text style={styles.title}>{data.fullName}</Text>

          <HTMLView
            value={`<p>${data.description}</p>`}
            FonLinkLongPress={() => { }}
            stylesheet={{ p: styles.desc, a: styles.desc }}
          />

          <Text style={{ color: '#2196F3', marginBottom: 6 }}>{data.meta}</Text>

          <View style={styles.bottom}>

            <View style={styles.bottom_item}>
              <Text style={{ color: '#757575' }}>Build by：</Text>
              {
                data.contributors
                  .map(item => (<Image key={item} style={styles.avatar} source={{ uri: item }} />))
              }

            </View>

            <Image style={styles.star} source={IMG_STAR} />

          </View>

        </View>

      </TouchableOpacity>
    )
  }
}
