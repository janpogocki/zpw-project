import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../../../../src/app/product/product';
import {getReadableProducts} from '../utils/utils';
import {ProductsProviderService} from '../../../../../src/app/products-provider.service';
import {MatSnackBar} from '@angular/material';
import {CartUtils} from '../../../../../src/app/utils/cart-utils';

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.css']
})
export class OrderTableComponent implements OnInit {

  @Input() orders: any[];
  @Input() products: Product[];

  constructor(private productsProvider: ProductsProviderService,
              private snackbar: MatSnackBar) { }

  ngOnInit() {
  }

  getReadableProducts(products: any[]): string[] {
    return getReadableProducts(products, this.products);
  }

  finish(id: string) {
    this.productsProvider.finishOrder(id)
      .then(() => CartUtils.showSnackbar(this.snackbar, 'Zamówienie zostało zrealizowane'))
      .catch(error => CartUtils.showSnackbar(this.snackbar, 'Problem z ustawieniem statusu zamówienia (error ' + error.status + ')'));
  }

  reject(id: string, order: any) {
    this.productsProvider.rejectOrder(id, order.products, this.products)
      .then(() => CartUtils.showSnackbar(this.snackbar, 'Zamówienie zostało odrzucone'))
      .catch(error => CartUtils.showSnackbar(this.snackbar, 'Problem z ustawieniem statusu zamówienia (error ' + error.status + ')'));
  }
}
