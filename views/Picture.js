import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Canvas from '../components/Canvas';
import Tools from '../components/Tools';
import Snap from '../components/Snap';

export default class Picture extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Canvas />
        <Snap />
        <Tools />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});