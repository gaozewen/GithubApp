import {
  AsyncStorage,
} from 'react-native'
import ThemeFactory, { THEMES } from '../../constants/Themes'

const THEME_KEY = 'theme_key'

export default class ThemeDao {
  /**
   * 获取当前的主题
   * @returns {Promise}
   */
  getTheme() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(THEME_KEY, (error, result) => {
        if (error) {
          reject(error)
          return
        }
        if (!result) {
          this.save(THEMES.Default)
          result = THEMES.Default
        }
        resolve(ThemeFactory.createTheme(result))
      })
    })
  }

  /**
   * 保存主题标识
   * @param themeColor
   */
  save(themeColor) {
    AsyncStorage.setItem(THEME_KEY, themeColor)
  }
}
