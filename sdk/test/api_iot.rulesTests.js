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

var assert =  require('chai').assert,
    rewire = require('rewire');

var fileToTest = "../api/rest/iot.rules.js";

describe(fileToTest, function() {
    var toTest = rewire(fileToTest);
    var logger  = {
        info : function() {},
        error : function() {},
        debug : function() {}
    };
    console.debug = function() {
        console.log(arguments);
    };

    var Option = {
        CreateRuleOption:{},
        DeleteRuleOption: {},
        GetRulesOption: {},
        UpdateRuleOption: {},
        GetRuleDetailsOption: {},
        UpdateRuleStatusOption: {},
        CreateDraftRuleOption: {},
        DeleteDraftRuleOption: {},
        CloneRuleOption: {}
    };
    var httpClientMock = {
        httpRequest : {},
        httpClient: {}
    };
    var responseData = {
        statusCode : 200,
        data : ""
    };

    it('Shall create rule and Control the Response from rule creatation >', function(done) {

        var optData = {
            method: 'POST',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            accoutId : 20000,
            body: { data: "message" }
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "223"]
        };

        Option.CreateRuleOption = function (device) {
            assert.deepEqual(device, data, "The Data is not oki");
            return optData;
        };
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the option object were missed");
            cb(reData);
        };
        var callBack = function (response) {
            assert.isNotNull(response, "The Response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        };
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("adminDef.rules", Option);
        toTest.createRule(data, callBack);
    });

    it('Shall delete rule and Control the Response from rule deletion >', function(done) {

        var optData = {
            method: 'DELETE',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            accoutId : 20000,
            ruleId  : 10000,
            body: { data: "message" }
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "223"]
        };

        Option.DeleteRuleOption = function (device) {
            assert.deepEqual(device, data, "The Data is not oki");
            return optData;
        };
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the option object were missed");
            cb(reData);
        };
        var callBack = function (response) {
            assert.isNotNull(response, "The Response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        };
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("adminDef.rules", Option);
        toTest.deleteRule(data, callBack);
    });

    it('Shall send get rules request and Control the Response from rules >', function(done) {

        var optData = {
            method: 'GET',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            accoutId : 20000,
            body: { data: "message" }
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "223"]
        };

        Option.GetRulesOption = function (device) {
            assert.deepEqual(device, data, "The Data is not oki");
            return optData;
        };
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the option object were missed");
            cb(reData);
        };
        var callBack = function (response) {
            assert.isNotNull(response, "The Response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        };
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("adminDef.rules", Option);
        toTest.getRules(data, callBack);
    });

    it('Shall send update rule request and Control the Response from rule updation >', function(done) {

        var optData = {
            method: 'PUT',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            accoutId : 20000,
            ruleId: 10000,
            body: { data: "message" }
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "223"]
        };

        Option.UpdateRuleOption = function (device) {
            assert.deepEqual(device, data, "The Data is not oki");
            return optData;
        };
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the option object were missed");
            cb(reData);
        };
        var callBack = function (response) {
            assert.isNotNull(response, "The Response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        };
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("adminDef.rules", Option);
        toTest.updateRule(data, callBack);
    });

    it('Shall send get rule detail request and Control the Response from rules >', function(done) {

        var optData = {
            method: 'GET',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            accoutId : 20000,
            ruleId: 10000,
            body: { data: "message" }
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "223"]
        };

        Option.GetRuleDetailsOption = function (device) {
            assert.deepEqual(device, data, "The Data is not oki");
            return optData;
        };
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the option object were missed");
            cb(reData);
        };
        var callBack = function (response) {
            assert.isNotNull(response, "The Response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        };
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("adminDef.rules", Option);
        toTest.getRuleDetails(data, callBack);
    });

    it('Shall create rule and Control the Response from rule creatation >', function(done) {

        var optData = {
            method: 'PUT',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            accoutId : 20000,
            ruleId: 10000,
            body: { data: "message" }
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "223"]
        };

        Option.UpdateRuleStatusOption = function (device) {
            assert.deepEqual(device, data, "The Data is not oki");
            return optData;
        };
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the option object were missed");
            cb(reData);
        };
        var callBack = function (response) {
            assert.isNotNull(response, "The Response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        };
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("adminDef.rules", Option);
        toTest.updateRuleStatus  (data, callBack);
    });

    it('Shall send create rule draft and Control the Response from rule draft creatation >', function(done) {

        var optData = {
            method: 'POST',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            accoutId : 20000,
            ruleId: 10000,
            body: { data: "message" }
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "223"]
        };

        Option.CreateDraftRuleOption = function (device) {
            assert.deepEqual(device, data, "The Data is not oki");
            return optData;
        };
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the option object were missed");
            cb(reData);
        };
        var callBack = function (response) {
            assert.isNotNull(response, "The Response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        };
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("adminDef.rules", Option);
        toTest.createDraftRule(data, callBack);
    });

    it('Shall send delete rule draft and Control the Response from rule dfaft deletion >', function(done) {

        var optData = {
            method: 'POST',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            accoutId : 20000,
            ruleId: 10000,
            body: { data: "message" }
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "223"]
        };

        Option.DeleteDraftRuleOption = function (device) {
            assert.deepEqual(device, data, "The Data is not oki");
            return optData;
        };
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the option object were missed");
            cb(reData);
        };
        var callBack = function (response) {
            assert.isNotNull(response, "The Response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        };
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("adminDef.rules", Option);
        toTest.deleteDraftRule(data, callBack);
    });

    it('Shall create rule and Control the Response from rule creatation >', function(done) {

        var optData = {
            method: 'POST',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            accoutId : 20000,
            ruleId: 10000,
            body: { data: "message" }
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "223"]
        };

        Option.CloneRuleOption = function (device) {
            assert.deepEqual(device, data, "The Data is not oki");
            return optData;
        };
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the option object were missed");
            cb(reData);
        };
        var callBack = function (response) {
            assert.isNotNull(response, "The Response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        };
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("adminDef.rules", Option);
        toTest.cloneRule(data, callBack);
    });
});
