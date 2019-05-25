import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image } from 'react-native';

class Diaporama extends React.Component {
    render() {
        const { pictures } = this.props;
        return (
            <View style={styles.container}>
                <Text>Diaporama</Text>
                {pictures.length ? (
                    <Image
                        source={{ uri: pictures[0].uri }}
                        style={{
                            width: pictures[0].width,
                            height: pictures[0].height
                        }}
                    />
                ) : (
                    <Text>No pictures...</Text>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});

const mapStateToProps = state => {
    return {
        pictures: state.pictures.data
    };
};

export default connect(mapStateToProps)(Diaporama);
