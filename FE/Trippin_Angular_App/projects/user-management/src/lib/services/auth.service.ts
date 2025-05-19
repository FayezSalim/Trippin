import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class AuthService {
    private isAuthenticated: boolean = false;

    constructor() { }

    login(username: string, password: string): boolean {
        // Implement your login logic here
        // For example, check username and password against a database
        if (username === 'admin' && password === 'password') {
            this.isAuthenticated = true;
            return true;
        }
        return false;
    }

    signUp(username: string, password: string): boolean {
        return false;
    }

    forgotPassword(email: string): boolean {
        // Implement your password reset logic here
        return false;
    }

    logout(): void {
        this.isAuthenticated = false;
    }

    isLoggedIn(): boolean {
        return this.isAuthenticated;
    }
}
