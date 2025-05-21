export interface AuthCredential {
    get provider(): string;

    readonly username: string;
    readonly name?: string;
    readonly password?: string;
}