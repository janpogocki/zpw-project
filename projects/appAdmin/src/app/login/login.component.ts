import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {MatSnackBar} from '@angular/material';
import {CartUtils} from '../../../../../src/app/utils/cart-utils';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
              private snackbar: MatSnackBar,
              private router: Router) {
    if (authService.isUserEmailLoggedIn) {
      this.router.navigate(['/orders']);
    }
  }

  ngOnInit() {
  }

  tryToLogin(email: string, password: string) {
    this.showSpinner(true);

    this.authService.loginWithEmail(email, password)
      .then(() => {
        CartUtils.showSnackbar(this.snackbar, 'Zalogowano pomyślnie');
        this.router.navigate(['/orders']);
      })
      .catch(() => {
        CartUtils.showSnackbar(this.snackbar, 'Problem z zalogowaniem, spróbuj ponownie!');
        this.showSpinner(false);
      });
  }

  private showSpinner(show: boolean) {
    if (show) {
      (document.getElementsByClassName('login-form') as HTMLCollectionOf<HTMLElement>)[0].style.display = 'none';
      (document.getElementsByClassName('login-spinner') as HTMLCollectionOf<HTMLElement>)[0].style.display = 'flex';
    } else {
      (document.getElementsByClassName('login-form') as HTMLCollectionOf<HTMLElement>)[0].style.display = 'block';
      (document.getElementsByClassName('login-spinner') as HTMLCollectionOf<HTMLElement>)[0].style.display = 'none';
    }
  }

}
