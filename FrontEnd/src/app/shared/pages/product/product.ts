import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/ProductService';
import { Product, ProductUpdate } from '../../../core/models/Product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product.html',  
  styleUrls: ['./product.css'],  
}) 
export class ProductListComponent implements OnInit {
  products: Product[] = []; 
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  isLoading = false;  
  isModalOpen = false;  
  newProduct: Product = {id: 0, name: '', price: 0 };  
  productToEdit: ProductUpdate = new ProductUpdate();
  isEditing: boolean = false;


  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();  
  }

  voltar() {
    this.router.navigate(['/admin-home']);
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

  filterProducts() {
    if (this.searchQuery) {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredProducts = [];
    }
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditing = false;
    this.newProduct = { id:0,  name: '', price: 0 };  
  }

  createProduct(): void {
    if (this.newProduct.name && this.newProduct.price) {
      this.productService.createProduct(this.newProduct).subscribe({
        next: (data) => {
          this.loadProducts(); // Recarrega a lista de produtos
          this.closeModal(); // Fecha o modal após a criação
        },
        error: (err) => {
          console.error('Erro ao adicionar o produto:', err);
        },
      });
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  }


  updateProduct(): void {
    this.productService.updateProduct(this.productToEdit.id, this.productToEdit).subscribe({
      next: (updatedProduct) => {
        console.log('Produto atualizado com sucesso!', updatedProduct);
        this.loadProducts();
        this.closeModal();
      },
      error: (err) => {
        console.error('Erro ao atualizar o produto:', err);
      },
    });
  }

  editProduct(id: number): void {
    this.productService.getProduct(id).subscribe((product: Product) => {
      this.productToEdit = new ProductUpdate();
      this.productToEdit.id = product.id;
      this.productToEdit.name = product.name;
      this.productToEdit.price = product.price;

      // Agora, definimos que o modal é de edição
      this.isEditing = true;

      // Abrir o modal de edição
      this.openModal();
    });
  }

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
}
