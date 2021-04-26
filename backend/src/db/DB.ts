import {CONFIG} from "../config";
import {Connection, createConnection} from "mysql2/promise";
import {NotEnougthArgumentsException} from "../exception/not-enougth-arguments.exception";

export class DB {
    private connection: Connection | undefined;


    async connect() {
        this.connection = await createConnection({
            host:CONFIG.database.host,
            user: CONFIG.database.username,
            database: CONFIG.database.database,
            port: CONFIG.database.port,
            password: CONFIG.database.password
        });

        await this.creatUserDb();
    }

    async close() {
        await this.connection?.end()
    }

    async insertObject(table:string,object:Object) {
        const keys = Object.keys(object);
        const values = Object.values(object);

        let command =`INSERT INTO  \`${table}\` (`
        let valuesString = ` VALUES (`

        for (const index in keys) {
            command += this.connection?.escapeId(keys[index]);

            //@ts-ignore
            if (index != keys.length-1) {
                command +=",";
            } else {
                command +=")"
            }

            valuesString += this.connection?.escape(values[index]);
            // @ts-ignore
            if (index !=keys.length-1) {
                valuesString +=",";
            } else {
                valuesString +=");"
            }
        }
        const mysqlStatement = command+valuesString;
        console.log("Run Command: "+mysqlStatement);
        await this.connection?.execute(mysqlStatement);
    }

    async editObject(table:string,primaryKeys:string[],object:Object) {
        const keys = Object.keys(object);
        const values = Object.values(object);
        let curIf = 0;

        let when = ` WHERE `;
        let command =`UPDATE \`${table}\` SET `

        if (primaryKeys.length >= keys.length) {
            throw new NotEnougthArgumentsException();
        }

        for (const index in keys) {
            if (!primaryKeys.includes(keys[index])) {
                command += `${this.connection?.escapeId(keys[index])} =${this.connection?.escape(values[index])}`;

                //@ts-ignore
                if (index < keys.length- primaryKeys.length-1) {
                    command +=",";
                }
            } else {
                curIf++;
                when += `${this.connection?.escapeId(keys[index])} = ${this.connection?.escape(values[index])}`
                if(primaryKeys.length != curIf){
                    when +="AND";
                }
            }
        }

        const mysqlStatement = command+when+";";
        console.log("Run Command: "+mysqlStatement);
        await this.connection?.execute(mysqlStatement);
    }

    async deleteObject(table:string,primaryKeyValue:Object) {
        const keys = Object.keys(primaryKeyValue);
        const values = Object.values(primaryKeyValue);

        let command =`DELETE FROM \`${table}\` WHERE `

        for (const index in keys) {
            command+=`${this.connection?.escapeId(keys[index])} = ${this.connection?.escape(values[index])} `;
            // @ts-ignore
            if (index < keys.length-1) {
                command+="AND ";
            }
        }

        const mysqlStatement = command+";";
        console.log("Run Command: "+mysqlStatement);
        await this.connection?.execute(mysqlStatement);
    }


    async getObject(table:string,primaryKeyValue:Object):Promise<unknown[]> {
        const keys = Object.keys(primaryKeyValue);
        const values = Object.values(primaryKeyValue);
        let curIf = 0;

        let command =`SELECT * FROM \`${table}\``

        if (keys.length>0) {
            command +=" WHERE "
            for (const index in keys) {
                command+=` ${this.connection?.escapeId(keys[index])} = ${this.connection?.escape(values[index])} `;
                // @ts-ignore
                if (index < keys.length-1) {
                    command+="AND ";
                }
            }
        }


        const mysqlStatement = command+";";
        console.log("Run Command: "+mysqlStatement);
        // @ts-ignore
        const [rows, fields] = await this.connection?.execute(mysqlStatement);
        return rows;
    }

    async innerJoin(table1:string,table2:string,row:string,where:Object):Promise<unknown[]> {
        const keys = Object.keys(where);
        const values = Object.values(where);
        let command =`SELECT * FROM ${this.connection?.escapeId(table1)}INNER JOIN ${this.connection?.escapeId(table2)} USING (${this.connection?.escapeId(row)})`

        if (keys.length>0) {
            command +=" WHERE "
            for (const index in keys) {
                command+=` ${this.connection?.escapeId(keys[index])} = ${this.connection?.escape(values[index])} `;
                // @ts-ignore
                if (index < keys.length-1) {
                    command+="AND ";
                }
            }
        }

        const mysqlStatement = command+";";
        console.log("Run Command: "+mysqlStatement);
        // @ts-ignore
        const [rows, fields] = await this.connection?.execute(mysqlStatement);
        return rows;
    }

    async escapeKey(key:string) {
        return this.connection?.escapeId(key);
    }

    async escapeValue(value:string) {
        return this.connection?.escape(value);
    }

    async customQuery(query:string) {
        console.log("Run Command:",query);
        // @ts-ignore
        const [rows, fields] = await this.connection?.execute(query);
        return rows;
    }



    async  creatUserDb() {
        const createUsers = await this.connection?.execute("CREATE TABLE IF NOT EXISTS `checkline`.`users` ( `userId` VARCHAR(36) NOT NULL , `name` VARCHAR(36) NOT NULL , `firstname` TEXT NOT NULL , `password` TEXT NOT NULL, `loginName` VARCHAR(30) NOT NULL  , `lastLogin` VARCHAR(14) DEFAULT NULL , PRIMARY KEY (`userId`));");
        const createUserGroups = await this.connection?.execute("CREATE TABLE IF NOT EXISTS `checkline`.`user-groups` ( `groupId` VARCHAR(36) NOT NULL , `userId` VARCHAR(36) NOT NULL );");
        const createGroups = await this.connection?.execute("CREATE TABLE IF NOT EXISTS `checkline`.`groups` ( `groupId` VARCHAR(36) NOT NULL , `name` VARCHAR(50) NOT NULL,PRIMARY KEY (`groupId`));");
        const createGroupPermissions = await this.connection?.execute("CREATE TABLE IF NOT EXISTS `checkline`.`group-permissions` ( `groupId` VARCHAR(36) NOT NULL , `permission` VARCHAR(36) NOT NULL );");
        const createRunners = await this.connection?.execute("CREATE TABLE IF NOT EXISTS `checkline`.`runners` ( `userId` VARCHAR(36) NOT NULL , `state` VARCHAR(50) DEFAULT NULL , `lastStateChange` VARCHAR(14) DEFAULT NULL , `round` INT DEFAULT NULL , `timestamp` VARCHAR(14) DEFAULT NULL , PRIMARY KEY (`userId`));");

    }

}
