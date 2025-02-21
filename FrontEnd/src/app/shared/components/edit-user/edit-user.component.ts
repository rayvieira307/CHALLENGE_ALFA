import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../../core/services/UserService';  
import { User } from '../../../core/models/User'; 
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserModalComponent {
  user: User;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<EditUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.user = { ...data };  
  }

  saveUser() {
    this.userService.updateUser(this.user).subscribe(
      (updatedUser: User) => {  // Adicionando o tipo User aqui
        console.log('Usuário atualizado:', updatedUser);
        this.dialogRef.close(updatedUser);
  
        // Recarrega a página após a atualização
        location.reload();
      },
      (error: HttpErrorResponse) => { 
        console.error('Erro ao atualizar:', error);
        alert('Erro ao atualizar o usuário.');
      }
    );
  }
  

}
