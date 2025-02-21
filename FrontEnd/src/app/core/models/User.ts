export class User {
  id: number = -1;
  email: string = "";
  name: string = "";
  role: string = "";  
  password?: string;
}


export class UserLogin {
  Email: string = "";
  Password: string = "";
}

export class UserInsert {
  email: string = "";
  name: string = "";
  role: string = "";  
  password?: string;
}

export class UserUpdate {
  id: number = -1;
  name: string = "";
  role: string = ""; 
}
