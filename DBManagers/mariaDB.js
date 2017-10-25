"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const MariaClient = require("mariaSQL");
class MariaDBUtils {
    static getConnection() {
        var client = new MariaClient();
        client.connect(config_1.default.MARIADB_CONNECTION_INFO);
        return (client);
    }
}
exports.default = MariaDBUtils;
//# sourceMappingURL=mariaDB.js.map