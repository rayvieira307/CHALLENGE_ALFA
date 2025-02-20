import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/UserService'; 

@Component({
  selector: 'app-home',
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomeComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.checkAccess();
  }

  private checkAccess() {
    const userRoles = this.userService.getCurrentAccessLevel();
    
    if (!userRoles || userRoles.length === 0) {
      console.log('Usuário não tem roles ou não está autenticado. Redirecionando para login...');
      this.router.navigate(['/login']);
      return;
    }

    if (userRoles.includes('Admin')) {
      console.log('Usuário com role Admin. Redirecionando para a página do admin...');
     
      this.router.navigate(['/admin-home']); 
    } else if (userRoles.includes('Client')) {
      console.log('Usuário com role Client. Redirecionando para a página do cliente...');
      
      this.router.navigate(['/home']);
    } else {
      console.log('Role não reconhecida. Redirecionando para login...');
      this.router.navigate(['/login']); 
    }
  }
}
