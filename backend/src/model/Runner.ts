import {Column, Entity, JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./User";

@Entity()
export class Runner {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: true, type:"text"})
    state!: string| null;

    @Column({nullable: true, type:"int"})
    lastStateChange!: number| null;

    @Column({nullable: false, type:"int"})
    round!: number;

    @Column({nullable: true, type:"bigint"})
    timestamp!: number| null;

    static newRunner(id: string) {
        let runner = new Runner();
        runner.id  = id;
        runner.lastStateChange = null;
        runner.round = 0;
        runner.state = null;
        runner.timestamp = null;
        return runner;
    }
}
