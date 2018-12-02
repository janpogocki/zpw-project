import {Component, Inject, Input, OnInit, Output} from '@angular/core';
import {ProductsComponent} from '../products/products.component';
import {Product} from './product';
import {MatDialog} from '@angular/material';
import {ProductsProviderService} from '../products-provider.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input() product: Product;
  photoUrl: string;

  constructor(private productsProvider: ProductsProviderService) {
  }

  ngOnInit() {
    this.productsProvider.getProductPhotoFullUrl(this.product)
      .subscribe(url => this.photoUrl = url);
  }

  addToChart() {
    console.log('added to chart');

  }

}

