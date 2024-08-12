import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Product } from './product.type';
import { ProductService } from './product.service';
import { TestBed } from '@angular/core/testing';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3002/bp/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products via GET', () => {
    const dummyProducts: Product[] = [
      { id: 'T001', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: new Date('2024-08-12'), date_revision: new Date('2025-08-12') },
      { id: 'T002', name: 'Product 2', description: 'Description 2', logo: 'logo2.png', date_release: new Date('2024-08-13'), date_revision: new Date('2025-08-13') }
    ];

    service.getProducts().subscribe(products => {
      expect(products.data.length).toBe(2);
      expect(products.data).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ data: dummyProducts });
  });



  it('should add a product via POST', () => {
    const newProduct: Product = { id: 'T003', name: 'Product 3', description: 'Description 3', logo: 'logo3.png', date_release: new Date('2024-08-14'), date_revision: new Date('2025-08-14') };

    service.addProduct(newProduct).subscribe(product => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(newProduct);
  });

  it('should edit a product via PUT', () => {
    const updatedProduct: Partial<Product> = { name: 'Updated Product', description: 'Updated Description' };
    const productId = 'T001';

    service.editProduct(productId, updatedProduct).subscribe(product => {
      expect(product.name).toBe('Updated Product');
      expect(product.description).toBe('Updated Description');
    });

    const req = httpMock.expectOne(`${apiUrl}/${productId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProduct);
    req.flush({ ...updatedProduct, id: productId });
  });

  /* it('should delete a product via DELETE', () => {
    const productId = 'T001';

    service.deleteProduct(productId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    //Aquí deberíamos chequear el id porque no nos va a devolver el resultado null

    const req = httpMock.expectOne(`${apiUrl}/${productId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  }); */

});
