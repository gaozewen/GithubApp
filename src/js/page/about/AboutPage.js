import React, { Component } from 'react'
import {
  StyleSheet, View, Text, Image, Dimensions,
} from 'react-native'
// libs
import ParallaxScrollView from 'react-native-parallax-scroll-view'
// utils
import ViewUtils from '../../utils/ViewUtils'
// constants
import { MENU } from '../../constants/Menu'

const window = Dimensions.get('window')

// const AVATAR_SIZE = 120
const AVATAR_SIZE = 90
const ROW_HEIGHT = 60
// const PARALLAX_HEADER_HEIGHT = 350
const PARALLAX_HEADER_HEIGHT = 280
const STICKY_HEADER_HEIGHT = 70

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT,
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    // width: window.width,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10,
  },
  fixedSection: {
    position: 'absolute',
    left: 0,
    bottom: 2,
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20,
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    // paddingTop: 100,
    paddingTop: 60,
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2,
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5,
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
  },
  row: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    height: ROW_HEIGHT,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  rowText: {
    fontSize: 20,
  },
})

class Talks extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  getParallaxConfig() {
    const params = {
      name: 'GitHub Popular',
      description: '这是一个用来查看GitHub最受欢迎与最热项目的App,它基于React Native支持Android和iOS双平台。',
      avatar: 'https://avatars0.githubusercontent.com/u/26213278?s=400&u=89f3a6d81cf0dcc083340f0759769c3617f0d6f1&v=4',
      backgroundImg: 'http://www.devio.org/io/GitHubPopular/img/for_githubpopular_about_me.jpg',
    }
    const config = {}
    config.renderBackground = () => (
      <View key="background">
        <Image source={{
          uri: params.backgroundImg,
          width: window.width,
          height: PARALLAX_HEADER_HEIGHT,
        }}
        />
        <View style={{
          position: 'absolute',
          top: 0,
          width: window.width,
          backgroundColor: 'rgba(0,0,0,.4)',
          height: PARALLAX_HEADER_HEIGHT,
        }}
        />
      </View>
    )
    config.renderForeground = () => (
      <View key="parallax-header" style={styles.parallaxHeader}>
        <Image
          style={styles.avatar}
          source={{
            uri: params.avatar,
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
          }}
        />
        <Text style={styles.sectionSpeakerText}>{params.name}</Text>
        <Text style={styles.sectionTitleText}>{params.description}</Text>
      </View>
    )

    config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    )

    config.renderFixedHeader = () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtils.getBackButton(() => this.props.navigation.pop())}
      </View>
    )
    return config
  }

  onClick = (navigateTo) => {
    const { navigation } = this.props
    let routeName
    let params
    switch (navigateTo) {
      case MENU.Website:
        break
      case MENU.About_Author:
        break
      case MENU.Feedback:
        break
      default:
        break
    }
    if (routeName) {
      navigation.navigate(routeName, params)
    }
  }

  renderContent = () => {
    return (
      <View>
        {ViewUtils.getSettingItem(() => this.onClick(), MENU.Website.icon, MENU.Website.name, { tintColor: '#2196F3' })}
        {ViewUtils.getSettingItem(() => this.onClick(), MENU.About_Author.icon, MENU.About_Author.name, { tintColor: '#2196F3' })}
        {ViewUtils.getSettingItem(() => this.onClick(), MENU.Feedback.icon, MENU.Feedback.name, { tintColor: '#2196F3' })}
      </View>
    )
  }

  render() {
    const config = this.getParallaxConfig()
    return (
      <ParallaxScrollView
        backgroundColor="#2196F3"
        headerBackgroundColor="#333"
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        backgroundSpeed={10}
        {...config}
      >
        {this.renderContent()}
      </ParallaxScrollView>
    )
  }
}


export default Talks
