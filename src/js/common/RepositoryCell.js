import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text, Image,
  TouchableOpacity,
} from 'react-native'

// imgs
import IMG_STAR from '../../assets/images/ic_star.png'

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

export default class RepositoryCell extends Component {
  static propTypes = {
    data: PropTypes.object,
  }

  componentDidMount = () => {

  }

  render() {
    const { data } = this.props
    return (
      <TouchableOpacity style={styles.root}>

        <View style={styles.cell_container}>

          <Text style={styles.title}>{data.full_name}</Text>

          <Text style={styles.desc}>{data.description}</Text>

          <View style={styles.bottom}>

            <View style={styles.bottom_item}>
              <Text>Author：</Text>
              <Image
                style={styles.avatar}
                source={{ uri: data.owner.avatar_url }}
              />
            </View>

            <View style={styles.bottom_item}>
              <Text style={{ color: '#757575' }}>Stars：</Text>
              <Text style={{ color: '#757575' }}>{data.stargazers_count}</Text>
            </View>

            <Image style={styles.star} source={IMG_STAR} />

          </View>

        </View>

      </TouchableOpacity>
    )
  }
}
