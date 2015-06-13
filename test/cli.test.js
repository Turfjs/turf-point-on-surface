var test = require('tape');
var centroid = require('../');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

test('./cli.js --version', function(t) {
    exec(__dirname + '/../cli.js --version', function(err, stdout, stderr) {
        t.equals(stdout, require('../package.json').version+'\n', 'prints version');
        t.notok(stderr, 'no errors');
        t.end();
    });
});

test('./cli.js -v', function(t) {
    exec(__dirname + '/../cli.js --version', function(err, stdout, stderr) {
        t.equals(stdout, require('../package.json').version+'\n', 'prints version');
        t.notok(stderr, 'no errors');
        t.end();
    });
});

test('./cli.js --help', function(t) {
    exec(__dirname + '/../cli.js --help', function(err, stdout, stderr) {
        t.ok(stdout.match(/Usage/), 'Usage category');
        t.notok(stderr, 'no errors');
        t.end();
    });
});


test('./cli.js fixtures/polygons.geojson', function(t) {
    exec(__dirname + '/../cli.js /' + path.join(__dirname, '/fixtures/polygons.geojson'), function(err, stdout, stderr) {
        t.equals(stdout, '{ "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"Point","coordinates":[-79.61242675781251,37.91728415825944]},"properties":{}},\n{"type":"Feature","geometry":{"type":"Point","coordinates":[-76.33300781249999,40.20350988126112]},"properties":{}}]}\n');
        t.notok(stderr, 'no errors');
        t.end();
    });
});

test('cat | ./cli.js', function(t) {
    exec('cat ' + path.join(__dirname, '/fixtures/polygons.geojson') + ' | ' + __dirname + '/../cli.js', function(err, stdout, stderr) {
        t.notok(stderr, 'no errors');
        t.equals(stdout, '{ "type": "FeatureCollection", "features": [{"type":"Feature","geometry":{"type":"Point","coordinates":[-79.61242675781251,37.91728415825944]},"properties":{}},\n{"type":"Feature","geometry":{"type":"Point","coordinates":[-76.33300781249999,40.20350988126112]},"properties":{}}]}\n');
        t.end();
    }); 
});
