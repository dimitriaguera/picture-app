import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Canvas from '../components/Canvas';
import Tools from '../components/Tools';

export default class Particles extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Canvas />
                <Tools />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
