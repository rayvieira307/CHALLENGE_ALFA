import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/UserService';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router,) { }

    canActivate(
        next: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        
        const allowedRoles = next.data['roles'] as Array<string>; 
        const userRoles = this.userService.getCurrentAccessLevel(); 
        
        // Verifique se o usuário tem roles válidas
        if (!Array.isArray(userRoles) || userRoles.length === 0) {
            console.log('Roles do usuário não são válidas ou estão vazias');
            this.router.navigate(['/login']);  
            return false;  
        }

       
        const hasAccess = allowedRoles.some(role => userRoles.includes(role));
        
        if (!hasAccess) {
            console.log('Usuário não tem permissão');
            this.router.navigate(['/login']);  
            return false;  
        }
        
        return true; 
    }
}
