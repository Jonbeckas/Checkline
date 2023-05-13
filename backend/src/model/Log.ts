import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { LogType } from "../logger/logger";

@Entity()
export class Log {
    @PrimaryGeneratedColumn("increment")
    id!: number

    @Column({type:"datetime"})
    timestamp!: Date

    @Column()
    data!: string

    @Column()
    type!: LogType

    @Column()
    category! : string

    @Column({nullable:true, type:"text"})
    user! : string| null

    static newLog(data:string, type:LogType, user: string|null, category: string): Log {
        let log = new Log();
        log.data = data;
        log.type = type;
        log.user = user;
        log.timestamp = new Date();
        log.category = category;
        return log;
    }
}