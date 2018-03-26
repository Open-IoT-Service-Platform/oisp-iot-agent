/*
Copyright (c) 2014, Intel Corporation

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


process.env.NODE_ENV = 'test';
var assert = require('assert'),
    sinon = require('sinon'),
    rewire = require('rewire'),
    utils = require("../lib/utils").init(),
    logger = require("@open-iot-service-platform/oisp-sdk-js").lib.logger.init(utils),
    common = require('../lib/common'),
    schemaValidation = require('../lib/schema-validator'),
    configurator = require('../admin/configurator'),
    configurator_test = rewire("../admin/configurator.js");
var sinonTestFactory = require('sinon-test');
var sinonTest = sinonTestFactory(sinon);


var fakeconfigdata = {
    "default_connector": "rest+ws"
};

var fakecommon = {
    getConfig: function() {
        return fakeconfigdata;
    },
    saveToUserConfig: function(key, value) {},
    saveToDeviceConfig: function(key, value) {}
};

var fakepath = {
    join: function() {},
    resolve: function() {}
};

var fakefs = {
    exists: function(dir, cb) {
        cb(true);
    },
    readdirSync: function(thispath) {
        return {
            forEach: function(cb) {
                cb("./data");
            },
            length: 0
        }
    },
    writeFileSync: function() {},
    rmdirSync: function() {},
    unlinkSync: function() {},
    readFileSync: function() {}
};

describe('oisp-agent/lib/utils', function() {
    it('should get external info', sinonTest(function(done) {
        var toTest = rewire("../lib/utils.js");
        var res = {
            statusCode: 200,
            setEncoding: function(data) {},
            on: function(data, cb) {
                cb('{"name":"hello"}');
            }
        }
        var httpMock = {
            request: function(opt, cb) {
                cb(res);
                return {
                    end: function() {}
                };
            }
        };
        toTest.__set__("http", httpMock);
        var iotkitutils = toTest.__get__("IoTKitUtils");
        iotkitutils.prototype.getExternalInfo(function(
            data) {
            assert(data, {
                name: 'hello',
                ip_local: '10.0.2.4'
            }, 'err data');
        });
        done();
    }));

    it('should generate a valid device Id', function(done) {
        utils.getDeviceId(function(id) {
            assert(id, 'id is null');
            this.deviceId = id;
            done();
        });
    });

    it('should generate a valid IP', function(done) {
        var ip = utils.getIPs();
        assert(ip, 'ip is null');
        done();
    });

    it('should return agents attribute', function(done) {
        var agentattr = utils.getAgentAttr();
        assert(agentattr, 'agents attribute is null');
        //console.log(agentattr);
        done();
    });

    it('should get data directory', function(done) {
        var key = "connector";
        utils.getDataDirectory(key, function(data) {
            assert(data,
                'config for data directory error');
            done();
        })
    });

    it('should get minutes and seconds from miliseconds', function(done) {
        var timestamp = 1234567;
        var correctresult = {
            m: 20,
            s: '35'
        };
        var timeresult = utils.getMinutesAndSecondsFromMiliseconds(
            timestamp)
        assert.equal(timeresult.m, correctresult.m,
            'error minutes');
        assert.equal(timeresult.s, correctresult.s,
            'error seconds');
        done();
    });

    it('should get gate way id', function(done) {
        var timeresult = utils.getGatewayId(deviceId, function(
            data) {
            assert.equal(data, '08-00-27-9d-89-e5',
                'error id');
            done();
        })
    });
});

describe('oisp-agent/admin/configurator', function() {
    it('should set listener udp port', sinonTest(function(done) {
        var savetouserconfig = this.stub(common,
            'saveToUserConfig');
        var setlistenerudpport = configurator_test.__get__(
            "setListenerUdpPort");
        setlistenerudpport(65, function(port, err) {
            assert.equal(err, undefined,
                'error exist')
        });
        assert.equal(savetouserconfig.callCount, 1,
            'called times error')
        done();
    }));

    it('should set data directory', sinonTest(function(done) {
        var setdatadirectory = configurator_test.__get__(
            "setDataDirectory");
        configurator_test.__set__("fs", fakefs);
        var savetoglobalconfig = this.stub(common,
            'saveToGlobalConfig');
        setdatadirectory('', function() {});
        assert.equal(savetoglobalconfig.callCount, 1,
            'called times error');
        done();
    }));

    it('should move data directory', sinonTest(function(done) {
        var movedatadirectory = configurator_test.__get__(
            "moveDataDirectory");
        configurator_test.__set__("fs", fakefs);
        configurator_test.__set__("path", fakepath);
        var savetoglobalconfig = this.stub(common,
            'saveToGlobalConfig');
        var moveDDreadspy = sinon.spy(fakefs, 'readdirSync');
        movedatadirectory('', function(cb) {})
        assert.equal(moveDDreadspy.callCount, 4,
            'called times error');
        assert.equal(savetoglobalconfig.callCount, 1,
            'called times error')
        done();
    }));

    it('should generate a valid gatewayId', function(done) {
        var getgatewayid = configurator_test.__get__("getGatewayId");
        getgatewayid(function(id) {
            assert(id, 'id is null');
            assert.notEqual(id, '');
            this.gatewayId = id;
            done();
        });
    });

    it('should set and get last actuations pull time', sinonTest(
        function(done) {
            var setlastactuationspulltime = configurator_test.__get__(
                "setLastActuationsPullTime");
            configurator_test.__set__("common", fakecommon);
            var saveToDeviceConfigspy = this.stub(fakecommon,
                'saveToDeviceConfig');
            setlastactuationspulltime('time_test');
            assert(saveToDeviceConfigspy.calledOnce,
                'called times error');
            done();
        }));

    it('should set the cloud hostname for the current protocol',
        sinonTest(
            function(done) {
                var sethostfor = configurator_test.__get__(
                    "setHostFor");
                configurator_test.__set__("common", fakecommon);

                var saveToUserConfigspy = this.stub(fakecommon,
                    'saveToUserConfig');
                sethostfor("https://127.0.0.1", 80);

                assert(saveToUserConfigspy.calledTwice,
                    'called times error');

                fakeconfigdata.default_connector = "rest";
                sethostfor("https://127.0.0.1", 80);
                assert.equal(saveToUserConfigspy.callCount, 5,
                    'called times error');
                done();
            }));

    it('should set proxy for the current protocol', sinonTest(function(
        done) {
        var port_proxy_float = 5698.4;
        var port_proxy_large = 100000;
        var host_proxy = 6666;
        var port_proxy_ok = 904;

        var setproxy = configurator_test.__get__("setProxy");
        var saveToUserConfigspy = this.spy(fakecommon,
            'saveToUserConfig');

        setproxy(host_proxy, port_proxy_float, function(
            proxy, err) {
            assert.equal(err,
                'Port value must be an integer',
                'incorrect error check');
        });
        setproxy(host_proxy, port_proxy_large, function(
            proxy, err) {
            assert.equal(err,
                'Port value out of valid range',
                'incorrect error check');
        });
        setproxy(host_proxy, port_proxy_ok, function(proxy,
            err) {
            assert.equal(err, undefined,
                'incorrect error check');
            assert.equal(saveToUserConfigspy.callCount,
                4, 'called times error');
        });
        done();
    }));

    it('should reset proxy for the current protocol', sinonTest(
        function(done) {
            var resetproxy = configurator_test.__get__(
                "resetProxy");
            var saveToUserConfigspy = sinon.spy(fakecommon,
                'saveToUserConfig');
            resetproxy();
            assert.equal(saveToUserConfigspy.callCount, 4,
                'called times error');
            done();
        }));

});

describe('oisp-agent/lib/schemaValidation', function() {
    it('should success validate', function(done) {
        var result
        var obj = "aaa";
        var schema = {
            "$schema": "http://json-schema.org/draft-03/schema#",
            "pattern": "^a*$"
        };
        assert.deepEqual(schemaValidation.validate(obj, schema), []);
        done();
    });

    it('should fail validate', function(done) {
        var result
        var obj = {};
        var schema = {
            "type": "boolean"
        };
        //console.log(schemaValidation.validate(obj, schema));
        assert.notEqual(schemaValidation.validate(obj, schema), []);
        done();
    });

    it('should return if validation of data and schema meets errors',
        function(
            done) {
            var result
            var data = 1;
            var schema = {
                "type": "integer"
            };
            assert.equal(schemaValidation.validateSchema(schema)(
                data), true);
            done();
        });

    it('should format a valid error message from errors array',
        function(done) {
            var errors = [{
                customMessage: 'n must be at least 4 characters long'
            }, {
                customMessage: 't is missing'
            }];
            schemaValidation.parseErrors(errors, function(msg) {
                assert(msg, 'msg is null');
                assert.equal(msg,
                    'name must be at least 4 characters long, type is missing'
                );
                done();
            });
        });

    it('should return empty error message from empty array', function(
        done) {
        var errors = [];
        schemaValidation.parseErrors(errors, function(msg) {
            //assert(msg, 'msg is null');
            assert.equal(msg, '');
            done();
        });
    });
});
