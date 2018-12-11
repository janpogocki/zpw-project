import {Component, Input, OnInit} from '@angular/core';
import {Product} from './product';
import {MatSnackBar} from '@angular/material';
import {ProductsProviderService} from '../products-provider.service';
import {CartService} from '../cart.service';
import {CartUtils} from '../utils/cart-utils';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input() product: Product;

  constructor(private productsProvider: ProductsProviderService,
              private cartService: CartService,
              public snackbar: MatSnackBar) {
  }

  ngOnInit() {
  }

  addToChart() {
    CartUtils.addToCart(this.product, 1, this.cartService, this.snackbar);
  }

  refreshPromotion() {
    this.product.discountTimeout = undefined;
    this.product.price = this.product.oldPrice;
    this.product.oldPrice = undefined;
  }

}

