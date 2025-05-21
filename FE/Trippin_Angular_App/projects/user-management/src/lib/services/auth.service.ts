import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { AbstractAuthProvider } from "../providers/abstract-auth.provider";
import { AuthCredential } from "../models/auth-credential";
import { AuthResult } from "../models/auth-result";


@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(@Inject(AbstractAuthProvider) private authProviders: AbstractAuthProvider<AuthCredential>[], private httpClient: HttpClient) {

    }

    async login(credential: AuthCredential): Promise<AuthResult<AuthCredential>> {
        const provider = this.getProvider(credential.provider);

        try {
            var res = await provider.login(credential);
            return res;
        } catch (error) {
            console.error('Error logging in user:', error);
            throw new Error('Login failed', { cause: (error as Error).cause });
        }
    }

    async signUp(credential: AuthCredential): Promise<AuthResult<AuthCredential>> {
        const provider = this.getProvider(credential.provider);

        try {
            var res = await provider.signUp(credential);
            return res;
        } catch (error) {
            console.error('Error signingup user:', error);
            throw new Error('SignUp failed', { cause: (error as Error).cause });
        }
    }

    forgotPassword(email: string): boolean {

        //TOOD
        return false;
    }

    logout(): void {
        //TODO
    }

    private getProvider(provider: string): AbstractAuthProvider<AuthCredential> {
        let providerInstance: AbstractAuthProvider<AuthCredential> | undefined;

        providerInstance = this.authProviders.find((providerInstance) => providerInstance.provider === provider);

        if (providerInstance) {
            return providerInstance;
        }
        throw new Error(`Provider ${provider} not found`);
    }
}
