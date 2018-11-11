import { NavigationActions } from 'react-navigation'

export default class NavigatorUtils {
  /**
   * 跳转首页
   * @param {navigation, theme, selectedTab} params
   */
  static resetToHomePage(params) {
    const { navigation, theme, selectedTab } = params
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'HomePage',
          params: {
            theme,
            selectedTab,
          },
        }),
      ],
    })
    navigation.dispatch(resetAction)
  }
}
