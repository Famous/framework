var bodyParser = require('body-parser')
var express = require('express');

var app = express();
app.use(bodyParser.json())

var bundle = require('./lib/bundle');

var PORT = 3000;

app.get('/bundles/:name/:version.json', function(req, res) {
    var name = req.params['name'];
    var version = req.params['version'];
    var url = bundle.getURL(name, version);
    if (url) {
        res.json({
            url: url
        });        
    }
    else {
        res.status(404).json({
            error: 'No such bundle'
        });
    }
});

app.post('/bundles', function(req, res) {
    var body = req.body;
    if (!body.name || !body.version || !body.files) {
        res.send(422).json({
            error: 'Invalid params'
        });
    }
    else {
        bundle.create(body.name, body.version, body.files, function(err, result) {
            res.status(201).json({
                url: bundle.getURL(body.name, body.version)
            });
        });
    }
});

app.listen(PORT);
console.log('Listening on port ' + PORT + '...');
