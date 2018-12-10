import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductsProviderService} from '../../../../../src/app/products-provider.service';
import {Product} from '../../../../../src/app/product/product';
import {MatSnackBar} from '@angular/material';
import {CartUtils} from '../../../../../src/app/utils/cart-utils';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  id: string;
  product: Product;

  constructor(private route: ActivatedRoute,
              private productsProvider: ProductsProviderService,
              private router: Router,
              private snackbar: MatSnackBar,
              private authService: AuthService) {
    if (!authService.isUserEmailLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id !== 'new') {
      this.productsProvider.getProduct(this.id)
        .subscribe(product => this.product = product);
    } else {
      this.product = {name: '', category: '', photo: '', description: '', price: 0, quantity: 0, id: null};
    }
  }

  saveProduct(name: string, quantity: string, price: string, description: string, photo: string, category: string) {
    if (this.id === 'new') {
      this.productsProvider
        .saveProductInDB({id: null, quantity: Number(quantity), price: Number(price), description, photo, category, name})
        .then(() => {
          CartUtils.showSnackbar(this.snackbar, 'Produkt został dodany do bazy');
          this.router.navigate(['/products']);
        })
        .catch(error => CartUtils.showSnackbar(this.snackbar, 'Problem z dodaniem produktu do bazy (error ' + error.status + ')'));
    } else {
      this.productsProvider
        .saveProductInDB({id: this.product.id, quantity: Number(quantity), price: Number(price), description, photo, category, name})
        .then(() => {
          CartUtils.showSnackbar(this.snackbar, 'Produkt został zaktualizowany');
          this.router.navigate(['/products']);
        })
        .catch(error => CartUtils.showSnackbar(this.snackbar, 'Problem z aktualizacją produktu w bazie (error ' + error.status + ')'));
    }
  }

}
