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
const mariaDB_1 = require("../DBManagers/mariaDB");
class credentials {
    constructor(id, name, password, role) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.role = role;
    }
    static default() { return new credentials(0, "", "", 0); }
    static getAllCredentials() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                var cnx = mariaDB_1.default.getConnection();
                let results = [];
                cnx.query("SELECT u.id_usuario, cl.usuario, cl.password, u.id_rol\
                 FROM credencial_local as cl\
                 JOIN usuario AS u WHERE u.id_usuario = cl.id_usuario")
                    .on("result", res => res.on("data", row => results.push(new credentials(row["id_usuario"], row["usuario"], row["password"], row["id_rol"])))
                    .on("end", () => resolve(results))
                    .on("error", error => console.dir(error.message)))
                    .on("error", error => console.dir(error.message))
                    .on("end", () => resolve(results));
                cnx.end();
            });
        });
    }
    isUser(id, password) {
        if (typeof (id) == "string") {
            let sameName = this.name === id;
            let samePassword = this.password === password;
            return (sameName && samePassword);
        }
        else {
            return (this.id == id);
        }
    }
}
exports.default = credentials;
//# sourceMappingURL=credential.js.map