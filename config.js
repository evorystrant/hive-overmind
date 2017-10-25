"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passportJwt = require("passport-jwt");
class Config {
}
Config.MARIADB_CONNECTION_INFO = {
    "host": "127.0.0.1",
    "port": 3366,
    "user": "root",
    "password": "Patico4ever",
    "db": "hive_test"
};
Config.SECRET = "n3nabgCP1ckQV9?*8W<>L;zE=Yl}pc";
Config.JWT_SING_OPTIONS = {
    expiresIn: `1d`,
    audience: "Testing-Hive"
};
Config.JWT_VERY_OPTION = {
    secretOrKey: Config.SECRET,
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    audience: "Testing-Hive"
};
exports.default = Config;
//# sourceMappingURL=config.js.map