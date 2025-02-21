/* import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../../core/services/PurchaseService';
import { Purchase, PurchaseInsert } from '../../../core/models/Purchase';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditUserModalComponent } from '../../components/edit-user/edit-user.component';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.html',
  styleUrls: ['./purchase-list.css'],
})
export class PurchaseListComponent implements OnInit {
  purchases: Purchase[] = [];
  novoPurchase: PurchaseInsert = { userId: -1, productName: '', amount: 0, date: '' };
  mostrarModal = false;

  constructor(private purchaseService: PurchaseService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPurchases();  // Carregar todas as compras do admin
  }

  // Função para carregar as compras
  loadPurchases(): void {
    this.purchaseService.getAllPurchases().subscribe((purchases: Purchase[]) => {
      this.purchases = purchases;
    });
  }

  // Função para abrir o modal de adicionar compra
  abrirModal(): void {
    this.mostrarModal = true;
  }

  // Função para fechar o modal de adicionar compra
  fecharModal(): void {
    this.mostrarModal = false;
  }

  // Função para adicionar uma nova compra
  adicionarPurchase(): void {
    this.purchaseService.addPurchase(this.novoPurchase).subscribe(
      (response) => {
        this.purchases.push(response);
        this.fecharModal();
        this.novoPurchase = { userId: -1, productName: '', amount: 0, date: '' };
        alert('Compra adicionada com sucesso!');
      },
      (error) => {
        console.error('Erro ao adicionar compra', error);
        alert('Erro ao adicionar a compra. Tente novamente!');
      }
    );
  }
  editPurchase(purchase: Purchase): void {
    // Exemplo de implementação - abrir um modal de edição
    const dialogRef = this.dialog.open(EditUserModalComponent, {
      width: '400px',
      data: purchase
    });

    dialogRef.afterClosed().subscribe(updatedPurchase => {
      if (updatedPurchase) {
        const index = this.purchases.findIndex(p => p.id === updatedPurchase.id);
        if (index !== -1) {
          this.purchases[index] = updatedPurchase; 
        }
      }
    });
  }
  // Função para excluir uma compra
  deletePurchase(purchaseId: number): void {
    if (confirm('Tem certeza que deseja excluir esta compra?')) {
      this.purchaseService.deletePurchase(purchaseId).subscribe(
        () => {
          this.loadPurchases();  // Recarregar a lista após exclusão
          alert('Compra excluída com sucesso!');
        },
        (error) => {
          console.error('Erro ao excluir compra', error);
          alert('Erro ao excluir a compra. Tente novamente!');
        }
      );
    }
  }

}
  */