export default class CheckUtils {
  /**
   * 检查 item 是否被收藏
   *
   * @static
   * @param {*} item
   * @param {*} collectionKeys
   * @returns
   * @memberof CheckUtils
   */
  static checkIsCollected(item, collectionKeys) {
    if (collectionKeys && collectionKeys.length > 0) {
      for (let i = 0; i < collectionKeys.length; i++) {
        const key = item.id ? item.id : item.fullName
        if (key.toString() === collectionKeys[i]) {
          return true
        }
      }
    }
    return false
  }

  /**
    * 检查项目是否过时
    * @param longTime 项目更新时间
    * @return {boolean} true 过时,false不过时
    */
  static checkIsExpired(longTime) {
    if (!longTime) return true // 不存在
    const currentDate = new Date()
    const targetDate = new Date()
    targetDate.setTime(longTime)
    if (currentDate.getMonth() !== targetDate.getMonth()) return true
    if (currentDate.getDate() !== targetDate.getDate()) return true
    if (currentDate.getHours() - targetDate.getHours() > 4) return true
    // if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
    return false
  }
}
