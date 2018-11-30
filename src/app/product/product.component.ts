import {Component, Input, OnInit, Output} from '@angular/core';
import {ProductsComponent} from '../products/products.component';
import {Product} from './product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input() product: Product;
  @Input() products: ProductsComponent;

  constructor() { }

  ngOnInit() {
  }

}
