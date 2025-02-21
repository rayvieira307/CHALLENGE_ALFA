import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './shared/pages/login-page/login-page';
import { ButtonPage } from './shared/pages/button-page/button-page';
import { AuthGuard } from './core/guard/auth-guard';
import { HomeComponent } from './shared/pages/homeCliente/home-page';
import { AdminHomeComponent } from './shared/pages/homeAdmin/home-admin';
import { UsersListComponent } from './shared/pages/userList/user-list';
import { ProductListComponent } from './shared/pages/product/product';
/* import { PurchaseListComponent } from './shared/pages/purchase/purchase-list'; */

const routes: Routes = [
  { path: '', component: LoginPage },
  { path: 'button', component: ButtonPage, canActivate: [AuthGuard], data: { roles: ['user'] } },
  { path: 'home', component: HomeComponent , data: {roles: ['Client']} }, 
  { path: 'admin-home', component: AdminHomeComponent, data: {roles: ['Admin']} },
  { path: 'user-list', component: UsersListComponent },
  { path: 'produtos', component: ProductListComponent },
/*   { path: 'admin/purchases', component: PurchaseListComponent}, */
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 