import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../../core/services/PurchaseService'; // Importe o serviço de compras
import { Purchase } from 'src/app/core/models/Purchase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.html',
  styleUrls: ['./purchase-list.css']
})
export class PurchaseComponent implements OnInit {

  purchases: { userName: string, purchases: Purchase[], total: number }[] = [];
  searchTerm: string = ''; // Variável para o termo de pesquisa

  constructor(private purchaseService: PurchaseService, private router: Router) {}

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases(): void {
    this.purchaseService.getAllPurchases().subscribe({
      next: (data: Purchase[]) => {
        // Agrupar compras por usuário
        const groupedPurchases: { [userName: string]: { userName: string, purchases: Purchase[], total: number } } = {};

        data.forEach((purchase) => {
          const userName = purchase.userName;  // Agora usamos o userName da API
          if (!groupedPurchases[userName]) {
            groupedPurchases[userName] = {
              userName,
              purchases: [],
              total: 0
            };
          }
          groupedPurchases[userName].purchases.push(purchase);
          groupedPurchases[userName].total += purchase.total;  // Somar o total das compras do usuário
        });

        // Converter o objeto em um array de compras agrupadas
        this.purchases = Object.values(groupedPurchases);
      },
      error: (error) => {
        console.error('Erro ao carregar compras', error);
      }
    });
  }

  // Método para filtrar as compras com base no nome de usuário
  filteredPurchases() {
    if (!this.searchTerm) {
      return this.purchases;
    }
    return this.purchases.filter(group => 
      group.userName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
