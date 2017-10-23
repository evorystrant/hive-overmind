import MariaDB from "../DBManagers/mariaDB";

export default class credentials {
    id: number;
    name: string;
    password: string;
    role: number;

    constructor(id: number, name: string, password: string, role: number) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.role = role;
    }

    static default(): credentials { return new credentials(0, "", "", 0); }

    static async getAllCredentials(): Promise<Array<credentials>> {
        return new Promise<credentials[]>(function (resolve, reject) {
            var cnx = MariaDB.getConnection();
            let results: Array<credentials> = [];
            cnx.query(
                "SELECT u.id_usuario, cl.usuario, cl.password, u.id_rol\
                 FROM credencial_local as cl\
                 JOIN usuario AS u WHERE u.id_usuario = cl.id_usuario"
            )
                .on("result", res =>
                    res .on("data", row => results.push(new credentials(row.id_usuario, row.usuario, row.password, row.id_rol)))
                        .on("end", () => resolve(results))
                        .on("error", error => console.dir(error.message) ))
                .on("error", error => console.dir(error.message))
                .on("end", () => resolve(results));

            cnx.end();
        });
    }

    isUser(id: string | number, password?: string): boolean{
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