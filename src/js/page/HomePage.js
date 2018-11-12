import React, { Component } from 'react'
import {
  StyleSheet, View, Image,
} from 'react-native'

// libs
import TabNavigator from 'react-native-tab-navigator'

// images
import IMG_POPULAR from '../../assets/images/ic_polular.png'
import IMG_TRENDING from '../../assets/images/ic_trending.png'
import IMG_FAVORITE from '../../assets/images/ic_favorite.png'
import IMG_MY from '../../assets/images/ic_my.png'

// pages
import PopularPage from './popular/PopularPage'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  image: {
    height: 22,
    width: 22,
  },
  page1: {
    flex: 1,
    backgroundColor: 'pink',
  },
  page2: {
    flex: 1,
    backgroundColor: 'green',
  },
})

export default class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'tb_popular', // 初始化 默认选中的 tab 页
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TabNavigator>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_popular'}
            selectedTitleStyle={{ color: '#2196F3' }}
            title="最热"
            renderIcon={() => <Image style={styles.image} source={IMG_POPULAR} />}
            renderSelectedIcon={() => <Image style={[styles.image, { tintColor: '#2196F3' }]} source={IMG_POPULAR} />}
            // badgeText="1"
            onPress={() => this.setState({ selectedTab: 'tb_popular' })}
          >
            <PopularPage />
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_trending'}
            selectedTitleStyle={{ color: '#2196F3' }}
            title="趋势"
            renderIcon={() => <Image style={styles.image} source={IMG_TRENDING} />}
            renderSelectedIcon={() => <Image style={[styles.image, { tintColor: '#2196F3' }]} source={IMG_TRENDING} />}
            onPress={() => this.setState({ selectedTab: 'tb_trending' })}
          >
            <View style={styles.page2} />
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_favorite'}
            selectedTitleStyle={{ color: '#2196F3' }}
            title="收藏"
            renderIcon={() => <Image style={styles.image} source={IMG_FAVORITE} />}
            renderSelectedIcon={() => <Image style={[styles.image, { tintColor: '#2196F3' }]} source={IMG_FAVORITE} />}
            onPress={() => this.setState({ selectedTab: 'tb_favorite' })}
          >
            <View style={styles.page1} />
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_my'}
            selectedTitleStyle={{ color: '#2196F3' }}
            title="我的"
            renderIcon={() => <Image style={styles.image} source={IMG_MY} />}
            renderSelectedIcon={() => <Image style={[styles.image, { tintColor: '#2196F3' }]} source={IMG_MY} />}
            onPress={() => this.setState({ selectedTab: 'tb_my' })}
          >
            <View style={styles.page2} />
          </TabNavigator.Item>
        </TabNavigator>
      </View>
    )
  }
}
