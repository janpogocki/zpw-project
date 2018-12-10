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
        this.items = CartUtils.getSumOfProducts(value);
        this.price = CartUtils.getAmountOfProducts(value);
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

  changeQuantity(id: string, change: number) {
    this.cartService.changeInCartQuantity(id, change);
  }

  isQuantityEqualsToMin(id: string, value: number): boolean {
    return value === 1;
  }

  isQuantityEqualsToMax(id: string, value: number): boolean {
    return this.cartService.products[CartUtils.getProductIndexById(id, this.cartService.products)].quantity === value;
  }

}
