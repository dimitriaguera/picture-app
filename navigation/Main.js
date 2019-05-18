import { createStackNavigator, createAppContainer } from 'react-navigation'
import Picture from '../views/Picture'

const mainStackNavigator = createStackNavigator({
  Picture: {
    screen: Picture,
    navigationOptions: {
      title: 'Pixel'
    }
  }
});

export default createAppContainer(mainStackNavigator)