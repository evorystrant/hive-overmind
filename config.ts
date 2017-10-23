import * as passportJwt from "passport-jwt";
import * as jsonwebtoken from "jsonwebtoken";

export default class Config {
    public static readonly MARIADB_CONNECTION_INFO: any =
    {
        "host": "127.0.0.1",
        "port": 3366,
        "user": "root",
        "password": "Patico4ever",
        "db": "hive_test"
    };

    public static readonly SECRET: string = "n3nabgCP1ckQV9?*8W<>L;zE=Yl}pc";
    public static readonly JWT_SING_OPTIONS: jsonwebtoken.SignOptions =
    {
        expiresIn: `1d`,
        audience: "Testing-Hive"
    };
    public static readonly JWT_VERY_OPTION: passportJwt.StrategyOptions =
    {
        secretOrKey: Config.SECRET,
        jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
        audience: "Testing-Hive"
    };
}
