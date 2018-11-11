import { StackNavigator } from 'react-navigation'
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'

const AppNavigator = StackNavigator(
  {
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
