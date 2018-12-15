import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ProductsProviderService} from '../../../../src/app/products-provider.service';
import {NodeRestService} from '../../../../src/app/node-rest.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionsService {

  checkedProducts: String[] = [];

  constructor(private db: AngularFirestore,
              private productsProvider: ProductsProviderService,
              private nodeRest: NodeRestService) {
  }

  checkedItemCount(): number {
    return this.checkedProducts.length;
  }

  addOrRemoveIdInCheckedProducts(id: string) {
    if (this.checkedProducts.includes(id)) {
      this.checkedProducts.splice(this.checkedProducts.indexOf(id), 1);
    } else {
      this.checkedProducts.push(id);
    }
  }

  saveDiscountInDB(discountEndTime: string, productPercentValue: string): Promise<any> {
    const currentTime = Math.round(new Date().getTime() / 1000);
    const seconds = currentTime + Number(discountEndTime.split(':')[0]) * 60 + Number(discountEndTime.split(':')[1]);
    const data = {
      discountEndTime: {seconds},
      productPercentValue: Number(productPercentValue) / 100,
      products: this.checkedProducts
    };

    if (this.productsProvider.firebaseBackendActive) {
      return this.db.collection('discounts')
        .add(data)
        .then(() => {this.checkedProducts = []; });
    } else {
      return this.nodeRest.saveDiscount(data);
    }
  }
}
