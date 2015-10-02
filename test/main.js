'use strict';

var should = require('should'),
    sinon = require('sinon'),
    path = require('path'),
    proxyquire = require('proxyquire');

describe('main', function() {
    beforeEach(function() {
        this.originalArgv = process.argv;
        this.originalCwd = process.cwd;
        process.argv = [ null, null ];
        process.cwd = sinon.spy(function() { return __dirname; });
        this.commands = {
            run: sinon.spy()
        };
    });

    afterEach(function() {
        process.argv = this.originalArgv;
        process.cwd = this.originalCwd;
    });

    it('should default to the `run` command if one is not given', function() {
        proxyquire('../main', { './commands': this.commands })();
        this.commands.run.called.should.equal(true);
    });

    it('should load the commands from the cwd', function() {
        proxyquire('../main', { './commands': this.commands })();
        process.cwd.called.should.equal(true);
    });

    it('should load the config if defined', function() {
        var called = false;
        this.commands.run = function(config) {
            called = true;
            config.should.eql({ foo: 'foo' });
        };
        process.argv = [ null, null, '--config=' + path.resolve(__dirname, 'cfg.js') ];
        proxyquire('../main', { './commands': this.commands })();
        called.should.equal(true);
    });

    [
        'argv',
        'callback',
        'commands',
        'command',
        'config'
    ].forEach(function(name) {
            it('should inject "' + name + '"', function() {
                var called = false;
                this.commands.run = function(resolver) {
                    called = true;
                    resolver.items.should.have.property(name);
                };
                proxyquire('../main', { './commands': this.commands })();
                called.should.equal(true);
            });
        });
});
