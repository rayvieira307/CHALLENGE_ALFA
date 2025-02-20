import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/UserService';
import { Router } from '@angular/router';  // Importando o Router

@Component({
  selector: 'app-admin-home',
  templateUrl: './home-admin.html',
  styleUrls: ['./home-admin.css']
})
export class AdminHomeComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router  // Injetando o Router
  ) {}

  ngOnInit(): void {
    // Lógica para exibir o conteúdo do Admin
    console.log("Bem-vindo à página Admin");

    // Verificando se o usuário tem o papel de 'admin'
    const userRole = this.userService.getCurrentAccessLevel();

  }
}
