var jade = require("jade");
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var http = require('http');
var querystring = require('querystring');

var app = express();
app.use(bodyParser.json());

app.set('views', './views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {

    res.render('index', {pageTitle: 'wat', youAreUsingJade: true});
});

var baseQuery = {
    g : 'he',
    s : 'generic'
};

var test = {
    table: ['ah', 'td', 'jh'],
    hands: [['ac', 'jd'], ['as', 'qs']]
};

var sessions = {};

var propokerOptions = {
    hostname: 'www.propokertools.com',
    port: 80,
    path: '/simulations/results_box',
    method: 'POST'
};

/**
 * {
 *  table: ['ah', 'td', 'jh'],
 *  hands: [['ac', 'jd'], ['as, 'qs]]
 * }
 */
app.post('/submit', function (req, res) {

    req.accepts('application/json');

    var data = req.body;
    if (_.isUndefined(data.hands)) data = test;

    //  http://www.propokertools.com/simulations/results_box?g=he&s=generic&b=ackcqc&d=&h1=jckh&h2=adah&h3=&h4=&h5=&h6=
    var hands = _.object(data.hands.map(function (hand, i) {
       return ['h' + (i + 1), hand.join('')];
    }));

    var postData = querystring.stringify(_.extend(baseQuery, hands, { b : data.table.join('') }));

    var sessionId = _.uniqueId('session_');
    sessions[sessionId] = "Running";

    var _req = http.request(_.extend(propokerOptions, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Content-Length': postData.length
        }
    }), function(_res) {
        console.log('STATUS: ' + _res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(_res.headers));
        _res.setEncoding('utf8');
        _res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            // TODO parse the chunk which is html into JSON
            sessions[sessionId] = chunk;
        });
    });

    _req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        sessions[sessionId] = e.message;
    });

// write data to request body
    _req.write(postData);
    _req.end();

    res.json({'id' : sessionId});
});

app.get('/session/:id', function (req, res) {
    console.log('ID: ' + req.params.id);
    res.json({
        'id' : req.params.id,
        'message' : _.isUndefined(sessions[req.params.id]) ? "Error: Unknown Session ID" : sessions[req.params.id]
    });

    //delete sessions[req.params.id];
});

app.listen(8080);