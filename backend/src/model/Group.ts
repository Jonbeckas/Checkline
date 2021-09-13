import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";
import {Permission} from "./Permission";

@Entity()
export class Group {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!:string;

    @ManyToMany(type => User, user => user.groups)
    @JoinTable()
    users!: User[]

    @OneToMany(type => Permission, permission => permission.group)
    permissions!: Permission[]

}
