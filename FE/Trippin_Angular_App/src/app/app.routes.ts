import { Routes } from '@angular/router';
import { AuthGuard, LoginComponent } from '@trippin/user-management';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent, //chabnge to providers from @trippin/user-management which contains routes,guards
    },{
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
