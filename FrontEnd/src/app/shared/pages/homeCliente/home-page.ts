import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/ProductService';
import { Product } from '../../../core/models/Product';
import { UserService } from '../../../core/services/UserService';
import { PurchaseService } from '../../../core/services/PurchaseService';
import { Purchase } from '../../../core/models/Purchase';

@Component({
  selector: 'app-home',
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomeComponent implements OnInit {
  cartItemCount: number = 0;
  searchTerm: string = '';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  movedIndex: number | null = null;
  cart: { product: Product, quantity: number }[] = [];
  userId: number = 7;
  tempQuantities: { [productId: number]: number } = {};
  showCartModal: boolean = false;  // Para controlar a visibilidade do modal
  showHistoryModal: boolean = false;  // Para controlar o modal de histórico
  userPurchases: Purchase[] = []; // Lista de compras do usuário

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private purchaseService: PurchaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserIdFromSession();
    this.checkAccess();
    this.loadProducts();
  }

  private getUserIdFromSession(): void {
    this.userId = this.userService.getUserIdFromSession();
    if (this.userId === 0) {
      console.error('Erro: usuário não autenticado ou sem userId');
      this.router.navigate(['/login']);
    }
  }

  filterProducts(): void {
    if (!this.searchTerm) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  moveCard(index: number): void {
    this.movedIndex = index;
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.filteredProducts = [...this.products];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar produtos:', error);
        this.isLoading = false;
      },
    });
  }

  checkAccess(): void {
    const userRoles = this.userService.getCurrentAccessLevel();
    if (!userRoles || userRoles.length === 0 || this.userId === 0) {
      console.log('Usuário não autenticado ou sem roles. Redirecionando para login...');
      this.router.navigate(['/login']);
      return;
    }

    if (userRoles.includes('Admin')) {
      this.router.navigate(['/admin-home']);
    } else if (userRoles.includes('Client')) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  addToCart(product: Product): void {
    const existingItem = this.cart.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += this.tempQuantities[product.id] || 1;
    } else {
      this.cart.push({ product, quantity: this.tempQuantities[product.id] || 1 });
    }

    this.tempQuantities[product.id] = 0;
    this.updateCartCount();
  }

  updateCartCount(): void {
    this.cartItemCount = this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Método para abrir o modal do carrinho
  openCartModal(): void {
    this.showCartModal = true;
    console.log('Modal do Carrinho aberto');
  }

  // Método para fechar o modal do carrinho
  closeCartModal(): void {
    this.showCartModal = false;
    console.log('Modal do Carrinho fechado');
  }

  buy(): void {
    if (this.cart.length === 0) {
      alert('Carrinho vazio! Adicione itens ao carrinho antes de comprar.');
      return;
    }

    const purchaseData = {
      userId: this.userId,
      items: this.cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    console.log('Dados da compra:', purchaseData);

    this.purchaseService.comprar(this.userId, purchaseData).subscribe({
      next: (purchase) => {
        console.log('Compra realizada com sucesso:', purchase);
        alert('Compra realizada com sucesso!');
        this.cart = [];
        this.cartItemCount = 0;
        this.closeCartModal();
      },
      error: (error) => {
        console.error('Erro ao realizar a compra:', error);
        alert('Houve um erro ao processar a compra. Tente novamente.');
      }
    });
  }

  // Método para exibir o histórico de compras
  showPurchaseHistory(): void {
    this.purchaseService.getUserPurchases(this.userId).subscribe({
      next: (purchases) => {
        this.userPurchases = purchases;
        this.showHistoryModal = true;
        console.log('Histórico de compras carregado');
      },
      error: (error) => {
        alert('Voce ainda nao possui nenhuma compra');
      }
    });
  }

  openHistoryModal() {
    console.log('Modal aberto');
    this.showHistoryModal = true; // Abre o modal
  }

  closeHistoryModal(): void {
    this.showHistoryModal = false;
    console.log('Modal de Histórico fechado');
  }

}
