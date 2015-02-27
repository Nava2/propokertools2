var jade = require("jade"),
    express = require('express'),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    request = require('superagent');

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

    var hands = _.object(data.hands.map(function (hand, i) {
       return ['h' + (i + 1), hand.join('')];
    }));

    // create the post data (key value) pairs
    var postData = querystring.stringify(_.extend(baseQuery, hands, { b : data.table.join('') }));

    var sessionId = _.uniqueId('session_');
    sessions[sessionId] = "Running";

    request.post('http://www.propokertools.com/simulations/results_box')
        .send(postData)
        .end(function (err, _res) {
            if (err) throw err;

            sessions[sessionId] = _res.body;

            console.log('STATUS: ' + _res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(_res.headers));
        });

    res.json({'id' : sessionId});
});

app.get('/session/:id', function (req, res) {
    var id = req.params.id;

    console.log('/session - ID: ' + id);

    if (_.isUndefined(id)) {
        // undefined session id
        res.json({
            'id' : req.params.id,
            'message' : "Error: Unknown Session ID"
        });
        res.sendStatus(204);

        return;
    }

    // valid session id
    res.json({
        'id' : req.params.id,
        'message' : sessions[req.params.id]
    });

    //delete sessions[req.params.id];
});

app.listen(8080);