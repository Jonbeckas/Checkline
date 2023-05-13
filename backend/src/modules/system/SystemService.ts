import { Repository } from "typeorm";
import { Log } from "../../model/Log";

export class SystemService {
    constructor(private sqlLoggerRepository: Repository<Log>) {}

    async getAllLogs(): Promise<Log[]> {
        return await this.sqlLoggerRepository.find();
    }
}