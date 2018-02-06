/*
 Copyright (c) 2017, Intel Corporation
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

var assert = require('chai').assert,
    rewire = require('rewire');

var fileToTest = "../api/rest/iot.users.js";

describe(fileToTest, function() {
    var toTest = rewire(fileToTest);
    var logger = {
        info : function() {},
        error : function() {},
        debug : function() {}
    };
    console.debug = function() {
        console.log(arguments);
    };

    var Option = {
        GetUserInfoOption: {},
        UpdateUserInfoOption: {},
        DeleteUserOption: {},
        RequestUserPasswordChangeOption: {},
        UpdateUserPasswordOption: {},
        ChangeUserPasswordOption: {},
        RequestUserActivationOption: {},
        AddUserOption: {},
        ActivateUserOption: {}
    };
    var httpClientMock = {
        httpRequest : {},
        httpClient : {}
    };
    var responseData = {
        statusCode : 200,
        data : ""
    };

    it('Shall send user params for get method to server', function(done) {

        var optData = {
            method: 'GET',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            userId: "did",
            body: {data: "message"}
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "333"]
        };

        Option.GetUserInfoOption = function(user) {
            assert.deepEqual(user, data, "The data is not oki");
            return optData;
        }
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the     it('Shall send alerts params for get method to server', function(done){option object were missed");
            cb(reData);
        }
        var callBack = function(response) {
            assert.isNotNull(response, "The response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        }
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("userAdminDef.users", Option);
        toTest.getUserInfo(data, callBack);
    });
    it('Shall update user info', function(done) {

        var optData = {
            method: 'PUT',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            userId: "did",
            body: {data: "message"}
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "333"]
        };

        Option.UpdateUserInfoOption = function(user) {
            assert.deepEqual(user, data, "The data is not oki");
            return optData;
        }
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the     it('Shall send alerts params for get method to server', function(done){option object were missed");
            cb(reData);
        }
        var callBack = function(response) {
            assert.isNotNull(response, "The response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        }
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("userAdminDef.users", Option);
        toTest.updateUserInfo(data, callBack);
    });
    it('Shall delete user', function(done) {

        var optData = {
            method: 'DELETE',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            userId: "did",
            body: {data: "message"}
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "333"]
        };

        Option.DeleteUserOption = function(user) {
            assert.deepEqual(user, data, "The data is not oki");
            return optData;
        }
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the     it('Shall send alerts params for get method to server', function(done){option object were missed");
            cb(reData);
        }
        var callBack = function(response) {
            assert.isNotNull(response, "The response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        }
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("userAdminDef.users", Option);
        toTest.deleteUser (data, callBack);
    });
    it('Shall request user password change to server', function(done) {

        var optData = {
            method: 'POST',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            userId: "did",
            body: {data: "message"}
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "333"]
        };

        Option.RequestUserPasswordChangeOption  = function(user) {
            assert.deepEqual(user, data, "The data is not oki");
            return optData;
        }
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the     it('Shall send alerts params for get method to server', function(done){option object were missed");
            cb(reData);
        }
        var callBack = function(response) {
            assert.isNotNull(response, "The response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        }
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("userAdminDef.users", Option);
        toTest.requestUserPasswordChange (data, callBack);
    });
    it('Shall send update user password to server', function(done) {

        var optData = {
            method: 'PUT',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            userId: "did",
            body: {data: "message"}
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "333"]
        };

        Option.UpdateUserPasswordOption = function(user) {
            assert.deepEqual(user, data, "The data is not oki");
            return optData;
        }
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the     it('Shall send alerts params for get method to server', function(done){option object were missed");
            cb(reData);
        }
        var callBack = function(response) {
            assert.isNotNull(response, "The response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        }
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("userAdminDef.users", Option);
        toTest.updateUserPassword (data, callBack);
    });
    it('Shall send change user password to server', function(done) {

        var optData = {
            method: 'PUT',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            userId: "did",
            body: {data: "message"}
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "333"]
        };

        Option.ChangeUserPasswordOption = function(user) {
            assert.deepEqual(user, data, "The data is not oki");
            return optData;
        }
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the     it('Shall send alerts params for get method to server', function(done){option object were missed");
            cb(reData);
        }
        var callBack = function(response) {
            assert.isNotNull(response, "The response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        }
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("userAdminDef.users", Option);
        toTest.changeUserPassword (data, callBack);
    });
    it('Shall send request user activation to server', function(done) {

        var optData = {
            method: 'POST',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            userId: "did",
            body: {data: "message"}
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "333"]
        };

        Option.RequestUserActivationOption = function(user) {
            assert.deepEqual(user, data, "The data is not oki");
            return optData;
        }
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the     it('Shall send alerts params for get method to server', function(done){option object were missed");
            cb(reData);
        }
        var callBack = function(response) {
            assert.isNotNull(response, "The response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        }
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("userAdminDef.users", Option);
        toTest.requestUserActivation (data, callBack);
    });
    it('Shall send add user request to server', function(done) {

        var optData = {
            method: 'POST',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            userId: "did",
            body: {data: "message"}
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "333"]
        };

        Option.AddUserOption = function(user) {
            assert.deepEqual(user, data, "The data is not oki");
            return optData;
        }
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the     it('Shall send alerts params for get method to server', function(done){option object were missed");
            cb(reData);
        }
        var callBack = function(response) {
            assert.isNotNull(response, "The response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        }
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("userAdminDef.users", Option);
        toTest.addUser (data, callBack);
    });
    it('Shall send activate user to server', function(done) {

        var optData = {
            method: 'POST',
            host: "myhost",
            body: "mybody"
        };

        var data = {
            userId: "did",
            body: {data: "message"}
        };
        var reData = {
            x : 10,
            y : 220,
            ar : ["222", "333"]
        };

        Option.ActivateUserOption = function(user) {
            assert.deepEqual(user, data, "The data is not oki");
            return optData;
        }
        httpClientMock.httpRequest = function (opt, cb) {
            assert.deepEqual(opt, optData, "the     it('Shall send alerts params for get method to server', function(done){option object were missed");
            cb(reData);
        }
        var callBack = function(response) {
            assert.isNotNull(response, "The response were missing");
            assert.deepEqual(response, reData, "The Data were missing");
            done();
        }
        toTest.__set__("httpClient", httpClientMock);
        toTest.__set__("userAdminDef.users", Option);
        toTest.activateUser (data, callBack);
    });
});