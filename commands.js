'use strict';

const prequire = require('parent-require'),
      kj = prequire('kj');

function run(config, callback) {
    var app = kj.app(),
        host = config.host || '127.0.0.1',
        port = config.port || 3000;

    app.caller.resolver.add('$$config', config);
    app.initialize(config.modules || [], function(err) {
        if (err) {
            callback(err);
            return;
        }

        app.start(port, host, callback);
    });
}

module.exports = {
    run: run
};
