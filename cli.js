#!/usr/bin/env node

var pointOnSurface = require('./index');
var geojsonStream = require('geojson-stream');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2), {
    string: ['output'],
    alias: { 'o': 'output' } 
});
var fs = require('fs');

var inputStream;
var outputStream;
var firstOutput = true;

if (argv.output) {
    outputStream = fs.createWriteStream(path.join(__dirname, argv.output));
} else {
    outputStream = process.stdout;
}

if (argv._[0]) {
    inputStream = fs.createReadStream(path.join(__dirname, argv._[0]), { encoding: 'utf8' }); 
} else {
    process.stdin.setEncoding('utf8');
    process.stdin.resume();
    inputStream = process.stdin;
}

outputStream.write('{ "type": "FeatureCollection", "features": [');

var processStream = inputStream.pipe(geojsonStream.parse());

processStream.on('data', function(data) {
    data = JSON.stringify(pointOnSurface(data));
    if (!firstOutput) {
        data = ",\n" + data;
    }
    firstOutput = false;
    outputStream.write(data); 
});

processStream.on('error', function(err) {
    console.error(err);
    process.exit(1);
});

processStream.on('end', function() {
    outputStream.write(']}\n')
});
