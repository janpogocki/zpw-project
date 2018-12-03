import {Component, OnInit} from '@angular/core';
import {Product} from '../product/product';
import {ProductsProviderService} from '../products-provider.service';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  products: Product[];
  productsCopy: Product[];

  // paginator
  paginatorLength = 0;
  paginatorPageSize = 8;
  paginatorPageSizeOptions: number[] = [4, 8, 40, 100];

  constructor(private productsProvider: ProductsProviderService) {
    this.products = [];
    this.productsCopy = [];
  }

  ngOnInit(): void {
   this.productsProvider.getProductsWithPhotoFullUrl()
      .subscribe((products: Product[]) => {
        this.products = products;
        this.productsCopy = products;

        this.paginatorLength = this.productsCopy.length;
        this.productsCopy = this.products.slice(0, this.paginatorPageSize);
      });
  }

  doPaginatorFilter(event: PageEvent) {
    this.productsCopy = this.products.slice(event.pageIndex * event.pageSize, (event.pageIndex * event.pageSize) + event.pageSize);
  }

  doSearchFilter(query: string) {
    this.productsCopy = this.products.filter(product => product.name.toLowerCase().startsWith(query.toLowerCase()));
  }

  // paginator todo!!

  /*updateChart(product: Product, diff: number) {
    this.chart[this.products.indexOf(product)] += diff;
    product.quantity -= diff;

    this.setLowQuantityStyles(product);
  }

  isVisible(product: Product, button: number) {
    if (button > 0 && product.quantity > 0) {return true; }
    else if (button < 0 && this.chart[this.products.indexOf(product)] > 0) {return true; }
    else {return false; }
  }

  setLowQuantityStyles(product: Product) {
    this.lowQuantityStyles[this.products.indexOf(product)] = {
      'color': product.quantity <= 3 ? 'red' : 'inherit',
      'font-weight': product.quantity <= 3 ? 'bold' : 'inherit'
    };
  }

  setLowestAndHighestPriceProduct() {
    let lowest = this.products[0];
    let highest = this.products[0];

    for (const product of this.products) {
      if (product.price < lowest.price) {
        lowest = product;
      }
      else if (product.price > highest.price){
        highest = product;
      }
    }

    this.lowestPriceProduct = lowest;
    this.highestPriceProduct = highest;

    this.lowestAndHighestPriceStyles[this.products.indexOf(lowest)] = {
      'border': '2px solid green'
    };

    this.lowestAndHighestPriceStyles[this.products.indexOf(highest)] = {
      'border': '2px solid red'
    };
  }

  getSumOfAvailableProducts() {
    this._sumOfAvailableProducts = 0;

    for (const product of this.products) {
      this._sumOfAvailableProducts = this._sumOfAvailableProducts + product.quantity;
    }

    return this._sumOfAvailableProducts;
  }*/


}
