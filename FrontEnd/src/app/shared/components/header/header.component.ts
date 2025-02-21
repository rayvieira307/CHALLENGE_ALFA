import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../app/core/services/UserService';  // Ajuste o caminho conforme necessário

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: string | null = null;
  accessLevel: string | null = null;
  isLoggedIn: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {

    this.userService.user$.subscribe(userData => {
      if (userData) {
        this.user = userData.name;
        this.accessLevel = userData.roles;
        this.isLoggedIn = true;
      } else {
        this.user = null;
        this.accessLevel = null;
        this.isLoggedIn = false;
      }
    });
  }

  // Logout
  Logout() {
    this.userService.Logout();
    this.router.navigate(['']);
    localStorage.removeItem('userToken');
  }
}
