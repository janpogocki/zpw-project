import {Component} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {CartUtils} from '../../../../../src/app/utils/cart-utils';
import {ProductsProviderService} from '../../../../../src/app/products-provider.service';

@Component({
  selector: 'app-admin-naglowek',
  templateUrl: './naglowek.component.html',
  styleUrls: ['./naglowek.component.css']
})
export class NaglowekComponent {

  constructor(public authService: AuthService,
              private router: Router,
              private snackbar: MatSnackBar,
              public productsService: ProductsProviderService) {
  }

  logout() {
    this.authService.signOut()
      .then(() => {
        this.router.navigate(['/'])
          .then(() => CartUtils.showSnackbar(this.snackbar, 'Wylogowano poprawnie!'));
      });
  }

  changeBackend() {
    this.authService.changeBackend()
      .then(() => {
        this.router.navigateByUrl('/', {skipLocationChange: true})
          .then(() => this.router.navigate(['/']));
        CartUtils.showSnackbar(this.snackbar, 'Zmieniono backend');
      });
  }
}
