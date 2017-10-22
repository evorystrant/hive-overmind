// Node Modules
import * as passport from "passport";
import * as passportJwt from "passport-jwt";
import * as jsonwebtoken from "jsonwebtoken";

// Namespaces and Functions
import c_config from "../config";
import credential from "../Models/credential"

export default class JWT {
    static setStrategy(app): void {
        app.use(passport.initialize());
        passport.use(new passportJwt.Strategy(c_config.JWT_VERY_OPTION, (jwt_payload, next) => next(null, jwt_payload)));
    };

    static setLoginRoute(app): void {
        app.post("/login",
            // passport.authenticate('jwt', { successRedirect: '/', failureRedirect: '/login', failureFlash: "Please Log in to see this content", session: false}),
            async (req: any, res: any) => {

                if (req.body.name == undefined && req.body.password == undefined) {
                    res.status(401)
                        .json({ message: "No credential Provided" });
                }

                let users = await credential.getAllCredentials();
                let user = users.find(user => { return user.isUser(req.body.name, req.body.password) });

                if (user != undefined) {
                    let payload = { id: user.id, role: user.role };
                    let token = jsonwebtoken.sign(payload, c_config.SECRET, c_config.JWT_SING_OPTIONS);
                    res.json({ response: "OK", token: token });
                } else {
                    res.status(401)
                        .json({ message: "password or username is Incorrect", response: "failed" });
                }
            });
    };

    static authorizeTo(selfAuthorize: boolean, ...authorizedRoles: number[]) {
        return function (req, res, next) {
            const currentUserRole = Number.parseInt(req.user.role);

            let isSelfReq = selfAuthorize && Number.parseInt(req.user.id) == req.params.id;
            if (!(isSelfReq || authorizedRoles.some(x => x == currentUserRole))) {
                res.status(403)
                    .json({ message: "Cannot Access", response: "failed" });
                return;
            }
            next();
        }
    }
}