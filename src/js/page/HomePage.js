import React, { Component } from 'react'
import {
  StyleSheet, View, Image,
} from 'react-native'

// libs
import TabNavigator from 'react-native-tab-navigator'

// images
import imgPolular from '../../assets/images/ic_polular.png'
import imgTrending from '../../assets/images/ic_trending.png'

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
            selectedTitleStyle={{ color: 'red' }}
            title="最热"
            renderIcon={() => <Image style={styles.image} source={imgPolular} />}
            renderSelectedIcon={() => <Image style={[styles.image, { tintColor: 'red' }]} source={imgPolular} />}
            badgeText="1"
            onPress={() => this.setState({ selectedTab: 'tb_popular' })}
          >
            <View style={styles.page1} />
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_trending'}
            selectedTitleStyle={{ color: 'red' }}
            title="趋势"
            renderIcon={() => <Image style={styles.image} source={imgTrending} />}
            renderSelectedIcon={() => <Image style={[styles.image, { tintColor: 'red' }]} source={imgTrending} />}
            onPress={() => this.setState({ selectedTab: 'tb_trending' })}
          >
            <View style={styles.page2} />
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_favorite'}
            selectedTitleStyle={{ color: 'red' }}
            title="收藏"
            renderIcon={() => <Image style={styles.image} source={imgPolular} />}
            renderSelectedIcon={() => <Image style={[styles.image, { tintColor: 'red' }]} source={imgPolular} />}
            badgeText="1"
            onPress={() => this.setState({ selectedTab: 'tb_favorite' })}
          >
            <View style={styles.page1} />
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_my'}
            selectedTitleStyle={{ color: 'red' }}
            title="我的"
            renderIcon={() => <Image style={styles.image} source={imgTrending} />}
            renderSelectedIcon={() => <Image style={[styles.image, { tintColor: 'red' }]} source={imgTrending} />}
            onPress={() => this.setState({ selectedTab: 'tb_my' })}
          >
            <View style={styles.page2} />
          </TabNavigator.Item>
        </TabNavigator>
      </View>
    )
  }
}
