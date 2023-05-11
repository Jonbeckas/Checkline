import {Column, Entity, JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./User";

@Entity()
export class Runner {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: true, type:"text"})
    state!: string| null;

    @Column({nullable: true, type:"text"})
    lastStateChange!: string| null;

    @Column({nullable: false, type:"int"})
    round!: number;

    @Column({nullable: true, type:"text"})
    timestamp!: string| null;

    @Column({nullable: true, type:"text"})
    station!: string|null

    static newRunner(id: string) {
        let runner = new Runner();
        runner.id  = id;
        runner.lastStateChange = null;
        runner.round = 0;
        runner.state = null;
        runner.timestamp = null;
        runner.station = null;
        return runner;
    }
}
