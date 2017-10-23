import MariaDB from "../DBManagers/mariaDB";
import * as Moment from "moment";

export class USER {
    static TB_USER_NAME = "usuario";
    static TB_ROLE_NAME = `rol`;
    static ID = `id_usuario`;
    static FIRST_NAME = `primer_nombre`;
    static MIDDLE_NAME = `segundo_nombre`;
    static FIRST_SURNAME = `primer_apellido`;
    static SECOND_SURNAME = `segundo_apellido`;
    static EMAIL = `email`;
    static BIRTHDATE = `fecha_nacimiento`;
    static GENDER = `genero`;
    static DUI = `dui`;
    static ROLE = `id_rol`;
}

export default class User {
    id: number;
    first_name: string;
    middle_name: string;
    first_surname: string;
    second_surname: string;
    email: string;
    birthdate: Moment.Moment;
    gender: string;
    private Gender: number;
    DUI: string;
    role: number;

    constructor(id: number, first_name: string, middle_name: string, first_surname: string, second_surname: string, email: string, birthdate: Moment.Moment, gender: number, DUI: string, role: number) {
        this.id = id;
        this.first_name = first_name;
        this.middle_name = middle_name;
        this.first_surname = first_surname;
        this.second_surname = second_surname;
        this.email = email;
        this.birthdate = birthdate.utc(false);
        this.Gender = gender;
        this.gender = gender == 0 ? `Femenino` : `Masculino`;
        this.DUI = DUI;
        this.role = role;
    }

    static deseliarize(json: any): User {
        return new User(
            Number.parseInt(json.id),
            json.first_name,
            json.middle_name,
            json.first_surname,
            json.second_surname,
            json.email,
            Moment(json.birthdate),
            json.Gender == `\u0000` ? 0 : 1,
            json.DUI,
            Number.parseInt(json.role)
        );
    }

    static newFromQuery(queryRes: any): User {
        return new User(
            Number.parseInt(queryRes[USER.ID]),
            queryRes[USER.FIRST_NAME],
            queryRes[USER.MIDDLE_NAME],
            queryRes[USER.FIRST_SURNAME],
            queryRes[USER.SECOND_SURNAME],
            queryRes[USER.EMAIL],
            Moment(queryRes[USER.BIRTHDATE]).hour(0),
            queryRes[USER.GENDER] == `\u0000` ? 0 : 1,
            queryRes[USER.DUI],
            Number.parseInt(queryRes[USER.ROLE])
        );
    }

    static default(): User { return new User(-1, "", "", "", "", "", Moment(), 0, "", -1); }

    static find(lookfor: string): Promise<Array<User>> {
        return new Promise<User[]>(function (resolve, reject) {
            let cnx = MariaDB.getConnection();
            let results: Array<User> = [];
            cnx.query(` MATCH (${USER.FIRST_NAME}, ${USER.MIDDLE_NAME}, ${USER.FIRST_SURNAME}, ${USER.SECOND_SURNAME}, ${USER.DUI})
                        AGAINST (${lookfor})`)
                .on("result", res =>
                    res.on("data", row => results.push(User.newFromQuery(row)))
                        .on("end", () => resolve(results))
                        .on("error", reject))
                .on("error", reject)
                .on("end", () => resolve(results));
            cnx.end();
        });
    }

    static getAll(): Promise<Array<User>> {
        return new Promise<User[]>(function (resolve, reject) {
            let cnx = MariaDB.getConnection();
            let results: Array<User> = [];
            //TODO: Investigate bind to save () => resolve(result)
            cnx.query(`SELECT * FROM ${USER.TB_USER_NAME}`)
                .on("result", res =>
                    res.on("data", row => results.push(User.newFromQuery(row)))
                        .on("end", () => resolve(results))
                        .on("error", reject))
                .on("error", reject)
                .on("end", () => resolve(results));
            cnx.end();
        });
    }

    static get(userId: number): Promise<User> {
        return new Promise<User>(function (resolve, reject) {
            let cnx = MariaDB.getConnection();
            let result: User;
            cnx.query(`SELECT * FROM ${USER.TB_USER_NAME}
                        WHERE ${USER.ID} = ${userId}`)
                .on("result", res =>
                    res.on("data", row => result = User.newFromQuery(row))
                        .on("end", () => result == undefined ? reject(`Record not Found`) : resolve(result))
                        .on("error", reject))
                .on("error", reject);
            cnx.end();
        });
    }

    // REVIEW: Do I really need to delete a user? possibly user/client no, but what about user/employee?
    static delete(userId: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let cnx = MariaDB.getConnection();
            cnx.query(`DELETE FROM ${USER.TB_USER_NAME}
                    WHERE ${USER.ID} = ${userId}`)
                .on("result", res =>
                    res .on("end", () => resolve("ok"))
                        .on("error", error => reject(error))
                );
            cnx.end();
        });
    }

    update(userId: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let cnx = MariaDB.getConnection();
            cnx.query(`UPDATE ${USER.TB_USER_NAME}
                    SET ${USER.FIRST_NAME} = '${this.first_name}', ${USER.MIDDLE_NAME} = '${this.middle_name}', ${USER.FIRST_SURNAME} = '${this.first_surname}', ${USER.SECOND_SURNAME} = '${this.second_surname}',
                        ${USER.EMAIL} = '${this.email}', ${USER.BIRTHDATE} = '${this.birthdate.format("Y-M-D")}', ${USER.DUI} = '${this.DUI}', ${USER.GENDER} = ${this.Gender}
                    WHERE ${USER.ID} = ${userId}`)
                .on("result", res =>
                    res .on("end", () => resolve(`ok`))
                        .on("error", error => reject(error))
                );
            cnx.end();
        });
    }

    create(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let cnx = MariaDB.getConnection();
            let ifInsert = this.id == -1 ? `` : `${USER.ID},`;
            let ifValue = this.id == -1 ? `` : `${this.id},`;
            cnx.query(`INSERT INTO ${USER.TB_USER_NAME}
                            (${ifInsert} ${USER.FIRST_NAME}, ${USER.MIDDLE_NAME}, ${USER.FIRST_SURNAME}, ${USER.SECOND_SURNAME}, ${USER.EMAIL}, ${USER.BIRTHDATE}, ${USER.DUI}, ${USER.GENDER})
                    VALUES  (${ifValue} '${this.first_name}', '${this.middle_name}', '${this.first_surname}', '${this.second_surname}', '${this.email}', '${this.birthdate.format("Y-M-D")}', '${this.DUI}', ${this.Gender})`)
                .on("result", res =>
                    res .on("end", () => resolve(`ok`))
                        .on("error", error => reject(error)))
                .on(`end`, () => resolve("ok"))
                .on("error", error => reject(error));
            cnx.end();
        });
    }

    isEqualTo(user: User): boolean {
        return this.birthdate.toString() == user.birthdate.toString() &&
            this.DUI == user.DUI &&
            this.email == user.email &&
            this.first_name == user.first_name &&
            this.middle_name == user.middle_name &&
            this.first_surname == user.first_surname &&
            this.second_surname == user.second_surname &&
            this.Gender == user.Gender &&
            this.id == user.id &&
            this.role == user.role;
    }
}