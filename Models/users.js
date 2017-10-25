"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mariaDB_1 = require("../DBManagers/mariaDB");
class USER {
}
USER.TB_USER_NAME = 'usuario';
USER.TB_ROLE_NAME = `rol`;
USER.ID = `id_usuario`;
USER.FIRST_NAME = `primer_nombre`;
USER.MIDDLE_NAME = `segundo_nombre`;
USER.FIRST_SURNAME = `primer_apellido`;
USER.SECOND_SURNAME = `segundo_apellido`;
USER.EMAIL = `email`;
USER.BIRTHDATE = `fecha_nacimiento`;
USER.GENDER = `gender`;
USER.DUI = `dui`;
USER.ROLE = `id_rol`;
class User {
    constructor(id, first_name, middle_name, first_surname, second_surname, email, birthdate, gender, DUI, role) {
        this.id = id;
        this.first_name = first_name;
        this.middle_name = middle_name;
        this.first_surname = first_surname;
        this.second_surname = second_surname;
        this.email = email;
        this.birthdate = birthdate;
        this.gender = gender;
        this.DUI = DUI;
        this.role = role;
    }
    static newFromQuery(queryRes) {
        return new User(Number.parseInt(queryRes[USER.ID]), queryRes[USER.FIRST_NAME], queryRes[USER.MIDDLE_NAME], queryRes[USER.FIRST_SURNAME], queryRes[USER.SECOND_SURNAME], queryRes[USER.EMAIL], new Date(queryRes[USER.BIRTHDATE]), queryRes[USER.GENDER] == `\u0000` ? `Femenino` : `Masculino`, queryRes[USER.DUI], Number.parseInt(queryRes[USER.ROLE]));
    }
    static default() { return new User(-1, "", "", "", "", "", new Date(), `Femenino`, "", -1); }
    static find(lookfor) {
        return new Promise(function (resolve, reject) {
            let cnx = mariaDB_1.default.getConnection();
            let results = [];
            cnx.query(` MATCH (${USER.FIRST_NAME}, ${USER.MIDDLE_NAME}, ${USER.FIRST_SURNAME}, ${USER.SECOND_SURNAME}, ${USER.DUI}) 
                        AGAINST (${lookfor})`)
                .on('result', res => res.on('data', row => results.push(User.newFromQuery(row)))
                .on("end", () => resolve(results))
                .on("error", reject))
                .on("error", reject)
                .on("end", () => resolve(results));
            cnx.end();
        });
    }
    static getAll() {
        return new Promise(function (resolve, reject) {
            let cnx = mariaDB_1.default.getConnection();
            let results = [];
            cnx.query(`SELECT * FROM ${USER.TB_USER_NAME}`)
                .on('result', res => res.on('data', row => results.push(User.newFromQuery(row)))
                .on("end", () => resolve(results))
                .on("error", reject))
                .on("error", reject)
                .on("end", () => resolve(results));
            cnx.end();
        });
    }
    static get(userId) {
        return new Promise(function (resolve, reject) {
            let cnx = mariaDB_1.default.getConnection();
            let results = [];
            cnx.query(`SELECT * FROM ${USER.TB_USER_NAME}
                        WHERE ${USER.ID} = ${userId}`)
                .on('result', res => res.on('data', row => results.push(User.newFromQuery(row)))
                .on("end", () => resolve(results))
                .on("error", error => console.dir(error.message)))
                .on("error", error => console.dir(error.message))
                .on("end", () => resolve(results));
            cnx.end();
        });
    }
    static delete(userId) {
        let cnx = mariaDB_1.default.getConnection();
        cnx.query(`DELET FROM ${USER.TB_USER_NAME}
                    WHERE ${USER.ID} = ${userId}`)
            .on("error", error => console.dir(error.message));
        cnx.end();
    }
    update(userId) {
        let cnx = mariaDB_1.default.getConnection();
        cnx.query(`UPDATE ${USER.TB_USER_NAME}
                    SET ${USER.FIRST_NAME} = ${this.first_name}, ${USER.MIDDLE_NAME} = ${this.middle_name}, ${USER.FIRST_SURNAME} = ${this.first_surname}, ${USER.SECOND_SURNAME} = ${this.second_surname},
                        ${USER.EMAIL} = ${this.email}, ${USER.BIRTHDATE} = ${this.birthdate.toDateString()}, ${USER.DUI} = ${this.DUI}, ${USER.GENDER} = ${this.gender}
                    WHERE ${USER.ID} = ${userId}`)
            .on("error", error => console.dir(error.message));
        cnx.end();
    }
    create() {
        let cnx = mariaDB_1.default.getConnection();
        cnx.query(`INSERT INTO ${USER.TB_USER_NAME}
                            (${USER.FIRST_NAME}, ${USER.MIDDLE_NAME}, ${USER.FIRST_SURNAME}, ${USER.SECOND_SURNAME}, ${USER.EMAIL}, ${USER.BIRTHDATE},                ${USER.DUI}, ${USER.GENDER})
                    VALUES  (${this.first_name}, ${this.middle_name}, ${this.first_surname}, ${this.second_surname}, ${this.email}, ${this.birthdate.toDateString()}, ${this.DUI}, ${this.gender})`)
            .on("error", error => console.dir(error.message));
        cnx.end();
    }
}
exports.default = User;
//# sourceMappingURL=users.js.map