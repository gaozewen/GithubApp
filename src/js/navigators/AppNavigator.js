import { StackNavigator } from 'react-navigation'
// Test
// import AsyncStorageTest from '../test/AsyncStorageTest'
// Official
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'

const AppNavigator = StackNavigator(
  {
    // AsyncStorageTest: { screen: AsyncStorageTest },
    HomePage: { screen: HomePage },
    WelcomePage: { screen: WelcomePage },
  },
  {
    navigationOptions: {
      header: null,
    },
  },
)
export default AppNavigator
