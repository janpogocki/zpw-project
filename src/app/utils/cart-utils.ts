import {Product} from '../product/product';
import {CartService} from '../cart.service';
import {MatSnackBar} from '@angular/material';

export class CartUtils {
  static addToCart(product: Product, quantity: number, cartService: CartService, snackbar: MatSnackBar){
    const singleProduct = {...product};
    singleProduct.quantity = quantity;

    if (cartService.canAddToCart(singleProduct, product)){
      cartService.addToCart(singleProduct);
      CartUtils.showSnackbar(snackbar, 'Dodano do koszyka');
    }
    else {
      CartUtils.showSnackbar(snackbar, 'Masz już maksymalną możliwą ilość tego produktu w koszyku');
    }
  }

  static showSnackbar(snackbar: MatSnackBar, msg: string) {
    snackbar.open(msg, null, {
      duration: 3000,
    });
  }
}
