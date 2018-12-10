import {Component} from '@angular/core';
import {CartService} from '../cart.service';
import {CartUtils} from '../utils/cart-utils';

@Component({
  selector: 'app-naglowek',
  templateUrl: './naglowek.component.html',
  styleUrls: ['./naglowek.component.css']
})
export class NaglowekComponent {

  items = 0;
  price = 0;

  constructor(private cartService: CartService) {
    cartService.productsInCartChanged$
      .subscribe(value => {
        this.items = CartUtils.getSumOfProducts(value);
        this.price = CartUtils.getAmountOfProducts(value);
      });
  }

}
