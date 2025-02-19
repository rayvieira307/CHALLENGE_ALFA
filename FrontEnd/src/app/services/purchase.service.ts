import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Purchase } from '../models/purchase.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private apiUrl = 'http://localhost:5286/api/purchases';  // Substitua pela URL da sua API

  constructor(private http: HttpClient) { }

  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.apiUrl);
  }

  getPurchasesByUserId(userId: number): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}?userId=${userId}`);
  }

  addPurchase(purchase: Purchase): Observable<Purchase> {
    return this.http.post<Purchase>(this.apiUrl, purchase);
  }
  
}
