import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {CartUtils} from '../utils/cart-utils';
import {CartService} from '../cart.service';
import {ProductsProviderService} from '../products-provider.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-finalize',
  templateUrl: './finalize.component.html',
  styleUrls: ['./finalize.component.css']
})
export class FinalizeComponent implements OnInit {

  name: string;
  email: string;
  address: string;

  constructor(private snackbar: MatSnackBar,
              private cartService: CartService,
              private productsProvider: ProductsProviderService,
              private router: Router) { }

  ngOnInit() {
  }

  sendForm() {
    this.productsProvider.sendCartToDB(this.name, this.email, this.address, this.cartService.productsInCart, this.cartService.products,
      (success) => {
        if (success) {
          CartUtils.showSnackbar(this.snackbar, 'Zamówienie zostało wysłane, dziękujemy!');
          this.cartService.clearCart();
          this.router.navigate(['/home']);
        } else {
          CartUtils.showSnackbar(this.snackbar, 'Błąd podczas wysyłania zamówienia, spróbuj ponownie');
        }
      });
  }
}
