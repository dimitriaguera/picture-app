import React, { Component } from 'react';
import { StyleSheet, Button, View } from 'react-native';
import { connect } from 'react-redux'
import { playCanvas, stopCanvas } from '../store/reducers/canvasReducer';

class Tools extends Component {
    constructor(props) {
        super(props);
        this.togglePlay = this.togglePlay.bind(this);
    }

    togglePlay() {
        const { play, onPlay, onStop } = this.props;
        if( !play ) {
            onPlay();
        } else {
            onStop();
        }
    }

    render() {
        const { play } = this.props;
        return (
        <View style={styles.container}>
                <Button
                    onPress={this.togglePlay}
                    title={play ? 'Stop' :'Play'}
                    color={styles.element.color}
                    accessibilityLabel={play ? 'Stop particles loop.' : 'Start particles'}
                />
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
  },
  element: {
    color: '#841584'
  }
});

const mapStateToProps = (state) => {
  return {
      play: state.canvas.play,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onPlay: () => { dispatch(playCanvas()) },
    onStop: () => { dispatch(stopCanvas()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tools)