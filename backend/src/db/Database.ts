import {Connection, createConnection} from "typeorm";
import * as Path from "path";
import { CONFIG } from "../config/Config";


export class Database {
    connection: Connection| undefined = undefined
    options :any = {
        type:"mysql",
        entities: [
            Path.resolve(Path.parse(__dirname).dir,"model").replace(/\\/gi,"/")+"/*.js"
        ],
        synchronize: true,
    }

    constructor() {

    }

    async connect() {
        this.connection = await createConnection(<any>this.options)
        console.log("Connect to db")
    }

    overrideOptions(host:string,port:number, username: string, password: string, database: string) {
        this.options.host =host;
        this.options.port = port;
        this.options.username = username;
        this.options.password = password;
        this.options.database = database;
    }

    getConnection(): Connection {
        if (this.connection) {
            return this.connection;
        } else{
            throw Error("No DB connection etablished")
        }
    }

    loadFromConfig() {
        this.options.host = CONFIG.database.host;
        this.options.port = CONFIG.database.port;
        this.options.username = CONFIG.database.username;
        this.options.password = CONFIG.database.password;
        this.options.database = CONFIG.database.database;
    }
}
