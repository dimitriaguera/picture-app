import React, { Component } from 'react';
import { StyleSheet, WebView, View } from 'react-native';
import { connect } from 'react-redux'

class Canvas extends Component {
  constructor(props){
    super(props);

    this.state = {
      width: '',
      height: '',
    }

    this.sendStart = this.sendStart.bind(this);
    this.sendStop = this.sendStop.bind(this);
    this.sendReady = this.sendReady.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { play } = this.props;
    if(play !== nextProps.play) {
      if(nextProps.play) {
        this.sendStart();
      } else {
        this.sendStop();
      }
    }
    return false;
  }

  componentDidUpdate(prevProps) {

  }

  handleMessage(e) {
    console.log('message recieved from web', e.nativeEvent.data);
    var message = JSON.parse(e.nativeEvent.data);
    if(message.action && message.action === 'ready') {
      this.sendReady();
    }
  }

  sendReady() {
    var {width, height} = this.state;
    var message = JSON.stringify({
      action:'ready',
      params: {
        width: Math.floor(width),
        height: Math.floor(height),
      }
    });
    this.element.postMessage(message);
  }

  sendStart() {
    var message = JSON.stringify({
      action:'start',
    });
    this.element.postMessage(message);
  }

  sendStop() {
    var message = JSON.stringify({
      action:'stop',
    });
    this.element.postMessage(message);
  }

  setViewSize(event) {
    this.setState({
        width: event.nativeEvent.layout.width,
        height: event.nativeEvent.layout.height
    });
  }

  render() {
    return (
    <View style={styles.container}>
      <View onLayout={(event) => this.setViewSize(event)} style={styles.canvas}>
          <WebView
            ref={(element) => (this.element = element)}
            originWhitelist={['*']}
            javaScriptEnabled={true}
            onMessage={this.handleMessage}
            source={require('../web/canvas/canvas.html')}
          />
      </View>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  canvas: {
    flex: 1
  },
  tools: {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: 'red',
  },
  button: {
    flex: 1,
    padding: 10,
  }
});

const mapStateToProps = (state) => {
  return {
      play: state.canvas.play,
  }
}

export default connect(mapStateToProps)(Canvas);