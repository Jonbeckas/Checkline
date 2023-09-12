import { jsonArrayMember, jsonMember, jsonObject } from "typedjson"

@jsonObject
export class  Database {
    @jsonMember(String,{isRequired: true})
    host!:string;

    @jsonMember(String,{isRequired: true})
    username!:string;

    @jsonMember(String,{isRequired: true})
    password!:string;

    @jsonMember(Number,{isRequired: true})
    port!:number;

    @jsonMember(String, {isRequired: true})
    database!:string;
}

@jsonObject

export class RunnerConfig {
    @jsonArrayMember(String, {isRequired: true})
    states!: string[]

    @jsonArrayMember(String, {isRequired: true})
    stations!: string[]

    @jsonMember(Number, {isRequired: true})
    conspicousAfterSeconds!: number
}

@jsonObject
export class DefaultUser {
    @jsonMember(String,{isRequired: true})
    username!: string

    @jsonMember(String,{isRequired: true})
    name!: string

    @jsonMember(String,{isRequired: true})
    firstname!: string
}

@jsonObject
export class DefaultGroup {
    @jsonMember(String,{isRequired: true})
    name!: string

}

@jsonObject
export class Configuration {

    @jsonMember(Database,{isRequired: true})
    database!:Database

    @jsonMember(String,{isRequired: true})
    jwtSecret!: string

    @jsonMember(Number,{isRequired: true})
    port!: number

    @jsonMember(RunnerConfig,{isRequired: true})
    runners!: RunnerConfig;

    @jsonMember(DefaultUser,{isRequired: true})
    admin!: DefaultUser

    @jsonMember(DefaultGroup,{isRequired: true})
    adminGroup!: DefaultGroup

    @jsonMember(Boolean, {isRequired: false})
    debug!: Boolean
}
