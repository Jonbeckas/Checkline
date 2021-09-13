import {Column, Entity, JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./User";

@Entity()
export class Runner {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    state!: number;

    @Column()
    lastStateChange!: number;

    @Column()
    round!: number;

    @Column()
    timestamp!: number;

    @Column()
    userId!: string

    @JoinColumn({name: "groupId",referencedColumnName:"id"})
    user!:User
}
