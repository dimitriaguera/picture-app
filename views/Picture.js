import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Snap from '../components/Snap';

export default class Picture extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Snap />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
