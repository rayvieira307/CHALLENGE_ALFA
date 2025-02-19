export class Purchase {
    id: number;
    userId: number;
    amount: number;
    date: string;
  
    constructor(id: number, userId: number, amount: number, date: string) {
      this.id = id;
      this.userId = userId;
      this.amount = amount;
      this.date = date;
    }
  }
  