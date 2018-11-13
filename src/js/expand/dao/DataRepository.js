import { AsyncStorage } from 'react-native'
// libs
import GitHubTrending from 'GitHubTrending'


export const USE_IN = {
  POPULAR: 'use_in_popular_page',
  TRENDING: 'use_in_tending_page',
}
export default class DataRepository {
  constructor(whichPageUse) {
    this.use_in = whichPageUse
    if (whichPageUse === USE_IN.TRENDING) this.trending = new GitHubTrending()
  }

  /**
   * 获取 github 仓库数据
   *
   * @param {} url
   * @memberof DataRepository
   */
  fetchRepository = async (url) => {
    const local = await this.fetchLocalRepository(url)
    if (local && local !== null) return local
    const net = await this.fetchNetRepository(url)
    return net
  }

  /**
   * 获取 github 离线缓存的数据
   *
   * @param {*} url
   * @memberof DataRepository
   */
  fetchLocalRepository = (url) => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (!error) {
          try { // 转换的时候 json 格式不正确会报错
            resolve(JSON.parse(result)) // 因为数据库中获取的是 json 格式 字符串
          } catch (err) {
            reject(err) // 出错了告诉调用者
          }
        } else { // 从本地获取数据失败
          reject(error)
        }
      })
    })
  }

  /**
   * 获取 github 实时的数据
   *
   * @param {*} url
   * @returns
   * @memberof DataRepository
   */
  fetchNetRepository = (url) => {
    return new Promise((resolve, reject) => {
      if (this.use_in === USE_IN.POPULAR) {
        fetch(url)
          .then(resp => resp.json())
          .then((result) => {
            if (!result) {
              reject(new Error('responseData is null'))
              return
            }
            resolve(result.items)
            this.saveRespositoryToLocal(url, result.items)
          })
          .catch(err => reject(err))
      } else {
        this.trending.fetchTrending(url)
          .then((result) => {
            if (!result) {
              reject(new Error('responseData is null'))
              return
            }
            resolve(result)
            this.saveRespositoryToLocal(url, result)
          })
      }
    })
  }

  /**
   * 只保存第一页的数据
   *
   * @param {*} url
   * @param {*} items
   * @param {*} callback
   * @memberof DataRepository
   */
  saveRespositoryToLocal = (url, items, callback) => {
    if (!url || !items || !url.includes('per_page=20')) return // 不是第一页就 返回
    AsyncStorage.setItem(url, JSON.stringify(items), callback) // 只保存第一页的数据
  }
}
