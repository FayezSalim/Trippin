/*
 * Public API Surface of user-management
 */

export { provideUserManagement, provideUserManagementRoutes } from './lib/providers/user-management.providers';
export { AuthGuard } from './lib/guards/auth.guard';
export { ToolBarComponent } from './lib/components/toolbar/toolBar.component';
export { AuthService } from './lib/services/auth.service';