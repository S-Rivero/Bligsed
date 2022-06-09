const bcrypt = require('bcryptjs');
const pool = require('../database');
const bodyParser = require('body-parser');
const colors = require('colors');

const promisePool = pool.promise();

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}


exports.encryptPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

exports.matchPassword = async function(password, savedPassword){
    return await bcrypt.compare(password, savedPassword);
}





