import {Component, OnInit} from '@angular/core';
import {CartService} from '../cart.service';
import {CartUtils} from '../utils/cart-utils';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  items = 0;
  price = 0;

  constructor(private cartService: CartService,
              private snackbar: MatSnackBar) {
    cartService.productsInCartChanged$
      .subscribe(value => {
        this.items = cartService.getSumOfProducts(value);
        this.price = cartService.getAmountOfProducts(value);
      });
  }

  ngOnInit() {
  }

  isCartEmpty() {
    return this.items === 0;
  }

  removeFromCart(id: string) {
    this.cartService.removeFromCart(id);
    CartUtils.showSnackbar(this.snackbar, 'Produkt usunięty z koszyka');
  }

}
