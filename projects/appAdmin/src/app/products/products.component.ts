import { Component, OnInit } from '@angular/core';
import {ProductsProviderService} from '../../../../../src/app/products-provider.service';
import {Product} from '../../../../../src/app/product/product';
import {MatSnackBar, Sort} from '@angular/material';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {CartUtils} from '../../../../../src/app/utils/cart-utils';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[];
  sortedProducts: Product[];
  checkedProducts: string[];

  constructor(private productsProvider: ProductsProviderService,
              private authService: AuthService,
              private router: Router,
              private snackbar: MatSnackBar) {
    this.products = [];
    this.checkedProducts = [];

    if (!authService.isUserEmailLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.productsProvider.getProducts()
      .subscribe((products: Product[]) => {
        this.products = products;
        this.sortedProducts = products.slice();
      });
  }

  sortData(sort: Sort) {
    const data = this.products.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedProducts = data;
      return;
    }

    this.sortedProducts = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'quantity': return this.compare(a.quantity, b.quantity, isAsc);
        case 'price': return this.compare(a.price, b.price, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  remove(id: string) {
    this.productsProvider.removeProductInDB(id)
      .then(() => CartUtils.showSnackbar(this.snackbar, 'Produkt usunięto z bazy'))
      .catch(error => CartUtils.showSnackbar(this.snackbar, 'Problem z usunięciem produktu z bazy (error ' + error.status + ')'));
  }

  isPromotionsButtonDisabled(): boolean {
    return this.checkedProducts.length === 0;
  }

  addOrRemoveIdInCheckedProducts(id: string) {
    if (this.checkedProducts.includes(id)) {
      this.checkedProducts.splice(this.checkedProducts.indexOf(id));
    } else {
      this.checkedProducts.push(id);
    }
  }
}
