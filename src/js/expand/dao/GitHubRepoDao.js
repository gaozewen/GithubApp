import { AsyncStorage } from 'react-native'
// libs
import GitHubTrending from 'GitHubTrending'


export const USE_IN = {
  POPULAR: 'use_in_popular_page',
  TRENDING: 'use_in_tending_page',
  MY_GITHUB_PROJECT: 'use_in_my_github_project',
}
export default class GitHubRepoDao {
  constructor(whichPageUse) {
    this.use_in = whichPageUse
    if (whichPageUse === USE_IN.TRENDING) this.trending = new GitHubTrending()
  }

  /**
   * 获取 github 仓库数据
   *
   * @param {*} url
   * @memberof GitHubRepoDao
   */
  fetchRepository = async (url) => {
    const localWrapData = await this.fetchLocalRepository(url)
    if (localWrapData && localWrapData !== null) return localWrapData
    const netOriginData = await this.fetchNetRepository(url)
    return netOriginData
  }

  /**
   * 获取 github 离线缓存的数据
   *
   * @param {*} url
   * @memberof GitHubRepoDao
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
   * @memberof GitHubRepoDao
   */
  fetchNetRepository = (url) => {
    return new Promise((resolve, reject) => {
      if (this.use_in !== USE_IN.TRENDING) { // popular 页面 或 我的开源项目 页面
        fetch(url)
          .then(resp => resp.json())
          .then((result) => {
            if (this.use_in === USE_IN.MY_GITHUB_PROJECT && result) { // my
              this.saveRespositoryToLocal(url, result)
              resolve(result)
            } else if (result && result.items) { // popular
              this.saveRespositoryToLocal(url, result.items)
              resolve(result.items)
            } else {
              reject(new Error('responseData is null'))
            }
          })
          .catch(err => reject(err))
      } else {
        this.trending.fetchTrending(url)
          .then((result) => {
            if (result) {
              this.saveRespositoryToLocal(url, result)
              resolve(result)
            } else {
              reject(new Error('responseData is null'))
            }
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
   * @memberof GitHubRepoDao
   */
  saveRespositoryToLocal = (url, items, callback) => {
    if (!url || !items || (!url.includes('per_page=20') && !url.includes('crazycodeboy'))) return // 不是第一页就 返回
    let wrapData
    if (this.use_in === USE_IN.MY_GITHUB_PROJECT) {
      wrapData = { item: items, update_date: new Date().getTime() }
    } else {
      wrapData = { items, update_date: new Date().getTime() }
    }
    AsyncStorage.setItem(url, JSON.stringify(wrapData), callback) // 只保存第一页的数据
  }
}
