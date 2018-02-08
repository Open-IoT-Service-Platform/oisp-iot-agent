/*
 Copyright (c) 2018, Intel Corporation

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
var assert =  require('chai').assert;
rewire = require('rewire'),
url = require('url');

var GlobalConfig = require('../config');

var fileToTest = "../api/rest/control.def.js";

describe(fileToTest, function() {
    var toTest = rewire(fileToTest);
    var logger = {
        info : function() {},
        error : function()  {},
        debug : function() {}
    };
    console.debug = function() {
        return "Bearer" + token;
    };
    function makeTokenBearer (token) {
        return "Bearer " + token;
    };
    it('Shall Return the SendActuationCommandOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    control: {
                        send_actuation_command: '/v1/api/accounts/{accountId}/control'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.SendActuationCommandOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/control", "path improper formed");
        assert.equal(deTest.body, JSON.stringify(data.body));
        assert.equal(deTest.method, "POST", "The verb is incorrect");
        done();
    });
    it('Shall Return the SaveComplexCommandOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    control: {
                        save_complex_command: '/v1/api/accounts/{accountId}/control/commands/{commandName}'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            commandName: "FlashingLight",
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.SaveComplexCommandOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/control/commands/FlashingLight", "path improper formed");
        assert.equal(deTest.body, JSON.stringify(data.body));
        assert.equal(deTest.method, "POST", "The verb is incorrect");
        done();
    });
    it('Shall Return the GetComplexCommandsOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    control: {
                        get_complex_commands: '/v1/api/accounts/{accountId}/control/commands/'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.GetComplexCommandsOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/control/commands/", "path improper formed");
        assert.equal(deTest.body, undefined);
        assert.equal(deTest.method, "GET", "The verb is incorrect");
        done();
    });
    it('Shall Return the DeleteComplexCommandOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    control: {
                        delete_complex_command: '/v1/api/accounts/{accountId}/control/commands/{commandName}'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            commandName: "FlashingLight",
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.DeleteComplexCommandOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/control/commands/FlashingLight", "path improper formed");
        assert.equal(deTest.body, undefined);
        assert.equal(deTest.method, "DELETE", "The verb is incorrect");
        done();
    });
    it('Shall Return the UpdateComplexCommandOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    control: {
                        update_complex_command: '/v1/api/accounts/{accountId}/control/commands/{commandName}'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            commandName: "FlashingLight",
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.UpdateComplexCommandOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/control/commands/FlashingLight", "path improper formed");
        assert.equal(deTest.body, JSON.stringify(data.body));
        assert.equal(deTest.method, "PUT", "The verb is incorrect");
        done();
    });
    it('Shall Return the ActuationsOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    control: {
                        actuations: '/v1/api/accounts/{accountid}/control/devices/{deviceid}'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            deviceId: 10000,
            commandName: "FlashingLight",
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.ActuationsOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/control/devices/10000", "path improper formed");
        assert.equal(deTest.body, undefined);
        assert.equal(deTest.method, "GET", "The verb is incorrect");
        done();
    });
});