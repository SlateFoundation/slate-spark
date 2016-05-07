'use strict';

var xkpasswd = require('xkpasswd'),
    request = require('koa-request');

function* generateRandomPassword() {
    var password;

    try {
        password = (yield request({url: 'http://www.dinopass.com/password/simple'})).body;
    } catch (e) {
        console.warn('Error generating random password using dinopass:', e);
    }

    return password || xkpasswd({complexity: 2});
}

module.exports = {
    generateRandomPassword: generateRandomPassword
};