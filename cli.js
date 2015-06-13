#!/usr/bin/env node

var pointOnSurface = require('./index');
var geojsonStream = require('geojson-stream');
var pack = require('./package.json');
var path = require('path');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2), {
    string: ['output'],
    boolean: ['verison', 'help'],
    alias: {
        'o': 'output', 
        'v': 'version'
    }
});

if (argv.version) {
    console.log(pack.version);
    process.exit(0);
}

if (argv.help) {
    console.log('Usage: ./cli.js [OPTIONS] [FILE]');
    console.log('  Find point-on-surface of every feature in a FeatureCollections');
    console.log('Examples:');
    console.log('  cat file.geojson | ./cli.js');
    console.log('  ./cli.js file.geojson --output new.geojson');
    console.log('Options:');
    console.log('  (-o|--output) [FILE]    outputs to file - defaults is stdout');
    console.log('  -v|--version            prints the program version');
    console.log('  --help                  prints this message');
    process.exit(0);
}

var inputStream;
var outputStream;
var firstOutput = true;

if (argv.output) {
    outputStream = fs.createWriteStream(path.resolve(process.cwd(), argv.output));
} else {
    outputStream = process.stdout;
}

if (argv._[0]) {
    inputStream = fs.createReadStream(path.resolve(process.cwd(), argv._[0]), { encoding: 'utf8' }); 
} else {
    process.stdin.setEncoding('utf8');
    process.stdin.resume();
    inputStream = process.stdin;
}

var processStream = inputStream.pipe(geojsonStream.parse());

processStream.on('data', function(data) {
    data = JSON.stringify(pointOnSurface(data));
    if (!firstOutput) {
        data = ",\n" + data;
    } else {
        outputStream.write('{ "type": "FeatureCollection", "features": [');
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
