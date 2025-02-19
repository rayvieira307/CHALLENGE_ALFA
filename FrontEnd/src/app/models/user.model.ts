export interface User {
  id: number;
  name: string;
  email: string;
  role: 'client' | 'admin';  // Aqui estamos dizendo que 'role' pode ser 'client' ou 'admin'
}