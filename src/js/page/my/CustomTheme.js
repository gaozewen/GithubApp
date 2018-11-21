import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, ScrollView, TouchableHighlight, Text, DeviceEventEmitter,
} from 'react-native'
// commons
import HeaderBar from '../../common/HeaderBar'
// constants
import { THEMES } from '../../constants/Themes'
import EmitActions from '../../constants/EmitActions'
// utils
import ViewUtils from '../../utils/ViewUtils'
// dao
import ThemeDao from '../../expand/dao/ThemeDao'

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  themeItem: {
    flex: 1,
    height: 98,
    margin: 3,
    padding: 3,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#dddddd',
    borderWidth: 0.5,
    // just ios
    shadowColor: 'gray',
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    // just ios
    // android
    elevation: 4,
  },
  themeText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
})

export default class CustomTheme extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      theme: this.props.navigation.getParam('theme'),
    }
  }

  componentDidMount = () => {

  }

  onBack = () => {
    this.props.navigation.pop()
  }

  async onSelectTheme(themeKey) {
    await new ThemeDao().save(THEMES[themeKey])
    DeviceEventEmitter.emit(
      EmitActions.SYNC_HOME_PAGE.EVENT, EmitActions.SYNC_HOME_PAGE.FROM_CUSTOM_PAGE,
    )
    // this.onBack()
    // DeviceEventEmitter.emit('ACTION_BASE', ACTION_HOME.A_THEME,
    // ThemeFactory.createTheme(ThemeFlags[themeKey]))
  }

  renderThemeItem = (themeKey) => {
    return (
      <TouchableHighlight
        style={{ flex: 1 }}
        underlayColor="#fff"
        onPress={() => this.onSelectTheme(themeKey)}
      >
        <View style={[styles.themeItem, { backgroundColor: THEMES[themeKey] }]}>
          <Text style={styles.themeText}>{themeKey}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  renderThemeItems = () => {
    const items = []
    const keys = Object.keys(THEMES)
    for (let i = 0; i < keys.length; i += 3) {
      items.push(
        <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          {this.renderThemeItem(keys[i])}
          {this.renderThemeItem(keys[i + 1])}
          {this.renderThemeItem(keys[i + 2])}
        </View>,
      )
    }
    return items
  }

  renderContent = () => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          {this.renderThemeItems()}
        </ScrollView>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.root}>
        <HeaderBar
          style={this.state.theme.styles.headerBar}
          title="自定义主题"
          leftButton={ViewUtils.getBackButton(() => this.onBack())}
        />
        {this.renderContent()}
      </View>
    )
  }
}
