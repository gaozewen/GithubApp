import { Component } from 'react'
import PropTypes from 'prop-types'
import {
  DeviceEventEmitter,
} from 'react-native'
// constants
import EmitActions from '../constants/EmitActions'

export default class BaseComponent extends Component {
  static propTypes = {
    theme: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      theme: this.props.theme,// eslint-disable-line
    }
  }

  componentDidMount() {
    this.baseListener = DeviceEventEmitter.addListener(EmitActions.SYNC_BASE.EVENT,
      (action, params) => this.onBaseAction(action, params));
    // this.homeTabSelectListener = DeviceEventEmitter.addListener(EVENT_TYPE_HOME_TAB_SELECT,
    //   (from, to) => this.onTabSelected(from, to));
  }

  componentWillUnmount() {
    if (this.baseListener) {
      this.baseListener.remove();
    }
    // if (this.homeTabSelectListener) {
    //   this.homeTabSelectListener.remove();
    // }
  }

  /**
   * 通知回调事件处理
   * @param action
   * @param params
   */
  onBaseAction = (action, params) => {
    if (action === EmitActions.SYNC_BASE.SYNC_THEME) {
      this.onThemeChange(params)
    }
  }


  /**
   * 当主题改变后更新主题
   * @param theme
   */
  onThemeChange = (theme) => {
    if (!theme) return
    this.setState({ theme }) // eslint-disable-line
  }

  // onTabSelected = (from, to) => {

  // }
}
