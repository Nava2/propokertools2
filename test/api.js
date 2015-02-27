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
                table: ['ah', 'td', 'jh'],
                hands: [['ac', 'jd'], ['as', 'qs']]
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                should(res.body).have.property('id').and.be.a.String;

                done();
            });
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

                should(res.body).have.property('id').and.be.a.String;
                should(res.body).have.property('message').and.be.a.String;

                assert(/^Error/.test(res.body.message));
                done();
            });
    });

    it('should return a new ID that has a status of Running', function (done) {
        request(url)
            .post('/submit')
            .send({
                table: ['ah', 'td', 'jh'],
                hands: [['ac', 'jd'], ['as', 'qs']]
            })
            .expect('content-type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                should(res.body).have.property('id').and.be.a.String;
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

                            should(res.body).have.property('id').and.be.a.String;
                            should(res.body).have.property('message').and.be.a.String;

                            assert(!failNow);

                            if (/^Running/.test(res.body.message)) {
                                setTimeout(callReq, 100);
                            } else {
                                assert(/^\s*<div class='onesimbox'/.test(res.body.message));
                                done();
                            }
                        });
                }

                callReq();


            });

    });
});