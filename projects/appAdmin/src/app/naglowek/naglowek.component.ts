import {Component} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {CartUtils} from '../../../../../src/app/utils/cart-utils';

@Component({
  selector: 'app-admin-naglowek',
  templateUrl: './naglowek.component.html',
  styleUrls: ['./naglowek.component.css']
})
export class NaglowekComponent {

  constructor(private authService: AuthService,
              private router: Router,
              private snackbar: MatSnackBar) {
  }

  logout() {
    this.authService.signOut()
      .then(() => {
        this.router.navigate(['/'])
          .then(() => CartUtils.showSnackbar(this.snackbar, 'Wylogowano poprawnie!'));
      });
  }
}
