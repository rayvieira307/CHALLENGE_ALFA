import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { LoginPage } from './shared/pages/login-page/login-page';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
 import { HomeComponent } from './shared/pages/homeCliente/home-page'; 
import { AdminHomeComponent } from './shared/pages/homeAdmin/home-admin';
import { UsersListComponent } from './shared/pages/userList/user-list';
import { EditUserModalComponent } from './shared/components/edit-user/edit-user.component';
import { ProductListComponent } from './shared/pages/product/product';
import { PurchaseComponent } from './shared/pages/purchase/purchase-list';


@NgModule({
  declarations: [
    ProductListComponent,
    PurchaseComponent,
    EditUserModalComponent,
    UsersListComponent,
    AdminHomeComponent,
    HomeComponent, 
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginPage,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule
  ],
  providers: [
 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
