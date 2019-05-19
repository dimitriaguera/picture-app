import React, { Component } from 'react';
import { StyleSheet, Button, View } from 'react-native';

class Tools extends Component {
    onPressStop() {
        alert('Stop');
    }

    render() {
        return (
        <View style={styles.container}>
            <View style={styles.button}>
                <Button
                    onPress={this.onPressStop}
                    title="Stop"
                    color="#841584"
                    accessibilityLabel="Stop particles loop."
                />
            </View>
            <View style={styles.button}>
                <Button
                    onPress={this.onPressStop}
                    title="Start"
                    color="#841584"
                    accessibilityLabel="Start particles loop."
                />
            </View>
        </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: 'red',
  },
  button: {
    flex: 1,
    padding: 10,
  }
});

export default Tools