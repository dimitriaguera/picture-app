import React, { Component } from 'react';
import { StyleSheet, WebView, View, Button } from 'react-native';

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
      <View style={styles.tools}>
        <View style={styles.button}>
            <Button
                onPress={this.sendStop}
                title="Stop"
                color="#841584"
                accessibilityLabel="Stop particles loop."
            />
        </View>
        <View style={styles.button}>
            <Button
                onPress={this.sendStart}
                title="Start"
                color="#841584"
                accessibilityLabel="Start particles loop."
            />
        </View>
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

export default Canvas;