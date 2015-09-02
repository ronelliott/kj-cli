'use strict';

var should = require('should'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire');

describe('commands', function() {
    describe('run', function() {
        beforeEach(function() {
            var self = this;

            this.initialize = sinon.spy(function(mods, callback) {
                callback();
            });

            this.start = sinon.spy(function(port, callback) {
                callback();
            });

            this.kj = {
                app: sinon.spy(function() {
                    return {
                        initialize: self.initialize,
                        start: self.start
                    };
                })
            };

            this.run = proxyquire('../commands', {
                'parent-require': function() {
                    return self.kj;
                }
            }).run;
        });

        it('should initialize the app with the given modules', function(done) {
            var self = this,
                config = { modules: [ 'foo' ] };
            this.run(config, function(err) {
                should(err).not.be.ok();
                self.initialize.called.should.equal(true);
                done();
            });
        });

        it('should start the app with the given port', function(done) {
            var self = this,
                config = { port: 4444 };
            this.run(config, function(err) {
                should(err).not.be.ok();
                self.start.called.should.equal(true);
                self.start.calledWith(4444).should.equal(true);
                done();
            });
        });

        it('should use port 3000 if no port is defined', function(done) {
            var self = this,
                config = {};
            this.run(config, function(err) {
                should(err).not.be.ok();
                self.start.called.should.equal(true);
                self.start.calledWith(3000).should.equal(true);
                done();
            });
        });
    });
});
