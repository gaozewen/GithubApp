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
    for (let i = 0; i < collectionKeys.length; i++) {
      const key = item.id ? item.id : item.fullName
      if (key.toString() === collectionKeys[i]) {
        return true
      }
    }
    return false
  }
}
