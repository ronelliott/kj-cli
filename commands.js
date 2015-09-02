'use strict';

var prequire = require('parent-require'),
    kj = prequire('kj');

function run(config, callback) {
    var app = kj.app();

    app.initialize(config.modules || [], function(err) {
        if (err) {
            callback(err);
            return;
        }

        app.start(config.port || 3000, callback);
    });
}

module.exports = {
    run: run
};
