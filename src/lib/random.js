const bcrypt = require('bcryptjs');
const pool = require('../database');
const bodyParser = require('body-parser');
const colors = require('colors');


module.exports = {
    randomString: function(length){
        const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let randstring = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            randstring += characters[this.randomNum(0, charactersLength)];
        }
        return randstring;
    },
    randomNum: function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}




