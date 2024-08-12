import { CommonModule, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../components/icon/icon.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { PaginatePipe } from '../../pipes/paginate/paginate.pipe';
import { Product } from '../../services/product/product.type';
import { ProductFilterPipe } from '../../pipes/product-filter/product-filter.pipe';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgFor,RouterModule,FormsModule,ProductFilterPipe,PaginatePipe,IconComponent,CommonModule,ModalComponent,ContextMenuComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: Product[] = [];
  searchPrompt: string = '';
  displayedProducts: number = 5;
  
  
  isContextMenuVisible: boolean = false;
  contextMenuX: number = 0;
  contextMenuY: number = 0;
  selectedProduct: Product | null = null;
  modalIsOpen: boolean = false;
  
  private router: Router = inject(Router);

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe(res=>{
      this.products = res.data;
    });
  }
  
  openMenu(event: MouseEvent,product: Product): void {
    event.preventDefault();
    this.selectedProduct = product;
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
  }

  getSearchValue(): string {
    return this.searchPrompt;
  }
  
  handleEdit() {
    console.log(this.selectedProduct!.id)
    this.router.navigateByUrl(`products/edit/${this.selectedProduct!.id}`);
    this.selectedProduct = null;
  }
  
  handleDelete() {
    this.modalIsOpen = true;
  }
  
  handleConfirm() {
    this.modalIsOpen = false;
    this.productService.deleteProduct(this.selectedProduct!.id).subscribe(() => {
      this.loadProducts();
    });;
    
    this.selectedProduct = null;
  }
  
  handleCancel() {
    this.modalIsOpen = false;
    this.selectedProduct = null;
  }
}
