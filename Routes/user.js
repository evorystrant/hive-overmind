"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const passport = require("passport");
const JWT_1 = require("../Authentication/JWT");
const user_1 = require("../Models/user");
let router = express.Router();
router
    .route(`/usuarios/`)
    .get(passport.authenticate("jwt", { session: false }), JWT_1.default.authorizeTo(false, 1, 2), (req, res) => __awaiter(this, void 0, void 0, function* () { return res.json(yield user_1.default.getAll()); }))
    .post(passport.authenticate("jwt", { session: false }), JWT_1.default.authorizeTo(false, 1), (req, res) => __awaiter(this, void 0, void 0, function* () { return res.json(yield user_1.default.find(req.param(`lookFor`, `~`))); }));
router
    .route(`/usuario/`)
    .post(passport.authenticate(`jwt`, { session: false }), JWT_1.default.authorizeTo(false, 1, 2), (req, res) => __awaiter(this, void 0, void 0, function* () {
    return yield user_1.default.deseliarize(req.body)
        .create()
        .catch(error => { console.log(error); res.status(400); res.send({ error: error }); })
        .then(result => res.json(result));
}));
router
    .route(`/usuario/:id/`)
    .get(passport.authenticate("jwt", { session: false }), JWT_1.default.authorizeTo(true, 1, 2), (req, res) => __awaiter(this, void 0, void 0, function* () {
    return yield user_1.default
        .get(Number.parseInt(req.params.id))
        .catch(error => { console.log(error); res.status(400).send(error); })
        .then(result => res.json(result));
}))
    .put(passport.authenticate(`jwt`, { session: false }), JWT_1.default.authorizeTo(false, 1, 2), (req, res) => __awaiter(this, void 0, void 0, function* () {
    return yield user_1.default.deseliarize(req.body)
        .update(Number.parseInt(req.params.id))
        .catch(error => { console.log(error); res.status(400).send(error); })
        .then(result => res.json(result));
}))
    .delete(passport.authenticate(`jwt`, { session: false }), JWT_1.default.authorizeTo(false, 1, 2), (req, res) => __awaiter(this, void 0, void 0, function* () {
    return yield user_1.default.delete(Number.parseInt(req.params.id))
        .catch(error => { console.log(error); res.status(400).send(error); })
        .then(result => res.json(result));
}));
exports.default = router;
//# sourceMappingURL=user.js.map