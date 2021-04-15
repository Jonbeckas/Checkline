import {MongoClient} from "mongodb";
import {CONFIG} from "../config";
import {Connection, createConnection} from "mysql2/promise";
import {NotEnougthArgumentsException} from "../exception/not-enougth-arguments.exception";

export class UserDB {
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

    async insertObject(table:string,object:Object) {
        const keys = Object.keys(object);
        const values = Object.values(object);

        let command =`INSERT INTO  \`${table}\` (`
        let valuesString = ` VALUES (`

        for (const index in keys) {
            command += "\`"+keys[index]+"\`";

            //@ts-ignore
            if (index != keys.length-1) {
                command +=",";
            } else {
                command +=")"
            }

            valuesString += `\'${values[index]}\'`;
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
                command += `\`${keys[index]}\`='${values[index]}'`;

                //@ts-ignore
                if (index != keys.length-1) {
                    command +=",";
                }
            } else {
                curIf++;
                when += `\`${keys[index]}\` = '${values[index]}'`
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
        let curIf = 0;

        let command =`DELETE FROM \`${table}\` WHERE `

        for (const index in keys) {
            command+=`\`${keys[index]}\`='${values[index]}' `;
            // @ts-ignore
            if (index < keys.length-1) {
                command+="AND ";
            }
        }

        const mysqlStatement = command+";";
        console.log("Run Command: "+mysqlStatement);
        await this.connection?.execute(mysqlStatement);
    }


    async getObject(table:string,primaryKeyValue:Object) {
        const keys = Object.keys(primaryKeyValue);
        const values = Object.values(primaryKeyValue);
        let curIf = 0;

        let command =`SELECT * FROM \`${table}\` WHERE `

        for (const index in keys) {
            command+=`\`${keys[index]}\`='${values[index]}' `;
            // @ts-ignore
            if (index < keys.length-1) {
                command+="AND ";
            }
        }

        const mysqlStatement = command+";";
        console.log("Run Command: "+mysqlStatement);
        let result =  await this.connection?.execute(mysqlStatement);
        return JSON.parse(JSON.stringify(result));
    }



    async  creatUserDb() {
        const  createUsers = await this.connection?.execute("CREATE TABLE IF NOT EXISTS `checkline`.`users` ( `userId` VARCHAR(36) NOT NULL , `name` VARCHAR(36) NOT NULL , `firstname` TEXT NOT NULL , `password` TEXT NOT NULL , PRIMARY KEY (`userId`));");
        const  createUserGroups = await this.connection?.execute("CREATE TABLE IF NOT EXISTS `checkline`.`user-groups` ( `groupId` VARCHAR(36) NOT NULL , `userId` VARCHAR(36) NOT NULL );");
        const createGroups = await this.connection?.execute("CREATE TABLE IF NOT EXISTS `checkline`.`groups` ( `groupId` VARCHAR(36) NOT NULL , `name` VARCHAR(50) NOT NULL,PRIMARY KEY (`groupId`));");
        const createGroupPermissions = await this.connection?.execute("CREATE TABLE IF NOT EXISTS `checkline`.`group-permissions` ( `groupId` VARCHAR(36) NOT NULL , `permission` VARCHAR(36) NOT NULL );");
        const createUserSessions = await this.connection?.execute("CREATE TABLE IF NOT EXISTS `checkline`.`user-sessions` ( `userId` VARCHAR(36) NOT NULL , `token` VARCHAR(36) NOT NULL );");
        const createRunners = await this.connection?.execute("CREATE TABLE IF NOT EXISTS `checkline`.`runners` ( `userId` VARCHAR(36) NOT NULL , `runner-id` VARCHAR(36) NOT NULL , `state` INT NOT NULL , `check-in` TIMESTAMP NOT NULL , `check-out` TIMESTAMP NOT NULL , `round` INT NOT NULL , `timestamp` TIMESTAMP NOT NULL , PRIMARY KEY (`userId`));");
    }

}
