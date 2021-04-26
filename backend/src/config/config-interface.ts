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

export interface Configuration {
    database:Database;
    jwtSecret: string
    port: number
    runners: RunnerConfig;
}
