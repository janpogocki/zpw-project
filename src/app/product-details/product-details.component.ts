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

  productPercentValue: number;

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

    this.productsProvider.getCurrentPromotions()
      .subscribe((entry: any) => {
        this.product.discountTimeout = undefined;

        for (const body of entry) {
          this.productPercentValue = body.productPercentValue;

          if (body.products.includes(this.id)) {
            if (this.product.oldPrice !== undefined) {
              this.product.price = this.product.oldPrice;
            }

            this.product.oldPrice = this.product.price;
            this.product.price -= this.product.price * this.productPercentValue;
            this.product.price = Math.round(this.product.price * 100) / 100;
            this.product.discountTimeout = body.discountEndTime.seconds * 1000;
            this.product.discountPercentage = this.productPercentValue * 100;

            break;
          }
        }
      });
  }

  addToChart(quantity: string) {
    CartUtils.addToCart(this.product, Number(quantity), this.cartService, this.snackbar);
  }

  refreshPromotion() {
    this.product.discountTimeout = undefined;
    this.product.price = this.product.oldPrice;
    this.product.oldPrice = undefined;
  }

}
