import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View, Clipboard, Linking,
  // StyleSheet, Text, Image, Dimensions,
} from 'react-native'
// utils
import ViewUtils from '../../utils/ViewUtils'
import ToastUtils from '../../utils/ToastUtils'
// constants
import { MENU } from '../../constants/Menu'
// commons
import AboutCommon, { ABOUT_IN } from './AboutCommon'
// imgs
import IMG_DOWN from '../../../assets/images/ic_tiaozhuan_down.png'
import IMG_UP from '../../../assets/images/ic_tiaozhuan_up.png'
import IMG_CODE from '../../../assets/images/ic_code.png'
import IMG_CONTACT from '../../../assets/images/ic_contacts.png'

const PAGE_MENU = {
  REPOSITORY: '开源项目',
  BLOG: {
    name: '技术博客',
    items: {
      PERSONAL_BLOG: {
        title: '个人博客',
        url: 'http://jiapenghui.com',
      },
      CSDN: {
        title: 'CSDN',
        url: 'http://blog.csdn.net/fengyuzhengfan',
      },
      JIANSHU: {
        title: '简书',
        url: 'http://www.jianshu.com/users/ca3943a4172a/latest_articles',
      },
      GITHUB: {
        title: 'GitHub',
        url: 'https://github.com/crazycodeboy',
      },
    },
  },
  CONTACT: {
    name: '联系方式',
    items: {
      QQ: {
        title: 'QQ',
        account: '1586866509',
      },
      Email: {
        title: 'Email',
        account: 'crazycodeboy@gmail.com',
      },
    },
  },
  QQ: {
    name: '技术交流群',
    items: {
      MD: {
        title: '移动开发者技术分享群',
        account: '335939197',
      },
      RN: {
        title: 'React Native学习交流群',
        account: '165774887',
      },
    },
  },
}
export default class AboutMePage extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.aboutCommon = new AboutCommon(props, state => this.updateState(state),
      ABOUT_IN.ABOUT_AUTHOR)
    this.state = {
      repoCellArray: [],
      isShowRepos: false,
      isShowBlog: false,
      isShowQQ: false,
      isShowContact: false,
    }
  }

  componentDidMount = () => {
    this.aboutCommon.componentDidMount()
  }

  updateState = (state) => {
    this.setState(state)
  }

  getClickIcon = (isShow) => {
    return isShow ? IMG_UP : IMG_DOWN
  }

  /**
   * 显示列表数据
   * @param {*} dic 字典
   * @param {*} isShowAccount
   */
  renderItems = (dic, isShowAccount) => {
    if (!dic) return null
    const views = []
    Object.keys(dic).forEach((key) => {
      const title = isShowAccount ? `${dic[key].title}:${dic[key].account}` : dic[key].title
      views.push(
        <View key={key}>
          {ViewUtils.getSettingItem(() => this.onClick(dic[key]), null, title, { tintColor: '#2196F3' })}
        </View>,
      )
    })
    return views
  }

  onClick = (tab) => {
    const { navigation } = this.props
    let routeName
    let params
    switch (tab) {
      case PAGE_MENU.BLOG:
        this.updateState({ isShowBlog: !this.state.isShowBlog })
        break
      case PAGE_MENU.BLOG.items.PERSONAL_BLOG:
      case PAGE_MENU.BLOG.items.CSDN:
      case PAGE_MENU.BLOG.items.JIANSHU:
      case PAGE_MENU.BLOG.items.GITHUB:
        routeName = 'WebViewPage'
        params = {
          title: tab.title,
          url: tab.url,
        }
        break
      case PAGE_MENU.REPOSITORY:
        this.updateState({ isShowRepos: !this.state.isShowRepos })
        break
      case PAGE_MENU.QQ:
        this.updateState({ isShowQQ: !this.state.isShowQQ })
        break
      case PAGE_MENU.QQ.items.MD:
      case PAGE_MENU.QQ.items.RN:
        Clipboard.setString(tab.account)
        ToastUtils.showShort(`QQ群号:${tab.account}已复制到剪切板`)
        break
      case PAGE_MENU.CONTACT:
        this.updateState({ isShowContact: !this.state.isShowContact })
        break
      case PAGE_MENU.CONTACT.items.QQ:
        Clipboard.setString(tab.account)
        ToastUtils.showShort(`QQ:${tab.account}已复制到剪切板`)
        break
      case PAGE_MENU.CONTACT.items.Email:
        Linking.canOpenURL(`mailto://${tab.account}`).then((supported) => {
          if (!supported) {
            console.log(`Can't handle url:mailto://${tab.account}`)
          } else {
            Linking.openURL(`mailto://${tab.account}`)
          }
        })
        break
      default:
        break
    }
    if (routeName) {
      navigation.navigate(routeName, params)
    }
  }

  render() {
    const params = {
      name: 'CrazyCodeBoy',
      description: '专注移动开发，分享知识，共享快乐。',
      avatar: 'http://avatar.csdn.net/1/1/E/1_fengyuzhengfan.jpg',
      backgroundImg: 'http://www.devio.org/io/GitHubPopular/img/for_githubpopular_about_me.jpg',
    }
    const {
      isShowBlog, isShowRepos, repoCellArray, isShowQQ, isShowContact,
    } = this.state
    const content = (
      <View>
        {ViewUtils.getSettingItem(() => this.onClick(PAGE_MENU.BLOG), MENU.Website.icon,
          PAGE_MENU.BLOG.name, { tintColor: '#2196F3' }, this.getClickIcon(isShowBlog))}
        {isShowBlog ? this.renderItems(PAGE_MENU.BLOG.items) : null}

        {ViewUtils.getSettingItem(() => this.onClick(PAGE_MENU.REPOSITORY), IMG_CODE,
          PAGE_MENU.REPOSITORY, { tintColor: '#2196F3' }, this.getClickIcon(isShowRepos))}
        {isShowRepos ? this.aboutCommon.renderRepoCells(repoCellArray) : null}

        {ViewUtils.getSettingItem(() => this.onClick(PAGE_MENU.QQ), MENU.Website.icon,
          PAGE_MENU.QQ.name, { tintColor: '#2196F3' }, this.getClickIcon(isShowBlog))}
        {isShowQQ ? this.renderItems(PAGE_MENU.QQ.items, true) : null}

        {ViewUtils.getSettingItem(() => this.onClick(PAGE_MENU.CONTACT), IMG_CONTACT,
          PAGE_MENU.CONTACT.name, { tintColor: '#2196F3' }, this.getClickIcon(isShowContact))}
        {isShowContact ? this.renderItems(PAGE_MENU.CONTACT.items, true) : null}
      </View>
    )
    return this.aboutCommon.render(params, content)
  }
}
