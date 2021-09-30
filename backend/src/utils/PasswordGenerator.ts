import * as crypto from "crypto"

export class PasswordGenerator {
    static async generatePassword(length: number): Promise<string> {
        let chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let password = '';

        for (let i = 0; i < length; i++) {
            let index = await crypto.randomInt(0,chars.length-1);
            password += chars[index];
        }

        return password
    }
}  