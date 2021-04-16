export class InvalidMysqlData extends Error {
    constructor(message:string) {
        super(message);
        this.name = "InvalidMysqlData"
    }
}
