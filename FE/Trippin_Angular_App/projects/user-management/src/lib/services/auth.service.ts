import { HttpClient } from "@angular/common/http";
import { inject, Inject, Injectable, Signal } from "@angular/core";
import { AbstractAuthProvider } from "../providers/abstract-auth.provider";
import { AuthCredential } from "../models/auth-credential";
import { AuthResult } from "../models/auth-result";
import { AuthStore } from "../store/auth.store";
import { User } from "../models/user";


@Injectable({ providedIn: 'root' })
export class AuthService {

    private readonly authStore = inject(AuthStore);
    private readonly authProviders: AbstractAuthProvider<AuthCredential>[] = (inject(AbstractAuthProvider) as unknown) as AbstractAuthProvider<AuthCredential>[];
    private readonly httpClient: HttpClient = inject(HttpClient);

    /**
     * @api
     */
    public get isLoggedIn(): Signal<boolean> {
        return this.authStore.isLoggedIn;
    }

    constructor() {

    }

    async login(credential: AuthCredential): Promise<AuthResult<AuthCredential>> {
        const provider = this.getProvider(credential.provider);

        try {
            var loginResult = await provider.login(credential);

            var getUserDetailsResponse  = await fetch('http://localhost:3000/auth/getUserDetails', { credentials: "include" });
            var userDetails = await getUserDetailsResponse.json();

            this.authStore.updateLoggedInUser(userDetails.user); //TODO use expiry date?

            return loginResult;
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
