/* import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Purchase, PurchaseInsert } from '../models/Purchase';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private BASE_URL = 'http://localhost:5286';  // Substitua com o endpoint correto

  constructor(private http: HttpClient) { }

  // Método para buscar todas as compras
  getAllPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.BASE_URL}/api/Purchase/listar`);
  }

  // Método para buscar as compras de um usuário específico
  getUserPurchases(userId: number): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.BASE_URL}/api/Purchase/listar/${userId}`);
  }

  // Método para adicionar uma nova compra
  addPurchase(purchase: PurchaseInsert): Observable<Purchase> {
    return this.http.post<Purchase>(`${this.BASE_URL}/api/Purchase/adicionarAoCarrinho`, purchase);
  }

  // Método para editar uma compra existente
  updatePurchase(purchase: Purchase): Observable<Purchase> {
    return this.http.put<Purchase>(`${this.BASE_URL}/api/Purchase/${purchase.id}`, purchase);
  }

  // Método para excluir uma compra
  deletePurchase(purchaseId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/api/Purchase/${purchaseId}`);
  }
}
 */