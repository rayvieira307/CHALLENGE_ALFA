import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Purchase, PurchaseItemRequest } from '../models/Purchase';


@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private BASE_URL = 'http://localhost:5286';  

  constructor(private http: HttpClient) { }


  getAllPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.BASE_URL}/api/Purchase/listar`);
  }


  getUserPurchases(userId: number): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.BASE_URL}/api/Purchase/listar/${userId}`);
  }

  comprar(userId: number, items: PurchaseItemRequest[]): Observable<any> {
    console.log(`${this.BASE_URL}/api/Purchase/comprar/${userId}`);
    console.log('Comprando com os seguintes itens:', items);
    return this.http.post<Purchase>(`${this.BASE_URL}/api/Purchase/comprar/${userId}`, items);
  }
  
}
