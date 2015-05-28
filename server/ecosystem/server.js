'use strict';

var BodyParser = require('body-parser');
var Colors = require('colors/safe');
var Express = require('express');
var Morgan = require('morgan');
var Version = require('./lib/version/version');
var Env = require('./config/environment');
var Path = require('path');
var PORT = Env.PORT;

var app = Express();
app.use(BodyParser.json({ limit: '128mb'}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(Express.static(Path.join(__dirname, 'public')));
app.use(Morgan('combined'));

// curl http://localhost:3000/versions/fixtures:entrypoint/HEAD.json
app.get('/versions/:name/:tag.json', function(req, res) {
    var version = new Version();
    var name = req.params.name;
    var tag = req.params.tag;
    var url = version.getBundleURL(name, tag);
    if (url) {
        res.status(200).json({
            status: 200,
            url: url
        });
    }
    else {
        res.status(404).json({
            status: 404,
            error: 'No such version'
        });
    }
});

// curl -X POST -H "Content-Type: application/json" --data @test/fixtures/entrypoint.json http://localhost:3000/versions.json
app.post('/versions.json', function(req, res) {
    var body = req.body;
    if (!body.name || !body.files) {
        res.status(422).json({
            status: 422,
            error: 'Invalid params',
            request: body
        });
    }
    else {
        console.log('best-ecosystem: Attempting to save `' + body.name + '`');
        var version = new Version();
        version.save(body.name, body.files, function(saveErr, result) {
            if (saveErr) {
                res.status(500).json({
                    status: 500,
                    error: 'Server error',
                    request: body
                });
            }
            else {
                res.status(201).json({
                    status: 201,
                    name: result.name,
                    url: result.url,
                    tag: result.tag
                });
            }
        });
    }
});

app.listen(PORT);
console.log(Colors.green('best-ecosystem: Starting up...'));
console.log(Colors.green('best-ecosystem: Listening on port ' + PORT + '...'));
