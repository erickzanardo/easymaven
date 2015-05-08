#!/usr/bin/env node

var fs = require('fs');
var easymaven = require('./index.js');

var args = process.argv;
var cwd = process.cwd();

var pomPath = [cwd, 'pom.xml'].join('/');

if(args.length != 3) {
  console.log('Wrong usage, you must inform the artifact, example "easymaven gson"');
} else {
  fs.exists(pomPath, function(exists) {
   if(exists) {
     var artifact = args[2]
     easymaven(pomPath, artifact);
   } else {
     console.log('This is not a maven project');
   }
  });
}


