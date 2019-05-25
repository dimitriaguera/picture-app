import React, { Component } from 'react';
import { StyleSheet, Button, View } from 'react-native';
import { connect } from 'react-redux';
import { Camera, Permissions } from 'expo';
import { storePicture } from '../store/reducers/picturesReducer';

const SnapTools = ({
    onStorePicture,
    capturing = false,
    cameraType = CameraTypes.back,
    flashMode = CameraFlashModes.off,
    setFlashMode,
    setCameraType,
    onCaptureIn,
    onCaptureOut,
    onLongCapture,
    onShortCapture
}) => <View />;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'red'
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
)(SnapTools);
