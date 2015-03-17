/*eslint max-nested-callbacks: 0, no-proto: 0*/
/*global describe, it*/
'use strict';

var Core = require('fist/core/core');
var Track = require('fist/core/track');

var assert = require('assert');
var logger = require('loggin');

function getAgent(params) {
    var app = new Core(params);

    app.logger.conf({
        logLevel: 'SILENT'
    });

    app.install(require.resolve('../_fistlabs_unit_serial'));
    return app;
}

describe('fist_plugins/units/_fistlabs_unit_serial', function () {
    it('Should run unit step by step', function (done) {
        var agent = getAgent();
        var track = new Track(agent, logger);

        agent.unit({
            base: '_fistlabs_unit_serial',
            name: 'serial',
            series: ['foo', 'bar'],
            foo: function () {
                return 1;
            },
            bar: function (t, context) {
                return context.prev + 1;
            }
        });

        agent.ready().done(function () {
            track.invoke('serial').done(function (res) {
                assert.strictEqual(res, 2);
                done();
            });
        });
    });

    it('Should stop running series if track was flushed', function (done) {
        var agent = getAgent();
        var track = new Track(agent, logger);

        agent.unit({
            base: '_fistlabs_unit_serial',
            name: 'serial',
            series: ['foo', 'bar'],
            foo: function (t) {
                t.isFlushed = function () {
                    return true;
                };
                return 1;
            },
            bar: function (t, context) {
                return context.prev + 1;
            }
        });

        agent.ready().done(function () {
            track.invoke('serial').done(function (res) {
                assert.strictEqual(res, 1);
                done();
            });
        });
    });

    it('Should run fallback if step failed', function (done) {
        var agent = getAgent();
        var track = new Track(agent, logger);

        agent.unit({
            base: '_fistlabs_unit_serial',
            name: 'serial',
            series: ['foo', 'bar'],
            foo: function () {
                throw 1;
            },
            efoo: function (t, context) {
                assert.strictEqual(context.prev, 1);
                return 42;
            },
            bar: function (t, context) {
                return context.prev + 1;
            }
        });

        agent.ready().done(function () {
            track.invoke('serial').done(function (res) {
                assert.strictEqual(res, 42);
                done();
            });
        });
    });

    it('Should be rejected if no fallback provided', function (done) {
        var agent = getAgent();
        var track = new Track(agent, logger);

        agent.unit({
            base: '_fistlabs_unit_serial',
            name: 'serial',
            series: ['foo', 'bar'],
            foo: function () {
                throw 1;
            },
            bar: function (t, context) {
                return context.prev + 1;
            }
        });

        agent.ready().done(function () {
            track.invoke('serial').done(null, function (err) {
                assert.strictEqual(err, 1);
                done();
            });
        });
    });

    it('Should resolve unit if no series left', function (done) {
        var agent = getAgent();
        var track = new Track(agent, logger);

        agent.unit({
            base: '_fistlabs_unit_serial',
            name: 'serial',
            series: ['foo', 'bar'],
            foo: function (t, context) {
                context.series.clear();
                return 1;
            },
            bar: function (t) {
                return t.prev + 1;
            }
        });

        agent.ready().done(function () {
            track.invoke('serial').done(function (res) {
                assert.strictEqual(res, 1);
                done();
            });
        });
    });
});
