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

var fileToTest = "../api/rest/rules.def.js";

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
    it('Shall Return the CreateRuleOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    rules: {
                        create: '/v1/api/accounts/{accountId}/rules'
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

        var deTest = new toTest.CreateRuleOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/rules", "path improper formed");
        assert.equal(deTest.body, JSON.stringify(data.body));
        assert.equal(deTest.method, "POST", "The verb is incorrect");
        done();
    });
    it('Shall Return the DeleteRuleOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    rules: {
                        delete: '/v1/api/accounts/{accountId}/alerts/{alertId}'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            ruleId: 10000,
            alertId: 75,
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.DeleteRuleOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/rules/delete_rule_with_alerts/10000", "path improper formed");
        assert.equal(deTest.body, JSON.stringify(data.body));
        assert.equal(deTest.method, "DELETE", "The verb is incorrect");
        done();
    });
    it('Shall Return the GetRulesOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    rules: {
                        getall: '/v1/api/accounts/{accountId}/rules'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            alertId: 75,
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.GetRulesOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/rules", "path improper formed");
        assert.equal(deTest.body, null);
        assert.equal(deTest.method, "GET", "The verb is incorrect");
        done();
    });
    it('Shall Return the UpdateRuleOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    rules: {
                        update: '/v1/api/accounts/{accountId}/alerts/{alertId}/reset'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            ruleId: 10000,
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.UpdateRuleOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/rules/10000", "path improper formed");
        assert.equal(deTest.body, JSON.stringify(data.body));
        assert.equal(deTest.method, "PUT", "The verb is incorrect");
        done();
    });
    it('Shall Return the GetRuleDetailsOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    rules: {
                        getdetails: '/v1/api/accounts/{accountId}/alerts/{alertId}/status/{statusName}'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            ruleId: 10000,
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.GetRuleDetailsOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/rules/10000", "path improper formed");
        assert.equal(deTest.body, null);
        assert.equal(deTest.method, "GET", "The verb is incorrect");
        done();
    });
    it('Shall Return the UpdateRuleStatusOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    rules: {
                        update_status: '/v1/api/accounts/{accountId}/rules/{ruleId}/status'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            ruleId: 10000,
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.UpdateRuleStatusOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/rules/10000/status", "path improper formed");
        assert.equal(deTest.body, JSON.stringify(data.body));
        assert.equal(deTest.method, "PUT", "The verb is incorrect");
        done();
    });
    it('Shall Return the CreateDraftRuleOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    rules: {
                        create_draft: '/v1/api/accounts/{accountId}/rules/draft'
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

        var deTest = new toTest.CreateDraftRuleOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/rules/draft", "path improper formed");
        assert.equal(deTest.body, JSON.stringify(data.body));
        assert.equal(deTest.method, "PUT", "The verb is incorrect");
        done();
    });
    it('Shall Return the DeleteDraftRuleOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    rules: {
                        delete_draft: '/v1/api/accounts/{accountId}/rules/draft/{ruleId}'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            ruleId: 10000,
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.DeleteDraftRuleOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/rules/draft/10000", "path improper formed");
        assert.equal(deTest.body, null);
        assert.equal(deTest.method, "DELETE", "The verb is incorrect");
        done();
    });
    it('Shall Return the CloneRuleOption for Request  >', function(done) {
        var config = {
            connector: {
                rest: {
                    protocol: "http",
                    host: "myapi",
                    port: 1000,
                    rules: {
                        clone: '/v1/api/accounts/{accountId}/rules/clone/{ruleId}'
                    }
                }
            },

        };
        toTest.__set__('config', config);
        var data = {
            accountId: 20000,
            ruleId: 10000,
            body: {
                a: 1,
                b: 2,
                c: [1,2,3]
            }
        };

        var deTest = new toTest.CloneRuleOption(data);
        var urD = url.parse(deTest.url);
        assert.equal(urD.hostname, GlobalConfig.connector.rest.host, "the host data is missing");
        assert.equal(urD.port,  GlobalConfig.connector.rest.port, "the port were missing");
        assert.equal(urD.pathname, "/v1/api/accounts/20000/rules/clone/10000", "path improper formed");
        assert.equal(deTest.body, null);
        assert.equal(deTest.method, "POST", "The verb is incorrect");
        done();
    });
});