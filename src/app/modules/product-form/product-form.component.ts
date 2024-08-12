import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Product } from '../../services/product/product.type';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule,NgIf,ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  isEditMode = false;
  errorMessage = '';
  productForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['',[Validators.required, this.dateValidator()]],
      date_revision: ['',[Validators.required, this.reviewDateValidator()]]
    });

    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.isEditMode = true;
      this.productService.getProducts().subscribe(res => {
        const foundProduct = res.data.find(p => p.id === productId);
        console.log(foundProduct);
        if (foundProduct) {
          this.productForm.patchValue(foundProduct);
        } else {
          this.router.navigate(['/products']);
        }
      });
    }
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    const productData = this.productForm.value;
    
    productData.date_release = new Date(productData.date_release).toISOString().split('T')[0];
    productData.date_revision = new Date(productData.date_revision).toISOString().split('T')[0];

    if (this.isEditMode) {
      this.productService.editProduct(productData.id, productData).subscribe({
        next: () => this.router.navigate(['/products']),
        error: err => this.errorMessage = err.message
      });
    } else {
      this.productService.addProduct(productData).subscribe({
        next: () => this.router.navigate(['/products']),
        error: err => this.errorMessage = err.message
      });
    }
  }

  resetForm(): void {
    this.productForm.reset();
  }

  dateValidator() {
    return (control: FormControl) => {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();
      return selectedDate >= currentDate ? null : { invalidDate: true };
    };
  }

  reviewDateValidator() {
    return (control: FormControl) => {
      const releaseDate = new Date(this.productForm?.get('date_release')?.value);
      const reviewDate = new Date(control.value);
      const oneYearLater = new Date(releaseDate);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      console.log(reviewDate.getTime(), oneYearLater.getTime())

      return reviewDate.getTime() === oneYearLater.getTime() ? null : { invalidReviewDate: true };
    };
  }
}
