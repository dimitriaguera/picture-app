import { createStackNavigator, createAppContainer } from 'react-navigation';
import Picture from '../views/Picture';
import Settings from '../views/Settings';
import Diaporama from '../views/Diaporama';

const mainStackNavigator = createStackNavigator({
  Picture: {
    screen: Picture,
    navigationOptions: {
      title: 'Pixel'
    }
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      title: 'Settings'
    }
  },
  Diaporama: {
    screen: Diaporama,
    navigationOptions: {
      title: 'Diaporama'
    }
  }
});

export default createAppContainer(mainStackNavigator)