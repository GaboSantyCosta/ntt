import { ProductFormComponent } from './modules/product-form/product-form.component';
import { ProductListComponent } from './modules/product-list/product-list.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'products', component: ProductListComponent },
    { path: 'products/new', component: ProductFormComponent },
    { path: 'products/edit/:id', component: ProductFormComponent },
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: '**', redirectTo: '/products' }
];
