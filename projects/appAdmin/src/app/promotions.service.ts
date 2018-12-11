import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PromotionsService {

  checkedProducts: String[] = [];

  constructor(private db: AngularFirestore) {
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

    return this.db.collection('discounts')
      .add({
        discountEndTime: {seconds},
        productPercentValue: Number(productPercentValue) / 100,
        products: this.checkedProducts
      })
      .then(() => {this.checkedProducts = []; });
  }
}
