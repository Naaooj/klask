// Transpile all code following this line with babel and use '@babel/preset-env' (aka ES6) preset
require("@babel/register")({
  presets: ["@babel/preset-env"]
});

// Import the application
module.exports = require('./server.js')