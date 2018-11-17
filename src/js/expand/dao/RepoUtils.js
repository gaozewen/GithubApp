// dao
import GitHubRepoDao, { USE_IN } from './GitHubRepoDao'
// utils
import CheckUtils from '../../utils/CheckUtils'

export default class RepoUtils {
  constructor(aboutCommon) {
    this.aboutCommon = aboutCommon
    this.gitHubRepoDao = new GitHubRepoDao(USE_IN.MY_GITHUB_PROJECT)
    this.map = new Map()
  }

  /**
   * 更新数据
   * @param {*} k
   * @param {*} v 数据结构 网络：item:{} 本地 wrapData: {item,update_date}
   */
  updateData(k, v) {
    this.map.set(k, v)
    const items = []
    this.map.forEach((value) => { // (value, key, map)
      items.push(value.item ? value.item : value)
    })
    this.aboutCommon.onNotifyDataChanged(items)
  }

  /**
   * 获取指定 url 下的数据 并更新
   * @param {String} url
   */
  async fetchRepo(url) {
    let result = await this.gitHubRepoDao.fetchRepository(url)
    if (result) { // 本地数据 或 网络数据
      this.updateData(url, result)
      // 网络数据 没有 被 wrap 所以没有 update_date 所以默认为 true
      if (CheckUtils.checkIsExpired(result.update_data)) {
        result = await this.gitHubRepoDao.fetchNetRepository(url)
        if (result) {
          this.updateData(url, result)
        }
      }
    }
  }

  /**
   * 批量获取 urls 对应的数据 并更新
   * @param {Array} urls
   */
  fetchRepoList(urls) {
    urls.forEach((url) => { this.fetchRepo(url) })
  }
}
