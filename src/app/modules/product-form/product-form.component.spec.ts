import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../services/product/product.service';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async () => {
    const productServiceMock = jasmine.createSpyObj('ProductService', ['getProducts', 'addProduct', 'editProduct']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    
    const activatedRouteSnapshotStub: Partial<ActivatedRouteSnapshot> = {
      paramMap: convertToParamMap({ id: 'T001' })
    };

    activatedRouteStub = {
      snapshot: activatedRouteSnapshotStub as ActivatedRouteSnapshot
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Mocked product data
    productServiceSpy.getProducts.and.returnValue(of({
      data: [
        { id: 'T001', name: 'Product 1', description: 'Description 1', logo: 'logot001.png', date_release: new Date('2024-08-12'), date_revision: new Date('2025-08-12') }
      ]
    }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch to edit mode if productId is provided in route', () => {
    component.ngOnInit();
    expect(component.isEditMode).toBeTrue();
    expect(component.productForm.get('id')?.value).toBe('T001');
  });

  it('should handle product save for new product', () => {
    component.isEditMode = false;
    component.productForm.setValue({
      id: 'T002',
      name: 'Product 2',
      description: 'Description 2',
      logo: 'logo2.png',
      date_release: new Date('2024-08-13'),
      date_revision: new Date('2025-08-13')
    });

    const navigateSpy = routerSpy.navigate.and.returnValue(Promise.resolve(true));
    productServiceSpy.addProduct.and.returnValue(of(component.productForm.value));

    component.saveProduct();

    expect(productServiceSpy.addProduct).toHaveBeenCalledWith(component.productForm.value);
    expect(navigateSpy).toHaveBeenCalledWith(['/products']);
  });

  it('should handle product save for existing product', () => {
    component.isEditMode = true;
    component.productForm.setValue({
      id: 'T001',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logot001.png',
      date_release: '12-08-2024',
      date_revision: '12-08-2025'
    });

    const navigateSpy = routerSpy.navigate.and.returnValue(Promise.resolve(true));
    productServiceSpy.editProduct.and.returnValue(of(component.productForm.value));

    component.saveProduct();

    expect(productServiceSpy.editProduct).toHaveBeenCalledWith('T001', component.productForm.value);
    expect(navigateSpy).toHaveBeenCalledWith(['/products']);
  });

  it('should display an error message if product save fails', () => {
    const errorResponse = { message: 'Save failed' };
    component.isEditMode = false;
    component.productForm.setValue({
      id: 'T002',
      name: 'Product 2',
      description: 'Description 2',
      logo: 'logo2.png',
      date_release: new Date('2024-08-13'),
      date_revision: new Date('2025-08-13')
    });

    productServiceSpy.addProduct.and.returnValue(throwError(() => errorResponse));

    component.saveProduct();

    expect(component.errorMessage).toBe('Save failed');
  });

  it('should reset form', () => {
    component.productForm.setValue({
      id: 'T002',
      name: 'Product 2',
      description: 'Description 2',
      logo: 'logot002.png',
      date_release: '13-08-2024',
      date_revision: '13-08-2025'
    });

    component.resetForm();

    expect(component.productForm.value).toEqual({
      id: null,
      name: null,
      description: null,
      logo: null,
      date_release: null,
      date_revision: null
    });
  });

});
