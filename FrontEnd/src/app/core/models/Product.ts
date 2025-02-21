export interface Product {
  id: number;
  name: string;
  price: number;
}


export class ProductInsert {
  name: string = "";
  price: number = -1;
}

export class ProductUpdate {
  id: number = -1;
  name: string = "";
  price: number = -1;
}
