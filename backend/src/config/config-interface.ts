export interface Database {
    host:string;
    username:string;
    password:string;
    port:number;
    database:string;
}

export interface RunnerConfig {
    states: string[]
}

export interface DefaultUser {
    username: string,
    name: string,
    firstname: string
}

export interface DefaultGroup {
    name: string,
}

export interface Configuration {
    database:Database;
    jwtSecret: string
    port: number
    runners: RunnerConfig;
    admin: DefaultUser,
    adminGroup: DefaultGroup
}
