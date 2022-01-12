import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './modules/login/login/login.component';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {AuthGuard} from './modules/auth/auth.guard';


const routes: Routes = [
  {
    path: 'scanner',
    loadChildren: () => import('./modules/scanner/scanner.module').then(m => m.ScannerModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/runners/runners.module').then(m => m.RunnersModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'runner-overview',
    loadChildren: () => import('./modules/runneroverview/runneroverview.module').then(m => m.RunnerOverviewModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/administration/administration.module').then(m => m.AdministrationModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'system',
    loadChildren: () => import('./modules/system/system.module').then(m => m.SystemModule),
  },
  {path: 'login', component: LoginComponent},
  {path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: "/login", pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
