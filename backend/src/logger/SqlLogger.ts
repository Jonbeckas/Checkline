import { Repository } from "typeorm";
import { Log } from "../model/Log";
import { LogType } from "./logger";

export class SqlLogger {

    private static singleton?: SqlLogger
    private repository?: Repository<Log>

    private constructor(repo: Repository<Log>) {this.repository = repo}

    static logV(data: string, category: string,user: string|null = null): void {
        SqlLogger.log(user,data,category,LogType.VERBOSE);
        console.log(data)
    }

    static logI(data: string, category: string, user: string|null = null): void {
        SqlLogger.log(user,data,category,LogType.INFO);
    }

    static logW(data: string, category: string, user: string|null = null): void {
        SqlLogger.log(user,data,category,LogType.WARN);
    }

    static logE(data: string, category: string, user: string|null = null): void {
        SqlLogger.log(user,data,category,LogType.ERROR);
    }

    static log(user: string|null, data: string, category: string, type: LogType) {
        if (!SqlLogger.singleton) {
            Error("Logger not initialized!");
        }

        SqlLogger.singleton?.repository!!.save(Log.newLog(data,type,user, category));
    }

    static initLogger(repo: Repository<Log>,override = false) {
        if (SqlLogger.singleton && !override) {
            return Error("Logger is already initialized!");
        }
        SqlLogger.singleton = new SqlLogger(repo);
    }
}