 export interface PurchaseItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseInsert {
  userId: number; 
  productId: number; 
  quantity: number; 
}

export interface Purchase {
  id: number;
  userName: string;  
  orderDate: Date;
  total: number;
  items: PurchaseItem[];
}

export interface PurchaseComprar {
  userId: number;
  items: PurchaseItemRequest[];
}

export interface PurchaseItemRequest {
  productId: number;
  quantity: number;
}

 