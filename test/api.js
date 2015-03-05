var assert  = require("assert"),
    should  = require('should'),
    request = require('supertest'),
    app     = require('../app.js');

var url = 'localhost:8080';

describe('/submit POST', function () {
    it('should return an ID in JSON format', function (done) {
        request(url)
            .post('/submit')
            .send({
                table: {
                   flop: ['ah', 'td', 'jh']
                },
                hands: [['ac', 'jd'], ['as', 'qs']]
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                res.body.should.have.property('id').and.be.a.String;

                done();
            });
    });

    it('with no table should return an ID in JSON format', function (done) {
        request(url)
            .post('/submit')
            .send({
                hands: [['ac', 'jd'], ['as', 'qs']]
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                res.body.should.have.property('id').and.be.a.String;

                done();
            });
    });

    it('with no hands should fail with 400', function (done) {
        request(url)
            .post('/submit')
            .send({ })
            .expect(400)
            .end(done);
    });

    it('with no data should fail with 400', function (done) {
        request(url)
            .post('/submit')
            .set('content-type', 'application/json')
            .send()
            .expect(400)
            .end(done);
    });

    it('with invalid data format should fail with 406', function (done) {
        request(url)
            .post('/submit')
            .send()
            .expect(406)
            .end(done);
    });
});

describe('/status GET', function () {
    it('should return Error on undefined ID', function (done) {
        request(url)
            .get('/status/baaaaad')
            .send()
            .expect(200)
            .expect('content-type', /json/)
            .end(function (err, res) {
                if (err) throw err;

                res.body.should.have.property('id').and.be.a.String;
                res.body.should.have.property('message').and.be.a.String;

                assert(/^Error/.test(res.body.message));
                done();
            });
    });

    it('should return a new ID that has a status of Running', function (done) {
        request(url)
            .post('/submit')
            .send({
                table: {
                    flop: ['ah', 'td', 'jh'],
                    turn: 'jd',
                    river: 'qd'
                },
                hands: [['ac', 'as'], ['90%']]
            })
            .expect('content-type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                res.body.should.have.property('id').and.be.a.String;
                var id = res.body.id;

                var failNow = false;
                setTimeout(function () { failNow = true; }, 400);

                function callReq() {
                    request(url)
                        .get('/status/' + id)
                        .send()
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }

                            var body = res.body;

                            body.should.have.property('id').and.match(/session_/);
                            body.should.have.property('message');

                            assert(!failNow);

                            if (/^Running/.test(res.body.message)) {
                                setTimeout(callReq, 100);


                            } else {
                                var msg = body.message;
                                msg.should.have.property('board');
                                msg.should.have.property('exhaustive').equal(true);
                                msg.should.have.property('hands').with.lengthOf(2);
                                msg.should.have.property('trials').and.be.equal(849);

                                var board = msg.board;
                                board.should.have.property('flop').containDeep(['ah', 'td', 'jh']);
                                board.should.have.property('turn').be.equal('jd');
                                board.should.have.property('river').be.equal('qd');

                                msg.hands.forEach(function (h) {
                                    h.should.have.property('hand').be.an.Array;
                                    h.hand.length.should.be.within(1, 2);
                                    h.should.have.property('equity').be.within(0, 100.0);
                                    h.should.have.property('wins').be.Number;
                                    h.should.have.property('ties').be.Number;
                                });

                                msg.hands.should.containEql({
                                        hand: [
                                            "ac",
                                            "as"
                                        ],
                                        equity: 99.53,
                                        wins: 845,
                                        ties: 0
                                    }).and.containEql({
                                        hand: [
                                            "90%"
                                        ],
                                        equity: 0.47,
                                        wins: 4,
                                        ties: 0
                                    });

                                done();
                            }
                        });
                }

                callReq();


            });

    });
});