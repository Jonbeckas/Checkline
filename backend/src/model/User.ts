import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Group} from "./Group";
import * as stream from "stream";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!:string;

    @Column()
    name!:string;

    @Column()
    firstname!:string;

    @Column()
    password!:string;

    @Column()
    username!:string;

    @Column({nullable: true,type:"text"})
    lastLogin!:string;

    @ManyToMany(type => Group, group => group.users, )
    groups!: Group[]

    static newUser(name:string, firstname:string, username: string, encryptedPassword: string, lastLogin: string|null = null) {
        let user = new User();
        user.name = name;
        user.firstname = firstname;
        user.username = username;
        user.password = encryptedPassword;
        user.groups = []
        if (lastLogin) {
            user.lastLogin = lastLogin;
        }
        return user;
    }
}
