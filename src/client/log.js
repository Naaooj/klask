"use strict";

const Log = module.exports = {
    log: function(text, color) {
        console.log(`%c ${text}`, `color: ${color}`);
    }
};

Log.info = function(text) {
    this.log(text, '#169913');  
};

Log.error = function(text) {
    this.log(text, '#e1251e');
}