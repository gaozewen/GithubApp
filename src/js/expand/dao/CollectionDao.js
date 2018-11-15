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
  * 获取用户在 (Popular/Trending) 收藏的所有 仓库
  *
  * @memberof CollectionDao
  */
  getCollectionItems() {
    return new Promise((resolve, reject) => {
      this.getCollectionKeys()
        .then((keys) => {
          const items = []
          if (keys && keys.length > 0) { // 数据库中有收藏信息
            AsyncStorage.multiGet(keys, (errArray, resultArray) => {
              try {
                resultArray.forEach((item) => {
                  // key:   item[0] - 20673212
                  // value: item[1] - "{"id":3100121,"node_id":"MDEwO...""
                  if (item[1]) items.push(JSON.parse(item[1]))
                })
                resolve(items)
              } catch (error) {
                reject(error)
              }
            })
          } else { // 数据库中没有收藏信息
            resolve(items)
          }
        })
        .catch(err => reject(err))
    })
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
