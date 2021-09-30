export class InvalidConfigError extends SyntaxError{
    constructor(message: string| undefined = undefined) {
        super(message)
    }
}
