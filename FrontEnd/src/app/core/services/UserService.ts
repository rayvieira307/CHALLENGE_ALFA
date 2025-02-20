import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';  // Importando o Router

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(this.getCurrentUserData());
  public user$: Observable<any> = this.userSubject.asObservable();

  private BASE_URL = 'http://localhost:5286';  

  constructor(private http: HttpClient, private router: Router) { }  

  Login(user: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/login`, user).pipe(
      map(response => {
        if (response && response.token) {
          const decodedToken = this.decodeJWT(response.token);
          const userName = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
          const userId = decodedToken['userId'];
          const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  
          console.log('Decoded Token:', decodedToken);
          console.log('User Role:', userRole);
  
          // Armazenar as informações no localStorage
          localStorage.setItem('name', userName);
          localStorage.setItem('userId', userId);
          localStorage.setItem('roles', userRole);  // Verifique se roles está correto
          localStorage.setItem('token', response.token);
  
          // Atualizar o BehaviorSubject com os dados do usuário
          this.userSubject.next({
            name: userName,
            userId: userId,
            roles: userRole
          });
  
          // Lógica de redirecionamento com base na role
          this.redirectBasedOnRole(userRole);
        }
        return response;
      })
    );
  }

  private decodeJWT(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token JWT inválido');
    }
    const payloadBase64Url = parts[1];
    let base64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4;
    if (padding) {
      base64 = base64 + '='.repeat(4 - padding);
    }
    const payloadJson = atob(base64);
    return JSON.parse(payloadJson);
  }

  // Método para redirecionar o usuário com base em sua role
  private redirectBasedOnRole(userRole: string): void {
    // Caso o usuário seja um admin
    if (userRole === 'Admin') {
      this.router.navigate(['/admin-home']);
    }
    // Caso o usuário seja um usuário comum
    else if (userRole === 'Client') {
      this.router.navigate(['/home']);
    }
    else {
      this.router.navigate(['/login']);
      console.log('Role inválida ou não reconhecida');
    }
  }

  getCurrentUserData() {
    return {
      name: localStorage.getItem('name'),
      userId: localStorage.getItem('userId'),
      roles: localStorage.getItem('roles')
    };
  }

  getCurrentToken(): string | null {
    return localStorage.getItem('token');
  }

  // Obter o nível de acesso do usuário (role)
  getCurrentAccessLevel(): string[] {
    const token = this.getCurrentToken();
    if (token) {
      const decodedToken = this.decodeJWT(token);
      const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      
      if (roles) {
        return Array.isArray(roles) ? roles : [roles]; 
      }
    }
    return [];  
  }
  
  Logout() {
   localStorage.clear();
    localStorage.removeItem('user_data'); 
    this.userSubject.next(null); 
    this.router.navigate(['/login']); 
  }
  
}  
