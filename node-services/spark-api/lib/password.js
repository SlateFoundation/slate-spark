'use strict';

var xkpasswd = require('xkpasswd'),
    got = require('got');

async function generateRandomPassword() {
    var password;

    try {
        password = (await got('http://www.dinopass.com/password/simple')).body;
    } catch (e) {
        console.warn('Error generating random password using dinopass:', e);
    }

    return password || xkpasswd({complexity: 2});
}

module.exports = {
    generateRandomPassword: generateRandomPassword
};
