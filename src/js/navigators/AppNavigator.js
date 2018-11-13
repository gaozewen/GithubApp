// import {
//   Animated, Easing,
// } from 'react-native'
import { StackNavigator } from 'react-navigation'
// Test
// import AsyncStorageTest from '../test/AsyncStorageTest'
// import WebViewTest from '../test/WebViewTest'
// Official
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import CustomKeyPage from '../page/my/CustomKeyPage'
import SortKeyPage from '../page/my/SortKeyPage'
import RepositoryDetail from '../page/RepositoryDetail'

const AppNavigator = StackNavigator(
  {
    // WebViewTest: { screen: WebViewTest },
    HomePage: { screen: HomePage },
    WelcomePage: { screen: WelcomePage },
    CustomKeyPage: { screen: CustomKeyPage },
    SortKeyPage: { screen: SortKeyPage },
    RepositoryDetail: { screen: RepositoryDetail },
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
