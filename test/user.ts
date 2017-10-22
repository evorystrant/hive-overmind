import chaiHttp = require('chai-http');
import * as Chai from 'chai';
import * as Mocha from 'mocha';
import * as express from 'express';
import User from '../Models/user';
import * as Moment from 'moment';

import app from '../server';
let server;

Chai.use(chaiHttp);

let adminToken, ownerToken, userToken;

describe('User', () => {
    before(done => {
        server = app.listen(3000, done);
    });

    it(`Server is up`, done => {
        Chai.request
            .agent(server)
            .get(`/`)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(200);
                done();
            });
    })

    // ================================= Authentication ============================================

    it('Authenticate as Admin', done => {
        Chai.request
            .agent(server)
            .post(`/login`)
            .send({ name: `admin`, password: `admin` })
            .end((err, res) => {
                Chai.expect(res.status).to.equal(200);
                adminToken = res.body.token;
                done();
            });
    });
    it('Authenticate as Owner', done => {
        Chai.request
            .agent(server)
            .post(`/login`)
            .send({ name: `owner`, password: `owner` })
            .end((err, res) => {
                Chai.expect(res.status).to.equal(200)
                ownerToken = res.body.token;
                done();
            });
    });
    it('Authenticate as User', done => {
        Chai.request
            .agent(server)
            .post(`/login`)
            .send({ name: `user`, password: `user` })
            .end((err, res) => {
                Chai.expect(res.status).to.equal(200)
                userToken = res.body.token;
                done();
            });
    });

    // ==============================================================================================
    // ===================================== CRUD ===================================================
    // ==============================================================================================

    let userTest1_1 = new User(101, `test1`, `test1`, `test1`, `test1`, `test1@test1.test1`, Moment(`2017-02-01T06:00:00.00Z`).utc(false), 1, `03973852-5`, 3);
    let userTest1_2 = new User(101, `test2`, `test1`, `test2`, `test1`, `test1@test1.test2`, Moment(`2017-02-01T06:00:00.00Z`).utc(false), 1, `03973852-5`, 3);
    let userTest2_1 = new User(102, `test1`, `test1`, `test2`, `test1`, `test1@test1.test2`, Moment(`2017-02-01T06:00:00.00Z`).utc(false), 1, `03973852-5`, 3);
    let userTest2_2 = new User(102, `test2`, `test1`, `test2`, `test1`, `test1@test1.test2`, Moment(`2017-02-01T06:00:00.00Z`).utc(false), 1, `03973852-5`, 3);

    // ===================================== Create =================================================

    it(`[None] Create User`, done => {
        Chai.request
            .agent(server)
            .post(`/API/usuario`)
            .send(userTest1_1)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(401);
                done();
            })
    });
    it('[User] Create User', done => {
        Chai.request
            .agent(server)
            .post(`/API/usuario/`)
            .set('Authorization', 'bearer ' + userToken)
            .send(userTest1_1)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(403);
                done();
            });
    });
    it('[Admin] Create User', done => {
        Chai.request
            .agent(server)
            .post(`/API/usuario`)
            .set('Authorization', 'bearer ' + adminToken)
            .send(userTest1_1)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(200);
                Chai.expect(res.body).to.be.equal(`ok`);
                done();
            });
    });
    it('[Owner] Create User', done => {
        Chai.request
            .agent(server)
            .post(`/API/usuario/`)
            .set('Authorization', 'bearer ' + ownerToken)
            .send(userTest2_1)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(200);
                Chai.expect(res.body).to.be.equal(`ok`);
                done();
            });
    });

    // ===================================== Update =================================================

    it(`[None] Update User`, done => {
        Chai.request
            .agent(server)
            .put(`/API/usuario/101`)
            .send(userTest1_2)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(401);
                done();
            })
    });
    it('[User] Update User', done => {
        Chai.request
            .agent(server)
            .put(`/API/usuario/101`)
            .set('Authorization', 'bearer ' + userToken)
            .send(userTest1_1)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(403);
                done();
            });
    });
    it('[Admin] Update User', done => {
        Chai.request
            .agent(server)
            .put(`/API/usuario/101`)
            .set('Authorization', 'bearer ' + adminToken)
            .send(userTest1_2)
            .end((err, res) => {
                console.log("result", res.body);
                Chai.expect(res.status).to.equal(200);
                Chai.expect(res.body).to.be.equal(`ok`);
                done();
            });
    });
    it('[Owner] Update User', done => {
        Chai.request
            .agent(server)
            .put(`/API/usuario/102`)
            .set('Authorization', 'bearer ' + ownerToken)
            .send(userTest2_2)
            .end((err, res) => {
                console.log("result", res.body);
                Chai.expect(res.status).to.equal(200);
                Chai.expect(res.body).to.be.equal(`ok`);
                done();
            });
    });

    // ====================================== GET ===================================================

    it(`[None] Get User`, done => {
        Chai.request
            .agent(server)
            .get(`/API/usuario/101`)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(401);
                done();
            })
    });
    it('[Admin] Get User', done => {
        Chai.request
            .agent(server)
            .get(`/API/usuario/101`)
            .set('Authorization', 'bearer ' + adminToken)
            .end((err, res) => {
                let user = User.deseliarize(res.body)
                let areEqual = user.isEqualTo(userTest1_2)
                Chai.expect(res.status).to.equal(200);
                Chai.expect(areEqual).to.be.equal(true);
                done();
            });
    });
    it('[Owner] Get User', done => {
        Chai.request
            .agent(server)
            .get(`/API/usuario/102`)
            .set('Authorization', 'bearer ' + ownerToken)
            .end((err, res) => {
                let user = User.deseliarize(res.body)
                let areEqual = user.isEqualTo(userTest2_2)
                Chai.expect(res.status).to.equal(200);
                Chai.expect(areEqual).to.be.equal(true);
                done();
            });
    });
    it('[User - Other] Get User', done => {
        Chai.request
            .agent(server)
            .get(`/API/usuario/1`)
            .set('Authorization', 'bearer ' + userToken)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(403);
                done();
            });
    });
    it('[User - Self] Get User', done => {
        Chai.request
            .agent(server)
            .get(`/API/usuario/3`)
            .set('Authorization', 'bearer ' + userToken)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(200);
                let properties = Object.getOwnPropertyNames(User.default())
                Chai.expect(res.body).to.has.all.keys(properties);
                done();
            });
    });

    // ===================================== Delete =================================================

    it(`[None] Delete User`, done => {
        Chai.request
            .agent(server)
            .del(`/API/usuario/101`)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(401);
                done();
            })
    });
    it('[User] Delete User', done => {
        Chai.request
            .agent(server)
            .del(`/API/usuario/101`)
            .set('Authorization', 'bearer ' + userToken)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(403);
                done();
            });
    });
    it('[Admin] Delete User', done => {
        Chai.request
            .agent(server)
            .del(`/API/usuario/101`)
            .set('Authorization', 'bearer ' + adminToken)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(200);
                Chai.expect(res.body).to.be.equal(`ok`);
                done();
            });
    });
    it('[Owner] Delete User', done => {
        Chai.request
            .agent(server)
            .del(`/API/usuario/102`)
            .set('Authorization', 'bearer ' + ownerToken)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(200);
                Chai.expect(res.body).to.be.equal(`ok`);
                done();
            });
    });

    // ================================= All and Lookup ============================================

    it(`[None] Get All Users`, done => {
        Chai.request
            .agent(server)
            .get(`/API/usuarios`)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(401);
                done();
            })
    });
    it('[Admin] Get All Users', done => {
        Chai.request
            .agent(server)
            .get(`/API/usuarios`)
            .set('Authorization', 'bearer ' + adminToken)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(200)

                let body = res.body as Array<any>
                Chai.expect(body).to.be.a(`array`);
                Chai.expect(body.length).to.equal(100);
                done();
            });
    });
    it('[Owner] Get All Users', done => {
        Chai.request
            .agent(server)
            .get(`/API/usuarios`)
            .set('Authorization', 'bearer ' + ownerToken)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(200)

                let body = res.body as Array<any>
                Chai.expect(body).to.be.a(`array`);
                Chai.expect(body.length).to.equal(100);
                done();
            });
    });
    it('[User] Get All Users', done => {
        Chai.request
            .agent(server)
            .get(`/API/usuarios`)
            .set('Authorization', 'bearer ' + userToken)
            .end((err, res) => {
                Chai.expect(res.status).to.equal(403)
                done();
            });
    });
})