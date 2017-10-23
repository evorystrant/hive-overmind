import c_config from "../config";
import * as MariaClient from "mariaSQL";

export default class MariaDBUtils {
    static getConnection() {
        /// <summary>
        /// returns a conection to MariaDB with the given configuration
        /// </summary>
        /// <returns type="">MariaDB Conection</returns>
        var client = new MariaClient();
        client.connect(c_config.MARIADB_CONNECTION_INFO);
        return (client);
    }

}

