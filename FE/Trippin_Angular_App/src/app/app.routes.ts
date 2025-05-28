import { Routes } from '@angular/router';
import { provideUserManagementRoutes } from '@trippin/user-management';
import { provideTripsRoutes } from '@trippin/trips';

export const routes: Routes = [
    ...provideUserManagementRoutes(),
    ...provideTripsRoutes()
];
