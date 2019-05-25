window.document.addEventListener('DOMContentLoaded', function(e) {
    var dp, messager;
    var ready = JSON.stringify({
        action: 'ready'
    });

    messager = window.messagerBuilder();

    messager.on('ready', function(params) {
        console.log('width: ', params.width);
        console.log('height: ', params.height);
        dp = slideParticles.getInstance({
            stop: true,
            mass: 10,
            width: params.width,
            height: params.height,
            density: 450,
            particleSize: 1.5
        });
    });

    messager.on('start', function() {
        dp.start();
    });

    messager.on('stop', function() {
        dp.stop();
    });

    setTimeout(function() {
        messager.send(ready);
    }, 3000);
});
