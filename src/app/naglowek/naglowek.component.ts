import {Component} from '@angular/core';
import {CartService} from '../cart.service';

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
        this.items = cartService.getSumOfProducts(value);
        this.price = cartService.getAmountOfProducts(value);
      });
  }

}
