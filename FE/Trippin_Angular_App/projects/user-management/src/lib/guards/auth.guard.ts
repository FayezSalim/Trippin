import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    // if (this.authService.isLoggedIn()) {
    //   return true; // Allow access if the user is logged in
    // } else {
    //   this.router.navigate(['/login']); // Redirect to login if not authenticated
    //   return false;
    // }
    return true;
  }
}