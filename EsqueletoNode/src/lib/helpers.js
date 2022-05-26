const bcrypt = require('bcryptjs');
const pool = require('../database');
const bodyParser = require('body-parser');

const promisePool = pool.promise();

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

module.exports = {
    encryptPassword: async function(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    },
    matchPassword: async function(password, savedPassword){
        await bcrypt.compare(password, savedPassword);
    }
}




