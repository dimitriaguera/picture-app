import React, { Component } from 'react';
import { StyleSheet, Button, View } from 'react-native';
import { connect } from 'react-redux';
import { Camera, Permissions } from 'expo';
import { storePicture } from '../store/reducers/picturesReducer';

class Snap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            type: Camera.Constants.Type.back
        };
        this.snap = this.snap.bind(this);
    }

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    async snap() {
        if (this.camera) {
            let picture = await this.camera.takePictureAsync();
            console.log(picture.uri);
            this.props.onStorePicture(picture);
        }
    }

    render() {
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={styles.container}>
                    <Camera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.camera}
                        type={this.state.type}
                    />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'red'
    },
    button: {
        flex: 1,
        padding: 10
    },
    camera: {
        flex: 1
    },
    element: {
        color: '#841584'
    }
});

const mapDispatchToProps = dispatch => {
    return {
        onStorePicture: picture => {
            dispatch(storePicture(picture));
        }
    };
};

export default connect(
    null,
    mapDispatchToProps
)(Snap);
