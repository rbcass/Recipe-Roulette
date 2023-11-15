//generates random string for key
const crypto = require('crypto');

function randomString(length){
    return crypto.randomBytes(Math.ceil(length /2))
    .toString('hex')
    .slice(0, length)
}

module.exports = {
    randomString,
};