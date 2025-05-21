import { HttpClient } from "@angular/common/http";
import { AbstractAuthProvider } from "./abstract-auth.provider";
import { lastValueFrom, map } from "rxjs";
import { EmailCredential } from "../models/email-credential";
import { AuthResult } from "../models/auth-result";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class EmailAuthProvider extends AbstractAuthProvider<EmailCredential> {

    private csrfTokenPromise: Promise<string>;

    override get provider(): string {
        return EmailCredential._provider;
    }

    constructor(private httpClient: HttpClient) {
        super();

        this.csrfTokenPromise = lastValueFrom(this.httpClient.get('http://localhost:3000/auth/csrf', { withCredentials: true })).then(
            (response: any) => response.csrfToken);
    }

    async login(credential: EmailCredential): Promise<AuthResult<EmailCredential>> {
        //TODO add validation of iputs
        const csrfToken = await this.csrfTokenPromise;
        //check 401 case and redirect to login page
        const login$ = this.httpClient.post('http://localhost:3000/auth/callback/credentials',
            {
                email: credential.username,
                password: credential.password,
                csrfToken: csrfToken,
                callbackUrl: 'http://localhost:4200/login?error=failed'
            },
            {
                headers: {
                    'Accept': 'application/json',
                    'X-Auth-Return-Redirect': 'true',
                },
                withCredentials: true,
                observe: 'response'
            }).pipe(
                map((response: any) => {
                    const res = {} as AuthResult<EmailCredential>;
                    if (response && response.status === 200) {
                        if (response.body && response.body.url) {
                            var redirectUrl = new URL(response.body.url);
                            var errorMessage = redirectUrl.searchParams.has('error') ? redirectUrl.searchParams.get('error') : undefined;
                            if (errorMessage) {
                                res.error = this.translateError(errorMessage, redirectUrl.searchParams.get('code')!);
                            }
                        } 
                        return res;
                    } else {
                        throw new Error('Login Error', { cause: res });
                    }
                })
            );

        return lastValueFrom(login$);// TODO store results ..retrive user session details too to store
    }

    signUp(credential: EmailCredential): Promise<AuthResult<EmailCredential>> {
        //TODO add validation of iputs
        // if (confirmPassword != credential.password) {
        //     throw new Error('Signup Error', { cause: { inputError: { password: ' Password and confirm password do not match' } } as AuthResult<EmailCredential> });
        // }

        const signup$ = this.httpClient.post('http://localhost:3000/auth/signup',
            {
                name: credential.name,
                email: credential.username,
                password: credential.password
            },
            {
                observe: 'response',
            }
        ).pipe(
            map((response: any) => {
                const res = {} as AuthResult<EmailCredential>;
                if (response && response.status === 201) {
                    return res;
                } else {
                    throw new Error('Signup Error', { cause: res });
                }
            })
        );

        return lastValueFrom(signup$);
    }

    async forgotPassword(credential: EmailCredential): Promise<AuthResult<EmailCredential>> {
        //TODO implement foirgot pwdd
        return {} as AuthResult<EmailCredential>;
    }

    async logout(): Promise<void> {
        //TODO implement foirgot pwdd

    }

    private translateError(error: string, code?: string): string {
        switch (error) {
            case 'CredentialsSignin':
                return 'Invalid credentials';
            default:
                return 'Unknown error';
        }
    }

}