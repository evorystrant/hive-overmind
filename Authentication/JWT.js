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
const passport = require("passport");
const passportJwt = require("passport-jwt");
const jsonwebtoken = require("jsonwebtoken");
const config_1 = require("../config");
const credential_1 = require("../Models/credential");
class JWT {
    static setStrategy(app) {
        app.use(passport.initialize());
        passport.use(new passportJwt.Strategy(config_1.default.JWT_VERY_OPTION, (jwt_payload, next) => next(null, jwt_payload)));
    }
    static setLoginRoute(app) {
        app.post("/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (req.body.name == undefined && req.body.password == undefined) {
                res.status(401)
                    .json({ message: "No credential Provided" });
            }
            let users = yield credential_1.default.getAllCredentials();
            let user = users.find(user => { return user.isUser(req.body.name, req.body.password); });
            if (user != undefined) {
                let payload = { id: user.id, role: user.role };
                let token = jsonwebtoken.sign(payload, config_1.default.SECRET, config_1.default.JWT_SING_OPTIONS);
                res.json({ response: "OK", token: token });
            }
            else {
                res.status(401)
                    .json({ message: "password or username is Incorrect", response: "failed" });
            }
        }));
    }
    static authorizeTo(selfAuthorize, ...authorizedRoles) {
        return function (req, res, next) {
            const currentUserRole = Number.parseInt(req.user.role);
            let isSelfReq = selfAuthorize && Number.parseInt(req.user.id) == req.params.id;
            if (!(isSelfReq || authorizedRoles.some(x => x == currentUserRole))) {
                res.status(403)
                    .json({ message: "Cannot Access", response: "failed" });
                return;
            }
            next();
        };
    }
}
exports.default = JWT;
//# sourceMappingURL=JWT.js.map