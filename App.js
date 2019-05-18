import React from 'react';
import { StyleSheet, Text, View, WebView } from 'react-native';
import Canvas from './components/Canvas';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Canvas style={styles.canvas} />
        <View style={styles.text}>
          <Text>Open up App.js to start working on your app!</Text>
          <Text>ok!</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  canvas: {
    flex: 4,
  },
  text: {
    flex: 1,
    //backgroundColor: 'blue'
  }
});
