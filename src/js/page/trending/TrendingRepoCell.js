import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, View, Text, Image,
  TouchableOpacity,
} from 'react-native'
// libs
import HTMLView from 'react-native-htmlview'
// imgs
import IMG_UNSTAR from '../../../assets/images/ic_unstar_transparent.png'
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
    marginTop: 22,
    marginLeft: 22,
    tintColor: '#2196F3',
  },
})

export default class TrendingRepoCell extends Component {
  static propTypes = {
    theme: PropTypes.object,
    repoCell: PropTypes.object,
    onSelect: PropTypes.func, // 点击 小卡片
    onCollect: PropTypes.func, // 点击 小星星
  }

  constructor(props) {
    super(props)
    const { theme, repoCell } = this.props
    const { isCollected } = repoCell
    this.state = {
      theme,
      isCollected,
      collectionIcon: isCollected ? IMG_STAR : IMG_UNSTAR,
    }
  }

  componentDidMount = () => {

  }

  componentWillReceiveProps = (nextProps) => {
    if (this.state.isCollected !== nextProps.repoCell.isCollected) {
      this.setCollectionState(nextProps.repoCell.isCollected)
    }
  }

  setCollectionState = (isCollected) => {
    this.setState({
      isCollected,
      collectionIcon: isCollected ? IMG_STAR : IMG_UNSTAR,
    })
  }

  onPressHandler = () => {
    this.setCollectionState(!this.state.isCollected)
    // 调用 props 传进来的方法，将 收藏状态传递出去
    this.props.onCollect(this.props.repoCell.item, !this.state.isCollected)
  }

  renderCollectionButton = () => {
    const { theme } = this.state
    return (
      <TouchableOpacity
        style={{
          position: 'absolute', bottom: 0, right: 0, width: 54, height: 54,
        }}
        onPress={() => this.onPressHandler()}
      >
        <Image style={[styles.star, theme.styles.icon]} source={this.state.collectionIcon} />
      </TouchableOpacity>
    )
  }

  render() {
    const { repoCell, onSelect } = this.props
    const { item } = repoCell
    const { theme, isCollected } = this.state
    return (
      <TouchableOpacity
        style={styles.root}
        // this.setCollectionState 用来在 详情页面 改变收藏 状态后，同步更新 trending 页面的收藏状态
        onPress={() => onSelect(item, isCollected, this.setCollectionState)}
      >

        <View style={styles.cell_container}>

          <Text style={styles.title}>{item.fullName}</Text>

          <HTMLView
            value={`<p>${item.description}</p>`}
            FonLinkLongPress={() => { }}
            stylesheet={{ p: styles.desc, a: styles.desc }}
          />

          <Text style={{ color: theme.themeColor, marginBottom: 6 }}>{item.meta}</Text>

          <View style={styles.bottom}>

            <View style={styles.bottom_item}>
              <Text style={{ color: '#757575' }}>Build by：</Text>
              {
                item.contributors
                  .map(imgUri => (
                    <Image key={imgUri} style={styles.avatar} source={{ uri: imgUri }} />))
              }

            </View>

            <View style={{ width: 22, height: 22 }} />
          </View>
          {this.renderCollectionButton()}
        </View>

      </TouchableOpacity>
    )
  }
}
