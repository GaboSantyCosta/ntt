import { Pipe, PipeTransform } from '@angular/core';

import { Product } from '../../services/product/product.type';

@Pipe({
  name: 'productFilter',
  standalone: true
})
export class ProductFilterPipe implements PipeTransform {

  transform(value: Product[], search: string): Product[] {
    if (!search) {return value}
    let res: Product[] = value.filter(v => {
    	if (!v.name) {return }
    	return v.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    })
    return res;
  }

}
