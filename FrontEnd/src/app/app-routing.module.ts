import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './shared/pages/login-page/login-page';
import { ButtonPage } from './shared/pages/button-page/button-page';
import { AuthGuard } from './core/guard/auth-guard';
import { HomeComponent } from './shared/pages/homeCliente/home-page';
import { AdminHomeComponent } from './shared/pages/homeAdmin/home-admin';

const routes: Routes = [
  { path: '', component: LoginPage },
  { path: 'button', component: ButtonPage, canActivate: [AuthGuard], data: { roles: ['user'] } },
  { path: 'home', component: HomeComponent , data: {roles: ['Client']} }, 
  { path: 'admin-home', component: AdminHomeComponent, data: {roles: ['Admin']} },
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 