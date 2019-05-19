import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import Picture from '../views/Picture';
import Settings from '../views/Settings';
import Diaporama from '../views/Diaporama';

const mainNavigator = createDrawerNavigator({
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

export default createAppContainer(mainNavigator)