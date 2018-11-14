import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ViewPropTypes,
  Image,
  Text,
  TouchableHighlight,
} from 'react-native'
import PropTypes from 'prop-types'
// imgs
import IMG_INDETERMINATE from './img/ic_indeterminate_check_box.png'
import IMG_CHECKED from './img/ic_check_box.png'
import IMG_UNCHECKED from './img/ic_check_box_outline_blank.png'

// import IMG_INDETERMINATE from '../../../assets/images/my/ic_indeterminate_check_box.png'
// import IMG_CHECKED from '../../../assets/images/my/ic_check_box.png'
// import IMG_UNCHECKED from '../../../assets/images/my/ic_check_box_outline_blank.png'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftText: {
    flex: 1,
  },
  rightText: {
    flex: 1,
    marginLeft: 10,
  },
})

export default class CheckBox extends Component {
  static propTypes = {
    ...(ViewPropTypes || View.PropTypes),
    leftText: PropTypes.string,
    leftTextView: PropTypes.element,
    rightText: PropTypes.string,
    leftTextStyle: PropTypes.object,
    rightTextView: PropTypes.element,
    rightTextStyle: PropTypes.object,
    checkedImage: PropTypes.element,
    unCheckedImage: PropTypes.element,
    onClick: PropTypes.func.isRequired,
    isChecked: PropTypes.bool.isRequired,
    isIndeterminate: PropTypes.bool,
    checkBoxColor: PropTypes.string,
    checkedCheckBoxColor: PropTypes.string,
    uncheckedCheckBoxColor: PropTypes.string,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    isIndeterminate: false,
    leftTextStyle: {},
    rightTextStyle: {},
  }

  state = {
    isChecked: this.props.isChecked,
  }

  onClick() {
    this.state.isChecked = !this.state.isChecked
    this.forceUpdate()
    this.props.onClick()
  }

  _renderLeft() {
    if (this.props.leftTextView) return this.props.leftTextView
    if (!this.props.leftText) return null
    return (
      <Text style={[styles.leftText, this.props.leftTextStyle]}>{this.props.leftText}</Text>
    )
  }

  _renderRight() {
    if (this.props.rightTextView) return this.props.rightTextView
    if (!this.props.rightText) return null
    return (
      <Text style={[styles.rightText, this.props.rightTextStyle]}>{this.props.rightText}</Text>
    )
  }

  _renderImage() {
    if (this.props.isIndeterminate) {
      return this.props.indeterminateImage ? this.props.indeterminateImage : this.genCheckedImage()
    }
    if (this.state.isChecked) {
      return this.props.checkedImage ? this.props.checkedImage : this.genCheckedImage()
    }
    return this.props.unCheckedImage ? this.props.unCheckedImage : this.genCheckedImage()
  }

  _getCheckedCheckBoxColor() {
    return this.props.checkedCheckBoxColor
      ? this.props.checkedCheckBoxColor : this.props.checkBoxColor
  }

  _getUncheckedCheckBoxColor() {
    return this.props.uncheckedCheckBoxColor
      ? this.props.uncheckedCheckBoxColor : this.props.checkBoxColor
  }

  _getTintColor() {
    return this.state.isChecked
      ? this._getCheckedCheckBoxColor() : this._getUncheckedCheckBoxColor()
  }

  genCheckedImage() {
    let source
    if (this.props.isIndeterminate) {
      source = IMG_INDETERMINATE
    } else {
      source = this.state.isChecked ? IMG_CHECKED : IMG_UNCHECKED
    }

    return (
      <Image source={source} style={{ tintColor: this._getTintColor() }} />
    )
  }

  render() {
    return (
      <TouchableHighlight
        style={this.props.style}
        onPress={() => this.onClick()}
        underlayColor="transparent"
        disabled={this.props.disabled}
      >
        <View style={styles.container}>
          {this._renderLeft()}
          {this._renderImage()}
          {this._renderRight()}
        </View>
      </TouchableHighlight>
    )
  }
}
