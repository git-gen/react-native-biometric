import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';

const Root = createStackNavigator(
  {
    Page1: {
      screen: Page1,
      navigationOptions: {
        header: null
      },
    },
    Page2: {
      screen: Page2,
      navigationOptions: {
        header: null
      },
    },
  },
  {
    initialRouteName: 'Page1',
  }
);

const Navigator = createAppContainer(Root);

export default Navigator
