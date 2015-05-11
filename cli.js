#!/usr/bin/env node

var fs = require('fs');
var easymaven = require('./index.js');

var args = process.argv;
var cwd = process.cwd();

var pomPath = [cwd, 'pom.xml'].join('/');

if(args.length != 3) {
  console.log('Wrong usage, you must inform the artifact, example "easymaven gson"');
} else {
  fs.open(pomPath, "r+", function(error) {
    if(!error) {
      var artifact = args[2];
      easymaven(pomPath, artifact);
    } else {
      switch(error.code) {
        case "EACCES":
          console.error("Can't open", pomPath);
          break;
        default:
          console.error('This is not a Maven project')
      }
    }
  });
}


