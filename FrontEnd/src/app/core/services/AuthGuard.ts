import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from './UserService';  

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Verifica se o usuário está autenticado (com base no token)
    const token = this.userService.getCurrentToken();
    
    if (!token) {
      // Se não houver token, redireciona para o login
      this.router.navigate(['/login']);
      return false;
    }
  
    // Chama o UserService para redirecionar com base na role do usuário
    this.userService.handleRedirectionBasedOnRole();
    return true;
  }
}
