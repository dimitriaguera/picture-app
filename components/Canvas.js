import React, { Component } from 'react';
import { WebView, View } from 'react-native';
import htmlCanvas from '../htmlTemplates/htmlCanvas';
import scriptPaticles from '../scriptsTemplates/scriptParticles';
import scriptCanvas from '../scriptsTemplates/scriptCanvas';

class Canvas extends Component {
  runJavascript() {
    let script = '';
    script += scriptPaticles;
    script += scriptCanvas;
    return script;
  }
  render() {
    return (
    <View style={this.props.style}>
        <WebView
              originWhitelist={['*']}
              javaScriptEnabled={true}
              injectedJavaScript={this.runJavascript()}
              source={{ html: htmlCanvas }}
        />
    </View>
    );
  }
}

export default Canvas;