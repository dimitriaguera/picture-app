import React from 'react';
import { Provider } from 'react-redux'
import MainNavigation from './navigation/MainNavigation';
import Store from './store/Store'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <MainNavigation/>
      </Provider>
    );
  }
}

