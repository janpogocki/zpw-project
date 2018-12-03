import {Injectable} from '@angular/core';
import {Product} from './product/product';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  productsInCart: Product[] = [];
  productsInCartChanged$ = new BehaviorSubject(this.productsInCart);

  constructor() { }

  addToCart(product: Product) {
    if (this.getSumOfProductsById(product.id, this.productsInCart) > 0) {
      this.productsInCart[this.getProductIndexById(product.id, this.productsInCart)].quantity += product.quantity;
    } else {
      this.productsInCart.push(product);
    }

    this.productsInCartChanged$.next(this.productsInCart);
  }

  canAddToCart(singleProduct: Product, product: Product): boolean {
    return this.getSumOfProductsById(singleProduct.id, this.productsInCart) + singleProduct.quantity <= product.quantity;
  }

  removeFromCart(id: string) {
    if (this.getSumOfProductsById(id, this.productsInCart) > 0) {
      this.productsInCart.splice(this.getProductIndexById(id, this.productsInCart), 1);
    }

    this.productsInCartChanged$.next(this.productsInCart);
  }

  clearCart() {
    this.productsInCart = [];
    this.productsInCartChanged$.next(this.productsInCart);
  }

  getSumOfProducts(array: Product[]): number {
    let i = 0;

    for (const entry of array) {
      i += entry.quantity;
    }

    return i;
  }

  getAmountOfProducts(array: Product[]): number {
    let i = 0;

    for (const entry of array) {
      i += entry.price * entry.quantity;
    }

    return i;
  }

  getSumOfProductsById(id: string, array: Product[]): number {
    let i = 0;

    for (const entry of array) {
      if (entry.id === id) {
        i += entry.quantity;
      }
    }

    return i;
  }

  getProductIndexById(id: string, array: Product[]): number {
    let i = 0;

    for (const entry of array) {
      if (entry.id === id) {
        return i;
      } else {
        i++;
      }
    }

    return null;
  }

}
