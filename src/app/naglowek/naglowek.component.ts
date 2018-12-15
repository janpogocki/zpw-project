import {Component} from '@angular/core';
import {CartService} from '../cart.service';
import {CartUtils} from '../utils/cart-utils';
import {ProductsProviderService} from '../products-provider.service';

@Component({
  selector: 'app-naglowek',
  templateUrl: './naglowek.component.html',
  styleUrls: ['./naglowek.component.css']
})
export class NaglowekComponent {

  items = 0;
  price = 0;
  firebaseDataLoaded = false;

  constructor(private cartService: CartService,
              private productsProvider: ProductsProviderService) {
    productsProvider.getFirebaseStatusDocument()
      .then(response => {
        productsProvider.firebaseBackendActive = response;
        this.firebaseDataLoaded = true;

        cartService.productsInCartChanged$
          .subscribe(value => {
            this.items = CartUtils.getSumOfProducts(value);
            this.price = CartUtils.getAmountOfProducts(value);
          });
      });
  }

}
