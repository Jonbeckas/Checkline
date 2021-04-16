export class NoUserFoundException extends Error {
    constructor() {
        super();
        this.name = "NoUserFoundException"
    }
}
