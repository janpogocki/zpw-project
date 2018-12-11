import {Component, OnInit} from '@angular/core';
import {ProductsProviderService} from '../../../../../src/app/products-provider.service';
import {Product} from '../../../../../src/app/product/product';
import {MatSnackBar, Sort} from '@angular/material';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {CartUtils} from '../../../../../src/app/utils/cart-utils';
import {PromotionsService} from '../promotions.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[];
  sortedProducts: Product[];

  showPromotionBox: boolean;

  // promotions
  productPercentValue: number;
  prodcutsDiscount: string[];

  constructor(private productsProvider: ProductsProviderService,
              private authService: AuthService,
              private router: Router,
              private snackbar: MatSnackBar,
              private promotionsService: PromotionsService) {
    this.products = [];
    this.showPromotionBox = false;

    if (!authService.isUserEmailLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.productsProvider.getProducts()
      .subscribe((products: Product[]) => {
        this.products = products;
        this.sortedProducts = products.slice();
      });

    this.productsProvider.getCurrentPromotions()
      .subscribe((entry: any) => {
        this.clearPromotions();

        for (const body of entry) {
          this.productPercentValue = body.productPercentValue;
          this.prodcutsDiscount = body.products;

          for (const id of this.prodcutsDiscount) {
            if (this.products[CartUtils.getProductIndexById(id, this.products)].oldPrice !== undefined) {
              this.products[CartUtils.getProductIndexById(id, this.products)].price =
                this.products[CartUtils.getProductIndexById(id, this.products)].oldPrice;
            }

            this.products[CartUtils.getProductIndexById(id, this.products)].oldPrice =
              this.products[CartUtils.getProductIndexById(id, this.products)].price;

            this.products[CartUtils.getProductIndexById(id, this.products)].price -=
              this.products[CartUtils.getProductIndexById(id, this.products)].price * this.productPercentValue;

            this.products[CartUtils.getProductIndexById(id, this.products)].price =
              Math.round(this.products[CartUtils.getProductIndexById(id, this.products)].price * 100) / 100;

            this.products[CartUtils.getProductIndexById(id, this.products)].discountTimeout = body.discountEndTime.seconds * 1000;
            this.products[CartUtils.getProductIndexById(id, this.products)].discountPercentage = this.productPercentValue * 100;
          }
        }
      });
  }

  clearPromotions() {
    for (const entry of this.products) {
      entry.discountTimeout = undefined;
    }
  }

  sortData(sort: Sort) {
    const data = this.products.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedProducts = data;
      return;
    }

    this.sortedProducts = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'quantity': return this.compare(a.quantity, b.quantity, isAsc);
        case 'price': return this.compare(a.price, b.price, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  remove(id: string) {
    this.productsProvider.removeProductInDB(id)
      .then(() => CartUtils.showSnackbar(this.snackbar, 'Produkt usunięto z bazy'))
      .catch(error => CartUtils.showSnackbar(this.snackbar, 'Problem z usunięciem produktu z bazy (error ' + error.status + ')'));
  }

  isPromotionsButtonDisabled(): boolean {
    return this.promotionsService.checkedItemCount() === 0 || this.showPromotionBox === true;
  }

  addOrRemoveIdInCheckedProducts(id: string) {
    this.promotionsService.addOrRemoveIdInCheckedProducts(id);
  }

  openPromotionBox() {
    this.showPromotionBox = true;
  }

  refreshPromotion(id: string) {
    this.products[CartUtils.getProductIndexById(id, this.products)].discountTimeout = undefined;

    this.products[CartUtils.getProductIndexById(id, this.products)].price =
      this.products[CartUtils.getProductIndexById(id, this.products)].oldPrice;

    this.products[CartUtils.getProductIndexById(id, this.products)].oldPrice = undefined;
  }

  saveDiscount(discountEndTime: string, productPercentValue: string) {
    this.promotionsService.saveDiscountInDB(discountEndTime, productPercentValue)
      .then(() => {
        this.showPromotionBox = false;
        CartUtils.showSnackbar(this.snackbar, 'Promocja została wprowadzona');
      })
      .catch(error => CartUtils.showSnackbar(this.snackbar, 'Problem z wprowadzeniem promocji (error ' + error.status + ')'));
  }
}
