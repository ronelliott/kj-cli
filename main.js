'use strict';

const minimist = require('minimist'),
      argv = minimist(process.argv.slice(2)),
      fs = require('fs'),
      path = require('path'),
      reflekt = require('reflekt'),
      requireDirectory = require('require-directory');

module.exports = function(commands) {
    var command,
        commandName = argv._[0] || 'run',
        config = {},
        loadCommandsPath = path.resolve(process.cwd(), 'commands');

    commands = commands || require('./commands');

    if (fs.existsSync(loadCommandsPath)) {
        Object.assign(commands, requireDirectory({
            require: require
        }, loadCommandsPath));
    }

    command = commands[commandName];

    if (!command) {
        console.error('Unknown command: %s', commandName);
        return;
    }

    if (argv.config) {
        config = require(path.resolve(argv.config));
    }

    reflekt.call(command, {
        argv: argv,
        callback: callback,
        commands: commands,
        command: command,
        config: config
    });

    function callback(err) {
        if (err) throw err;
    }
};
