import MariaDB from '../DBManagers/mariaDB'

class USER {
    static TB_USER_NAME = 'usuario'
    static TB_ROLE_NAME = `rol`
    static ID = `id_usuario`
    static FIRST_NAME = `primer_nombre`
    static MIDDLE_NAME = `segundo_nombre`
    static FIRST_SURNAME = `primer_apellido`
    static SECOND_SURNAME = `segundo_apellido`
    static EMAIL = `email`
    static BIRTHDATE = `fecha_nacimiento`
    static GENDER = `gender`
    static DUI = `dui`
    static ROLE = `id_rol`
}

export default class User {
    id: number
    first_name: string
    middle_name: string
    first_surname: string
    second_surname: string
    email: string
    birthdate: Date
    gender: string
    DUI: string
    role: number

    constructor(id: number, first_name: string, middle_name: string, first_surname: string, second_surname: string, email: string, birthdate: Date, gender: string, DUI: string, role: number) {
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

    static newFromQuery(queryRes: any) {

        return new User(
            Number.parseInt(queryRes[USER.ID]),
            queryRes[USER.FIRST_NAME],
            queryRes[USER.MIDDLE_NAME],
            queryRes[USER.FIRST_SURNAME],
            queryRes[USER.SECOND_SURNAME],
            queryRes[USER.EMAIL],
            new Date(queryRes[USER.BIRTHDATE]),
            queryRes[USER.GENDER] == `\u0000` ? `Femenino` : `Masculino`,
            queryRes[USER.DUI],
            Number.parseInt(queryRes[USER.ROLE])
        )
    }

    static default(): User { return new User(-1, "", "", "", "", "", new Date(), `Femenino`, "", -1) }

    static getUsers(): Promise<Array<User>> {
        return new Promise<User[]>(function (resolve, reject) {
            let cnx = MariaDB.getConnection();
            let results: Array<User> = [];
            //TODO: Investigate bind to save () => resolve(result)
            cnx.query(`SELECT * FROM ${USER.TB_USER_NAME}`)
                .on('result', res =>
                    res.on('data', row => results.push(User.newFromQuery(row)))
                        .on("end", () => resolve(results))
                        .on("error", reject))
                .on("error", reject)
                .on("end", () => resolve(results));

            cnx.end();
        })
    }

    static getUser(userId: number): Promise<Array<User>> {
        return new Promise<User[]>(function (resolve, reject) {
            let cnx = MariaDB.getConnection();
            let results: Array<User> = [];
            cnx.query(`SELECT * FROM ${USER.TB_USER_NAME}
                        WHERE ${USER.ID} = ${userId}`)
                .on('result', res =>
                    res.on('data', row => results.push(User.newFromQuery(row)))
                        .on("end", () => resolve(results))
                        .on("error", error => console.dir(error.message)))
                .on("error", error => console.dir(error.message))
                .on("end", () => resolve(results));

            cnx.end();
        })
    }

    // REVIEW: Do I really need to delete a user? possibly user/client no, but what about user/employee?
    static deleteUser(userId: number): void {
        let cnx = MariaDB.getConnection();
        cnx.query(`DELET FROM ${USER.TB_USER_NAME}
                    WHERE ${USER.ID} = ${userId}`)
            .on("error", error => console.dir(error.message))

        cnx.end();
    }

    updateUser(userId: number): void {
        let cnx = MariaDB.getConnection();
        cnx.query(`UPDATE ${USER.TB_USER_NAME}
                    SET ${USER.FIRST_NAME} = ${this.first_name}, ${USER.MIDDLE_NAME} = ${this.middle_name}, ${USER.FIRST_SURNAME} = ${this.first_surname}, ${USER.SECOND_SURNAME} = ${this.second_surname},
                        ${USER.EMAIL} = ${this.email}, ${USER.BIRTHDATE} = ${this.birthdate.toDateString()}, ${USER.DUI} = ${this.DUI}, ${USER.GENDER} = ${this.gender}
                    WHERE ${USER.ID} = ${userId}`)
            .on("error", error => console.dir(error.message))

        cnx.end();
    }

    createUser(): void {
        let cnx = MariaDB.getConnection();
        cnx.query(`INSERT INTO ${USER.TB_USER_NAME}
                            (${USER.FIRST_NAME}, ${USER.MIDDLE_NAME}, ${USER.FIRST_SURNAME}, ${USER.SECOND_SURNAME}, ${USER.EMAIL}, ${USER.BIRTHDATE},                ${USER.DUI}, ${USER.GENDER})
                    VALUES  (${this.first_name}, ${this.middle_name}, ${this.first_surname}, ${this.second_surname}, ${this.email}, ${this.birthdate.toDateString()}, ${this.DUI}, ${this.gender})`)
            .on("error", error => console.dir(error.message))

        cnx.end();
    }
}