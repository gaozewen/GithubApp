import {
  AsyncStorage,
} from 'react-native'
import keysData from '../../../assets/ini/keys.json'
import langsData from '../../../assets/ini/langs.json'

export const USE_IN = {
  POPULAR: 'use_in_popular_page',
  TRENDING: 'use_in_tending_page',
}

export default class LanguageDao {
  constructor(whichPageUse) {
    this.itemKey = whichPageUse
  }

  save = (data, success, fail) => {
    AsyncStorage.setItem(this.itemKey, JSON.stringify(data), (error) => {
      if (!error) success && success() // eslint-disable-line
      else fail && fail() // eslint-disable-line
    })
  }

  /**
   * 获取所有的 自定义标签 key
   *
   * @memberof LanguageDao
   */
  fetch = () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.itemKey, (error, result) => {
        if (error) {
          reject(error)
        } else if (result) { // 没错误，且 result 不为空,即 手机数据库中有数据
          try {
            resolve(JSON.parse(result))
          } catch (err) {
            reject(err)
          }
        } else { // 手机数据库中没数据，将 初始化数据返回给用户，并保存数据
          const data = this.itemKey === USE_IN.POPULAR ? keysData : langsData
          this.save(data)
          resolve(data)
        }
      })
    })
  }
}
