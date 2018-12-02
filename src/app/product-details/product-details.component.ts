import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductsProviderService} from '../products-provider.service';
import {Product} from '../product/product';

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
    private productsProvider: ProductsProviderService
  ) {

  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.productsProvider.getProduct(this.id)
      .subscribe(product => this.product = product);
  }

}
