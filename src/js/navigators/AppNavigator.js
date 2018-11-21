// import {
//   Animated, Easing,
// } from 'react-native'
import { StackNavigator } from 'react-navigation'
// Test
// import AsyncStorageTest from '../test/AsyncStorageTest'
// import WebViewTest from '../test/WebViewTest'
// import TrendingTest from '../test/TrendingTest'

// Official
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import CustomKeyPage from '../page/my/CustomKeyPage'
import SortKeyPage from '../page/my/SortKeyPage'
import RepositoryDetail from '../page/RepositoryDetail'
import AboutPage from '../page/about/AboutPage'
import WebViewPage from '../page/WebViewPage'
import AboutMePage from '../page/about/AboutMePage'
import SearchPage from '../page/search/SearchPage'
import CustomTheme from '../page/my/CustomTheme'

const AppNavigator = StackNavigator(
  {
    // TrendingTest: { screen: TrendingTest },
    WelcomePage: { screen: WelcomePage },
    HomePage: { screen: HomePage },
    CustomKeyPage: { screen: CustomKeyPage },
    SortKeyPage: { screen: SortKeyPage },
    RepositoryDetail: { screen: RepositoryDetail },
    AboutPage: { screen: AboutPage },
    WebViewPage: { screen: WebViewPage },
    AboutMePage: { screen: AboutMePage },
    SearchPage: { screen: SearchPage },
    CustomTheme: { screen: CustomTheme },
  },
  {
    navigationOptions: {
      header: null,
    },
    // transitionConfig: () => ({
    //   transitionSpec: {
    //     duration: 300,
    //     easing: Easing.out(Easing.poly(4)),
    //     timing: Animated.timing,
    //   },
    //   screenInterpolator: (sceneProps) => {
    //     const { layout, position, scene } = sceneProps
    //     const { index } = scene

    //     const height = layout.initHeight
    //     const translateX = position.interpolate({
    //       inputRange: [index - 1, index, index + 1],
    //       outputRange: [height, 0, 0],
    //     })

    //     const opacity = position.interpolate({
    //       inputRange: [index - 1, index - 0.99, index],
    //       outputRange: [0, 1, 1],
    //     })

    //     return { opacity, transform: [{ translateX }] }
    //   },
    // }),
  },
)
export default AppNavigator
