import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBar } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { SpinnerService } from 'src/app/shared/components/spinner/spinner.service';
import { UserLogin } from 'src/app/core/models/User';
import { UserService } from 'src/app/core/services/UserService';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPage {
  user: UserLogin = new UserLogin();

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: SnackBar,
    private spiner: SpinnerService) { }

  ngOnInit(): void { }

  CheckBlank() {
    if (!this.user.Email) {
      this.snackBar.open("User Cannot Be Blank", true);
      return true;
    }
    if (!this.user.Password) {
      this.snackBar.open("Password Cannot Be Blank", true);
      return true;
    }
    return false;
  }

  Login() {
    if (!this.CheckBlank()) {
      this.spiner.show();
      this.userService.Login(this.user).subscribe({
        next: (response) => {
          // Salva o token e outras informações no sessionStorage
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('roles', response.role);  // Assumindo que a resposta tem o 'role'
          sessionStorage.setItem('name', response.name);
  
          // Verifica a role do usuário e faz o redirecionamento
          const userRole = sessionStorage.getItem('roles');
          if (userRole === 'Admin') {
            this.router.navigate(['/admin-home']);  // Redireciona para a página do Admin
          } else {
            this.router.navigate(['/home']);  // Redireciona para a página do Client (usuário comum)
          }
        },
        error: (error) => {
          this.spiner.hide();
          this.snackBar.open(error.statusText, true);
        },
        complete: () => this.spiner.hide()
      });
    }
  }
}
  
