import {Configuration} from "./config/config-interface";

export const CONFIG:Configuration  = {
    database: {
        host: "localhost",
        port: 3306,
        username: "root",
        password: "password",
        database:"checkline"
    },
    jwtSecret:"fuckthispassword",
    port: 8000,
    runners: {
        states: ["Logged in","Logged out","Injured","Injured logged out"]
    }

}
