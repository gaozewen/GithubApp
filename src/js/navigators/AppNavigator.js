// import {
//   Animated, Easing,
// } from 'react-native'
import { StackNavigator } from 'react-navigation'
// Test
// import AsyncStorageTest from '../test/AsyncStorageTest'
// Official
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import CustomKeyPage from '../page/my/CustomKeyPage'
import SortKeyPage from '../page/my/SortKeyPage'

const AppNavigator = StackNavigator(
  {
    // AsyncStorageTest: { screen: AsyncStorageTest },
    HomePage: { screen: HomePage },
    WelcomePage: { screen: WelcomePage },
    CustomKeyPage: { screen: CustomKeyPage },
    SortKeyPage: { screen: SortKeyPage },
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
