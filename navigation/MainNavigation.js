import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import Particles from '../views/Particles';
import Picture from '../views/Picture';
import Settings from '../views/Settings';
import Diaporama from '../views/Diaporama';

const mainNavigator = createDrawerNavigator({
    Particles: {
        screen: Particles,
        navigationOptions: {
            title: 'Particles'
        }
    },
    Picture: {
        screen: Picture,
        navigationOptions: {
            title: 'Picture'
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

export default createAppContainer(mainNavigator);
