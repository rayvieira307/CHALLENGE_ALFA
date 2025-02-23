 export interface PurchaseItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Purchase {
  id: number;
  userName: string;  
  orderDate: Date;
  total: number;
  items: PurchaseItem[];
}

export interface PurchaseItemRequest {
  productId: number;
  quantity: number;
}

 