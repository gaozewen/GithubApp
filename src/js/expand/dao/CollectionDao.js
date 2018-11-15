import { AsyncStorage } from 'react-native'


export const USE_IN = {
  POPULAR: 'use_in_popular_page',
  TRENDING: 'use_in_tending_page',
}

const OP = { ADD: 'add', DELETE: 'delete' }
export default class CollectionDao {
  constructor(whichPageUse) {
    this.use_in = whichPageUse
    this.keyOfCollectionKeys = `collection_${this.use_in}`
  }

  /**
   * Get All Keys Of CollectionItems
   *
   * @returns
   * @memberof CollectionDao
   */
  getCollectionKeys() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.keyOfCollectionKeys, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result))
          } catch (err) {
            reject(err)
          }
        } else {
          reject(error)
        }
      })
    })
  }

  /**
   * 收藏项目
   *
   * @param {String} key 项目id/name
   * @param {String} value 收藏的项目
   * @param {Function} callback
   * @memberof CollectionDao
   */
  collect(key, value, callback) {
    AsyncStorage.setItem(key, value, (error) => {
      if (!error) {
        this.updateCollectionKeys(key, OP.ADD, callback)
      }
    })
  }

  /**
   * 取消收藏
   *
   * @param {String} key 项目id/name
   * @param {Function} callback
   * @memberof CollectionDao
   */
  unCollect(key, callback) {
    AsyncStorage.removeItem(key, (error) => {
      if (!error) {
        this.updateCollectionKeys(key, OP.DELETE, callback)
      }
    })
  }

  /**
   * 更新本地数据库中 收藏项目的 keys
   *
   * @param {String} key 项目id/name
   * @param {*} op 增加(OP.ADD)或删除(OP.DELETE)
   * @param {Function} callback
   * @memberof CollectionDao
   */
  updateCollectionKeys(key, op, callback) {
    // 获取用户收藏的所有 项目集合
    AsyncStorage.getItem(this.keyOfCollectionKeys, (error, result) => {
      if (!error) {
        let keys = []
        if (result) {
          keys = JSON.parse(result)
        }
        const index = keys.indexOf(key)
        if (op === OP.ADD) { // 添加 key
          if (index === -1) keys.push(key)
        } else if (op === OP.DELETE) { // 删除 key
          if (index !== -1) keys.splice(index, 1)
        }
        AsyncStorage.setItem(this.keyOfCollectionKeys, JSON.stringify(keys), () => {
          if (callback) {
            callback()
          }
        })
      }
    })
  }
}
