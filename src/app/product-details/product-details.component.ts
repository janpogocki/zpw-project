import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductsProviderService} from '../products-provider.service';
import {Product} from '../product/product';
import {MatSnackBar} from '@angular/material';
import {CartUtils} from '../utils/cart-utils';
import {CartService} from '../cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  id: string;
  product: Product;

  constructor(
    private route: ActivatedRoute,
    private productsProvider: ProductsProviderService,
    private cartService: CartService,
    public snackbar: MatSnackBar
  ) {

  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.productsProvider.getProduct(this.id)
      .subscribe(product => this.product = product);
  }

  addToChart(quantity: string) {
    CartUtils.addToCart(this.product, Number(quantity), this.cartService, this.snackbar);
  }

}
