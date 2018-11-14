/**
 * GitHub 仓库小卡片
 *
 * @export
 * @class RepoCell
 */
export default class RepoCell {
  constructor(item, isCollected = false) {
    this.item = item
    this.isCollected = isCollected
  }
}
