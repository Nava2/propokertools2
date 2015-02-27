var express = require('express'),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    request = require('superagent');

var http = require('http');
var querystring = require('querystring');

var app = express();
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 8080));
app.use(express.static(__dirname + '/public'));

/* ***********************************
 * Static routes
 * ***********************************/

 app.get('/', function (err, res) {
     var options = {
         root: __dirname + '/public/',
         dotfiles: 'deny',
         headers: {
             'x-timestamp': Date.now(),
             'x-sent': true
         }
     };

     res.sendFile('index.html', options, function (err) {
         if (err) {
             console.log(err);
             res.status(err.status).end();
         }
     });
});

/* ***********************************
 * REST API for circumventing cross-browser requests
 * ***********************************/

var baseQuery = {
    g : 'he',
    d : '',
    s : 'generic'
};

var test = {
    table: ['ah', 'td', 'jh'],
    hands: [['ac', 'jd'], ['as', 'qs']]
};

var sessions = {};

/**
 * Expected input: {
 *  table: ['ah', 'td', 'jh'],
 *  hands: [['ac', 'jd'], ['as, 'qs]]
 * }
 */
app.post('/submit', function (req, res) {

    req.accepts('application/json');

    var data = req.body;
    if (_.isUndefined(data.hands)) data = test;

    var hands = _.chain(_.range(1, 7)).map(function(i) {
        if (i <= data.hands.length) {
            return ['h' + (i), data.hands[i - 1].join('')];
        }

        return ['h' + i, ''];
    }).object().value();

    // create the post data (key value) pairs
    var postData = querystring.stringify(_.extend(baseQuery, hands, { b : data.table.join('') }));

    var sessionId = _.uniqueId('session_');
    sessions[sessionId] = "Running";

    request.post('http://www.propokertools.com/simulations/results_box')
        .set('content-length', postData.length)
        .set('X-Requested-With', 'XMLHttpRequest') // required
        .send(postData)
        .end(function (res) {
            if (res.error)
                throw res.error;

            sessions[sessionId] = res.text; // html

            //console.log('STATUS: ' + _res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(_res.headers));
        });

    res.json({'id' : sessionId});
});

/**
 * Find out of the request completed
 */
app.get('/status/:id', function (req, res) {
    var id = req.params.id;

    if (_.isUndefined(sessions[id])) {
        // undefined session id
        res.json({
                'id' : req.params.id,
                'message' : "Error: Unknown Session ID"
            });

        return;
    }

    // valid session id
    res.json({
        'id' : req.params.id,
        'message' : sessions[id]
    });

    //delete sessions[req.params.id];
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});