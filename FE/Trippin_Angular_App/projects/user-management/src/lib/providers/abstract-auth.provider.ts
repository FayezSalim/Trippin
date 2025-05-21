import { Signal } from "@angular/core";
import { AuthResult } from "../models/auth-result";
import { AuthCredential } from "../models/auth-credential";

export abstract class AbstractAuthProvider<T extends AuthCredential> {

    abstract get provider(): string; //TODO check if we can infer provider value from Type

    abstract login(credential: T): Promise<AuthResult<T>>;

    abstract signUp(credential: T): Promise<AuthResult<T>>;

    abstract forgotPassword(credential: T): Promise<AuthResult<T>>;

    abstract logout(): Promise<void>;
}