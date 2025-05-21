import { AuthCredential } from "./auth-credential";
import { AuthError } from "./auth-error";

export interface AuthResult<T extends AuthCredential> {
    inputError?: AuthError<T>;
    error?: string;
}