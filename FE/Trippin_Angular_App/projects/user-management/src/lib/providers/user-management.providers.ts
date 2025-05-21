import { Provider } from "@angular/core";
import { Routes } from "@angular/router";
import { LoginComponent } from "../components/login/login.component";
import { AuthGuard } from "../guards/auth.guard";
import { UserMangementProviderOptions } from "../models/user-management-provider.options";
import { AbstractAuthProvider } from "./abstract-auth.provider";
import { EmailAuthProvider } from "./email-auth-provider";

/**
 * @api
 * @param options
 * @returns 
 */
export function provideUserManagement(options?: UserMangementProviderOptions): Provider[] {
  return [
    {
      //TODO: can modify to create proviedr instances only when called
      provide: AbstractAuthProvider,
      useClass: EmailAuthProvider,
      multi: true,
    }
  ];
}

/**
 * @api
 */
export function provideUserManagementRoutes(): Routes {
  const routes: Routes = [
    {
      path: 'login',
      component: LoginComponent, //chabnge to providers from @trippin/user-management which contains routes,guards
    }, {
      path: '',
      canActivate: [AuthGuard],
      children: [
        //   { path: 'home', component: HomeComponent },
        //   { path: 'profile', component: ProfileComponent },
        //   { path: 'settings', component: SettingsComponent },
        // Add other routes here
      ],
    },
  ];
  return routes;
}