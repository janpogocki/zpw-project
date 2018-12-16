import {Injectable} from '@angular/core';
import {Product} from './product/product';
import {BehaviorSubject} from 'rxjs';
import {ProductsProviderService} from './products-provider.service';
import {CartUtils} from './utils/cart-utils';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  products: Product[];

  productsInCart: Product[] = [];
  productsInCartChanged$ = new BehaviorSubject(this.productsInCart);

  constructor(private productsProvider: ProductsProviderService) {
    productsProvider.firebaseDataLoaded$
      .subscribe(response => {
        if (response) {
          const productsInLocalStorage = localStorage.getItem('productsInChart');
          if (productsInLocalStorage !== null) {
            this.productsInCart = JSON.parse(productsInLocalStorage);
          }

          this.getProducts();
        }
      });
  }

  getProducts() {
    this.productsProvider.getProducts()
      .subscribe((products: Product[]) => {
        this.products = products;

        this.updatePricesInCart();

        this.productsInCartChanged$.next(this.productsInCart);
      });
  }

  changeInCartQuantity(id: string, change: number) {
    this.productsInCart[CartUtils.getProductIndexById(id, this.productsInCart)].quantity += change;
    this.productsInCartChanged$.next(this.productsInCart);
  }

  addToCart(product: Product) {
    if (CartUtils.getSumOfProductsById(product.id, this.productsInCart) > 0) {
      this.productsInCart[CartUtils.getProductIndexById(product.id, this.productsInCart)].quantity += product.quantity;
      this.productsInCart[CartUtils.getProductIndexById(product.id, this.productsInCart)].price = product.price;
    } else {
      this.productsInCart.push(product);
    }

    localStorage.setItem('productsInChart', JSON.stringify(this.productsInCart));
    this.productsInCartChanged$.next(this.productsInCart);
  }

  canAddToCart(singleProduct: Product, product: Product): boolean {
    return CartUtils.getSumOfProductsById(singleProduct.id, this.productsInCart) + singleProduct.quantity <= product.quantity;
  }

  removeFromCart(id: string) {
    if (CartUtils.getSumOfProductsById(id, this.productsInCart) > 0) {
      this.productsInCart.splice(CartUtils.getProductIndexById(id, this.productsInCart), 1);
    }

    localStorage.setItem('productsInChart', JSON.stringify(this.productsInCart));
    this.productsInCartChanged$.next(this.productsInCart);
  }

  clearCart() {
    this.productsInCart = [];
    localStorage.removeItem('productsInChart');
    this.productsInCartChanged$.next(this.productsInCart);
  }

  updatePricesInCart() {
    for (const entry of this.productsInCart) {
      entry.price = this.products[CartUtils.getProductIndexById(entry.id, this.products)].price;
    }
  }

}
