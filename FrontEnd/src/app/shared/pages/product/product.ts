import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/ProductService';
import { Product } from '../../../core/models/Product';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-product-list',
  templateUrl: './product.html',  
  styleUrls: ['./product.css'],  
})
export class ProductListComponent implements OnInit {
  products: Product[] = []; 
  isLoading = false;  

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();  
  }

  voltar() {
    this.router.navigate(['/admin-home']); // ou para uma rota específica, como '/login'
  }


  loadProducts(): void {
    this.isLoading = true; 
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data; 
        this.isLoading = false; 
      },
      error: (error: any) => {
        console.error('Erro ao carregar produtos:', error);
        this.isLoading = false; 
      },
    });
  }

 
  editProduct(id: number): void {
  
    this.router.navigate(['/produtos', id]);  
  }

  // Método para excluir um produto
  deleteProduct(id: number): void {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();  
        },
        error: (err) => {
          console.error('Erro ao excluir o produto:', err);
        },
      });
    }
  }

 
  createProduct(): void {
    this.router.navigate(['/produtos/criar']); 
  }


  viewProduct(id: number): void {
    this.router.navigate(['/produtos', id]);  
  }
}
