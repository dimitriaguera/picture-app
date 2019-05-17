import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

class Canvas extends Component {
  render() {
    return (
      <WebView
        originWhitelist={['*']}
        source={{ html: '<h1>This is a static HTML source!</h1>' }}
      />
    );
  }
}

export default Canvas;