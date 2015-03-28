var express = require('express'),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    request = require('superagent'),
    cheerio = require('cheerio');

var http = require('http');
var querystring = require('querystring');

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 8080));
app.use(express.static(__dirname + '/public'));

/* ***********************************
 * Static routes
 * ***********************************/

var indexModel = {
    cards : [
        {short:"A", long:"Ace"},
        {short:"2", long:"Two"},
        {short:"3", long:"Three"},
        {short:"4", long:"Four"},
        {short:"5", long:"Five"},
        {short:"6", long:"Six"},
        {short:"7", long:"Seven"},
        {short:"8", long:"Eight"},
        {short:"9", long:"Nine"},
        {short:"T", long:"Ten"},
        {short:"J", long:"Jack"},
        {short:"Q", long:"Queen"},
        {short:"K", long:"King"}
    ],

    suits : [
        {short:"C", long:"Clubs" },
        {short:"D", long:"Diamonds" },
        {short:"H", long:"Hearts" },
        {short:"S", long:"Spades" }
    ],

    show_modal_attributes: function (id, numCards) {
        return {
            'data-toggle': 'modal',
            'data-target': '#cardPicker',
            'data-playerid': 'p' + id,
            'data-numcards': numCards
        };
    }
};

 app.get('/', function (err, res) {
     res.render('index', indexModel);
});

/* ***********************************
 * REST API for circumventing cross-browser requests
 * ***********************************/

var baseQuery = {
    g : 'he',
    d : '',
    s : 'generic'
};

var sessions = {};


var parseHTMLResult = (function () {

    var R_TRIALS = /((?:\d{1,3},)*\d{1,3})\s+trials\s+\((\w+)\)/;
    var R_CARD_STR = '(?:[1-9tjqka][scdh]|(?:100|\\d?\\d)%)';
    var R_BOARD = new RegExp('board:\\s+((?:' + R_CARD_STR + ')*)');
    var R_CARD_CAP = new RegExp('(' + R_CARD_STR + ')');

    function splitHand(input) {
        return _.compact(input.split(R_CARD_CAP));
    }

    return function __parseHTMLResult(html) {
        var $ = cheerio.load(html);

        var o = {};
        var trialsResult = R_TRIALS.exec($('.pptSimTrials').text());
        o.trials = Number(trialsResult[1].replace(/,/g, ''));
        o.exhaustive = trialsResult[2] === 'Exhaustive';

        var boardStrSpl = R_BOARD.exec($('.pptBoard').text());
        if (boardStrSpl == null) {
            o.board = { };
        } else {
            var tableCards = splitHand(boardStrSpl[1]);
            o.board = {
                flop: _.first(tableCards, 3),
                turn: tableCards[3],
                river: tableCards[4]
            };
        }

        var A = 'A'.charCodeAt(0);

        var $rows = $(".pptSimTable tr[class^='simRow']");
        o.hands = _.chain(_.range(0, 6)).map(function (i) {
                if (i < $rows.length) {
                    return $($rows[i]);
                } else {
                    return undefined;
                }
            })
            .map(function (row) {
                if (row) {
                    return {
                        hand: splitHand($('.pptSpec', row).text()),
                        equity: Number($('.pptEV', row).text().slice(0, -1)),
                        wins: Number($('.pptWinsHi', row).text().replace(/,/g, '')),
                        ties: Number($('.pptTiesHi', row).text().replace(/,/g, ''))
                    };
                } else {
                    return {};
                }
            }).value();

        return o;
    };
})();

/**
 * Expected input: {
 *  table: ['ah', 'td', 'jh'],
 *  hands: [['ac', 'jd'], ['as', 'qs']]
 * }
 */
app.post('/submit', function (req, res) {

    if (!req.is('json')) {
        res.sendStatus(406);
        return;
    }

    var data = req.body;

    if (!_.isObject(data) ||
        (!_.isArray(data.hands))) {
        res.sendStatus(400);

        return;
    }

    // default the table
    data = _.defaults(data, { table: {} });

    var hands = _.chain(_.range(1, 7)).map(function(i) {
        if (i <= data.hands.length) {
            return ['h' + (i), data.hands[i - 1].join('')];
        }

        return ['h' + i, ''];
    }).object().value();

    var postObj = _.extend(baseQuery, hands, {
        b : _.flatten(['', data.table.flop, data.table.turn, data.table.river], true).join('')
    });
    // create the post data (key value) pairs
    var postQuery = querystring.stringify(postObj);

    var sessionId = _.uniqueId('session_');
    sessions[sessionId] = "Running";

    request.post('http://www.propokertools.com/simulations/results_box')
        .set('content-length', postQuery.length)
        .set('X-Requested-With', 'XMLHttpRequest') // required
        .send(postQuery)
        .end(function (res) {
            if (res.error)
                throw res.error;

            try {
                var result = parseHTMLResult(res.text); // html
                var maxEquity = { idx: -1, value: 0 };
                _.each(result.hands, function (hand, i) {
                    if (hand.equity > maxEquity.value) {
                        maxEquity.value = hand.equity;
                        maxEquity.idx = i;
                    }
                });
                result.hands[maxEquity.idx].winner = true;

                var resIdx = 0;
                var orderedHands = [];
                _.each(data.hands, function (h) {
                    if (h.length > 0) {
                        orderedHands.push(result.hands[resIdx++]);
                    } else {
                        orderedHands.push({});
                    }
                });

                _.each(_.range(data.hands.length, 6), function () {
                    orderedHands.push({});
                });

                result.hands = orderedHands;

                sessions[sessionId] = result;

                console.log('session complete: ' + sessionId);
            } catch (err) {
                console.log('error: ' + err);
                console.log('input:', postObj);
                sessions[sessionId] = "Error: Invalid response from server";
            }


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