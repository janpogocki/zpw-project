import {Component, OnInit} from '@angular/core';
import {Product} from '../product/product';
import * as firebase from 'firebase';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {log} from 'util';
import {forEach} from '@angular/router/src/utils/collection';
import {last} from 'rxjs/operators';
import {ProductsProviderService} from '../products-provider.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  products: Product[];

  /*chart = new Array(this.products.length);
  lowQuantityStyles = new Array(this.products.length);
  lowestAndHighestPriceStyles = new Array(this.products.length);
  lowestPriceProduct: Product;
  highestPriceProduct: Product;
  _sumOfAvailableProducts: number;*/

  ngOnInit(): void {
   this.productsProvider.getProducts()
      .subscribe((products: Product[]) => {this.products = products; });


  /* this.productsProvider.getProductsWithPhotoFullUrl()
     .subscribe(product => console.log('x'));
*/
  }


  constructor(private productsProvider: ProductsProviderService) {
    this.products = [];
  }


    /*[
      {name: 'Jogurt', quantity: 20, price: 3.99, description: 'Jogurt o niskiej zawartości cukru', photo: 'jogurt.jpg'},
      {name: 'Ser pleśniowy', quantity: 15, price: 5.29, description: 'Dojrzały ser', photo: 'ser_plesniowy.jpg'},
      {name: 'Mleko', quantity: 5, price: 4.50, description: 'Mleko prosto od krowy', photo: 'mleko.jpg'},
      {name: 'Baton 3bit', quantity: 50, price: 2.20, description: 'Baton z herbatnikiem w środku', photo: 'baton3bit.jpg'},
      {name: 'Vanish', quantity: 13, price: 12.99, description: 'Doskonały wybielacz', photo: 'vanish.jpg'},
      {name: 'Woda mineralna', quantity: 120, price: 1.99, description: 'Szybko gasi pragnienie', photo: 'woda.jpg'},
      {name: 'Masło', quantity: 45, price: 6.99, description: 'Masło z 82% zawartością tłuszczu', photo: 'maslo.jpg'},
      {name: 'Mąka', quantity: 80, price: 1.50, description: 'Mąka typu 450', photo: 'maka.jpg'},
      {name: 'Cukier', quantity: 80, price: 1.70, description: 'Cukier polskiej produkcji', photo: 'cukier.jpg'},
      {name: 'Bułka tarta', quantity: 70, price: 0.99, description: 'Idealna do polskiego schabowego', photo: 'bulka_tarta.jpg'}
    ].forEach(value => db.collection('products').add(value).then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
    }));*/



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
