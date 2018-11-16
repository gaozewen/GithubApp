import React from 'react'
import {
  StyleSheet, View, Text, Image, Dimensions,
} from 'react-native'
// libs
import ParallaxScrollView from 'react-native-parallax-scroll-view'
// utils
import ViewUtils from '../../utils/ViewUtils'

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

export const ABOUT_IN = {
  ABOUT_APP: 'about_app',
  ABOUT_AUTHOR: 'about_author',
}

class AboutCommon {
  constructor(props, updateState, aboutIn) {
    this.props = props
    this.updateState = updateState
    this.aboutIn = aboutIn
  }

  getParallaxConfig(params) {
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

  render(params, content) {
    const config = this.getParallaxConfig(params)
    return (
      <ParallaxScrollView
        backgroundColor="#2196F3"
        headerBackgroundColor="#333"
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        backgroundSpeed={10}
        {...config}
      >
        {content}
      </ParallaxScrollView>
    )
  }
}


export default AboutCommon
