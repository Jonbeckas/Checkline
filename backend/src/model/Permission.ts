import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Group} from "./Group";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn("uuid")
    id!:string

    @Column()
    name!: string

    @Column()
    groupId!: number

    @ManyToOne(type => Group)
    @JoinColumn({name: "groupId",referencedColumnName:"id"})
    group!:Group
}
