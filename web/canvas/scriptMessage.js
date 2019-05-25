window.messagerBuilder = function() {
    var _obj = {
        handlers: {},

        recieve: function(e) {
            var message;
            try {
                message = JSON.parse(e.data);
            } catch (err) {
                alert('failed to parse message from react-native ' + err);
                return;
            }
            _obj.proceed(message);
        },

        proceed: function(message) {
            try {
                console.log('message recieved from react native: ', message);
                var action = message.action;
                var params = message.params;
                if (action) {
                    _obj.handlers[action](params);
                }
            } catch (err) {
                console.log('pas cool', err);
                return;
            }
        },

        send: function(message) {
            if (window.hasOwnProperty('postMessage')) {
                console.log('send message from web: ', message);
                window.postMessage(message, '*');
            } else {
                console.log('unable to find postMessage');
            }
        },

        on: function(action, handler) {
            this.handlers[action] = handler;
        },

        init: function() {
            window.document.addEventListener('message', _obj.recieve);
            return _obj;
        }
    };
    return _obj.init();
};
