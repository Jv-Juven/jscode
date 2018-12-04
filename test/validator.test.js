import validator from '../lib/validator';
// var assert = require('assert');
var expect = require('expect.js');
describe('validator', function () {
    describe('入参为枚举值', function () {
        describe('内置规则函数验证——字符串规则', function () {
            it('isNumber -- true', function () {
                expect(undefined).to.be(validator.check('666', 'isNumber', '非数字')[0]);
            });
            it('isNumber -- false', function () {
                expect('非数字').to.be.equal(validator.check('666aaa', 'isNumber', '非数字')[0]);
            });
        });
        describe('内置规则函数验证——多重字符串规则', function () {
            it('isNumber|validateURL -- false|false', function () {
                expect(['非数字', '非合法uri']).to.eql(validator.check('aaa', 'isNumber|validateURL', {
                    isNumber: '非数字',
                    validateURL: '非合法uri'
                }));
            });
            it('isNumber|validateURL -- true|false', function () {
                expect(['非合法uri']).to.eql(validator.check('666', 'isNumber|validateURL', {
                    isNumber: '非数字',
                    validateURL: '非合法uri'
                }));
            });
            it('isNumber|validateURL -- false|true', function () {
                expect(['非数字']).to.eql(validator.check('https://npmjs.org', 'isNumber|validateURL', {
                    isNumber: '非数字',
                    validateURL: '非合法uri'
                }));
            });
        });
        describe('内置规则函数验证——自定义函数规则', function () {
            it('常规写法：值不大于6——true', function () {
                expect(undefined).to.be(validator.check(9, function (value) {
                    return value > 6;
                }, '必须大于6')[0]);
            });
            it('常规写法：值不大于6——false', function () {
                expect('必须大于6').to.be.equal(validator.check(3, function (value) {
                    return value > 6;
                }, '必须大于6')[0]);
            });
            it('返回对象：值不大于6——true', function () {
                expect(undefined).to.be(validator.check(9, function (value) {
                    return {
                        valid: value > 6,
                        errorMsg: '必须大于6'
                    };
                })[0]);
            });
            it('返回对象：值不大于6——false', function () {
                expect('必须大于6').to.be.equal(validator.check(3, function (value) {
                    return {
                        valid: value > 6,
                        errorMsg: '必须大于6'
                    };
                })[0]);
            });
        });
    });
    describe('入参为对象', function () {
        describe('内置规则函数验证——字符串规则', function () {
            it('isNumber -- true', function () {
                expect(undefined).to.be(validator.check({
                    value: '666', 
                    rules: 'isNumber',
                    errorMsgs: '非数字'
                })[0]);
            });
            it('isNumber -- false', function () {
                expect('非数字').to.be.equal(validator.check({
                    value: '666aaa', 
                    rules: 'isNumber',
                    errorMsgs: '非数字'
                })[0]);
            });
            it('min:6 -- true', function () {
                expect(undefined).to.be(validator.check({
                    value: '666adsfgd', 
                    rules: 'min:6',
                    errorMsgs: '至少6位字符串'
                })[0]);
            });
            it('min:6 -- false', function () {
                expect('至少6位字符串').to.be.equal(validator.check({
                    value: '666', 
                    rules: 'min:6',
                    errorMsgs: '至少6位字符串'
                })[0]);
            });
            it('validateURL -- true', function () {
                expect(undefined).to.be(validator.check({
                    value: 'https://github.com', 
                    rules: 'validateURL',
                    errorMsgs: '非合法uri'
                })[0]);
            });
            it('validateURL -- false', function () {
                expect('非合法uri').to.be.equal(validator.check({
                    value: 'htt://github.com', 
                    rules: 'validateURL',
                    errorMsgs: '非合法uri'
                })[0]);
            });
        });
        describe('内置规则函数验证——自定义函数规则', function () {
            it('常规写法：值不大于6——true', function () {
                expect(undefined).to.be(validator.check({
                    value: 9,
                    rules: function (value) {
                        return value > 6;
                    },
                    errorMsgs: '必须大于6'
                })[0]);
            });
            it('常规写法：值不大于6——false', function () {
                expect('必须大于6').to.be.equal(validator.check({
                    value: 3,
                    rules: function (value) {
                        return value > 6;
                    },
                    errorMsgs: '必须大于6'
                })[0]);
            });
            it('返回对象：值不大于6——true', function () {
                expect(undefined).to.be(validator.check({
                    value: 9,
                    rules: function (value) {
                        return {
                            valid: value > 6,
                            errorMsg: '必须大于6'
                        };
                    }
                })[0]);
            });
            it('返回对象：值不大于6——false', function () {
                expect('必须大于6').to.be.equal(validator.check({
                    value: 3,
                    rules: function (value) {
                        return {
                            valid: value > 6,
                            errorMsg: '必须大于6'
                        };
                    }
                })[0]);
            });
        });
    });
    describe('入参为对象数组', function () {
        it('结果为 false', function () {
            expect(['非数字', '必须小写字母', '必须小于100', '不可大于100']).to.eql(validator.check([
                {
                    value: '666aaa', 
                    rules: 'isNumber',
                    errorMsgs: '非数字'
                },
                {
                    value: 'AA', 
                    rules: 'validateLowerCase',
                    errorMsgs: '必须小写字母'
                },
                {
                    value: 'https://npmjs.org', 
                    rules: 'validateURL',
                    errorMsgs: '非法uri'
                },
                {
                    value: 100,
                    rules: function (value) {
                        return value < 100;
                    },
                    errorMsgs: '必须小于100'
                },
                {
                    value: 99,
                    rules: function (value) {
                        return value < 100;
                    },
                    errorMsgs: '必须小于100'
                },
                {
                    value: 101,
                    rules: function (value) {
                        return {
                            valid: value <= 100,
                            errorMsg: '不可大于100'
                        }
                    },
                    errorMsgs: '必须小于等于100'
                },
                {
                    value: 100,
                    rules: function (value) {
                        return {
                            valid: value <= 100,
                            errorMsg: '不可大于100'
                        }
                    },
                    errorMsgs: '必须小于等于100'
                }
            ]));
        });
    });    
});