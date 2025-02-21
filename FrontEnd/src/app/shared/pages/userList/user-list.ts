import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/UserService';
import { MatDialog } from '@angular/material/dialog';  // Importa o MatDialog
import { EditUserModalComponent } from '../../components/edit-user/edit-user.component'; // O caminho do seu modal
import { User } from '../../../core/models/User'; 
import { trigger, transition, animate, style } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css'],
  animations: [
    trigger('fadeIn', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class UsersListComponent implements OnInit {

  novoUsuario = { name: '', role: '', email: '', password: "" };
  mostrarModal = false;
  users: User[] = [];

  constructor(private userService: UserService, private dialog: MatDialog, private router: Router) {}


  voltar() {
    this.router.navigate(['/admin-home']); // ou para uma rota específica, como '/login'
  }


  abrirModal() {
    this.mostrarModal = true;
  }

  // Função para fechar o modal
  fecharModal() {
    this.mostrarModal = false;
  }

  // Função para adicionar um novo usuário
  adicionarUsuario() {
  
    this.userService.addUser(this.novoUsuario).subscribe(
      (response) => {
    
        this.users.push(response);

       
        this.fecharModal();

   
        this.novoUsuario = { name: '', role: '', email: '', password: "" };

    
        alert('Usuário Adicionado! Confira na lista de usuários.');
      },
      (error) => {

        console.error('Erro ao adicionar o usuário:', error);
        alert('Erro ao adicionar o usuário. Tente novamente.');
      }
    );
  }


  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }


  editUser(user: User) {
    const dialogRef = this.dialog.open(EditUserModalComponent, {
      width: '400px',
      data: user  
    });

    dialogRef.afterClosed().subscribe(updatedUser => {
      if (updatedUser) {
       
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser; 
        }
      }
    });
  }

  deleteUser(userId: number) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.loadUsers();  // Recarregar a lista após exclusão
      }, error => {
        console.error('Erro ao excluir o usuário', error);
        alert('Erro ao excluir o usuário. Tente novamente!');
      });
    }
  }
}
