import { StaticProvider } from "@angular/core";
import { Routes } from "@angular/router";
import { LoginComponent } from "../components/login/login.component";
import { AuthGuard } from "../guards/auth.guard";
import { UserMangementProviderOptions } from "../models/user-management-provider.options";

/**
 * @api
 * @param options
 * @returns 
 */
export function provideUserManagement(options?: UserMangementProviderOptions): StaticProvider[] {
  return [

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