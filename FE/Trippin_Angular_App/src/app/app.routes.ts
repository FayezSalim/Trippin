import { Routes } from '@angular/router';
import { AuthGuard, provideUserManagementRoutes } from '@trippin/user-management';

export const routes: Routes = [
    ...provideUserManagementRoutes()
];
