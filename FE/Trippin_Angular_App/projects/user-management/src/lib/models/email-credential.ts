import { AuthCredential } from "./auth-credential";

export class EmailCredential implements AuthCredential {

    public static readonly _provider: string = 'email';

    public get provider(): string {
        return EmailCredential._provider;
    }

    public readonly username: string;

    public readonly name?: string;
    public readonly password?: string;

    public constructor(username: string, password?: string, name?: string) {
        this.name = name;
        this.username = username;
        this.password = password;
    }
}