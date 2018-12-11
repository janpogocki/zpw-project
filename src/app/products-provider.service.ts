import {Injectable} from '@angular/core';
import {Product} from './product/product';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {CartUtils} from './utils/cart-utils';

@Injectable({
  providedIn: 'root'
})
export class ProductsProviderService {

  constructor(private db: AngularFirestore) {

  }

  getProducts(): Observable<Product[]> {
    let productsFromDB: AngularFirestoreCollection<Product>;
    productsFromDB = this.db.collection('products');
    return productsFromDB
      .snapshotChanges()
      .pipe(map((changes) =>
        changes.map(a => ({id: a.payload.doc.id, ...a.payload.doc.data()}))));
  }

  getProduct(id: string): Observable<Product> {
    return this.getProducts()
      .pipe(map(productList => productList.filter(product => product.id === id)[0]));
  }

  getCurrentPromotions(): Observable<any> {
    const currentTime = new Date().getTime() / 1000;

    let valueChanges: Observable<any>;
    valueChanges = this.db.collection('discounts')
      .snapshotChanges()
      .pipe(map((changes) =>
        changes.map(a => ({id: a.payload.doc.id, ...a.payload.doc.data()}))));

    return valueChanges
      .pipe(map((promotionList: any[]) => promotionList.filter((promotion: any) => promotion.discountEndTime.seconds > currentTime)));
  }

  saveProductInDB(product: any): Promise<any> {
    const newProduct = {...product};
    delete newProduct.id;

    if (product.id === null) {
      return this.db.collection('products')
        .add(newProduct);
    } else {
      return this.db.collection(('products'))
        .doc(product.id)
        .update(newProduct);
    }
  }

  sendCartToDB(name: string, email: string, address: string, cart: Product[], currentProducts: Product[], callback) {
    const products: any[] = [];
    cart.forEach(product => products.push({id: product.id, quantity: product.quantity}));

    this.db.collection('orders')
      .add({name: name, email: email, address: address, status: 0, products: products})
      .then(() => {
        for (const entry of cart) {
          this.db.collection('products')
            .doc(entry.id)
            .update({quantity: currentProducts[CartUtils.getProductIndexById(entry.id, currentProducts)].quantity - entry.quantity});
        }

        callback(true);
      })
      .catch(() => callback(false));
  }

  removeProductInDB(id: string): Promise<void> {
    return this.db.collection('products')
      .doc(id).delete();
  }

  getPendingOrders(): Observable<any> {
    let valueChanges: Observable<any>;
    valueChanges = this.db.collection('orders')
      .snapshotChanges()
      .pipe(map((changes) =>
        changes.map(a => ({id: a.payload.doc.id, ...a.payload.doc.data()}))));

    return valueChanges
      .pipe(map((ordersList: any[]) => ordersList.filter((order: any) => order.status === 0)));
  }

  getFinishedOrders(): Observable<any> {
    let valueChanges: Observable<any>;
    valueChanges = this.db.collection('orders')
      .snapshotChanges()
      .pipe(map((changes) =>
        changes.map(a => ({id: a.payload.doc.id, ...a.payload.doc.data()}))));

    return valueChanges
      .pipe(map((ordersList: any[]) => ordersList.filter((order: any) => order.status === 1)));
  }

  getRejectedOrders(): Observable<any> {
    let valueChanges: Observable<any>;
    valueChanges = this.db.collection('orders')
      .snapshotChanges()
      .pipe(map((changes) =>
        changes.map(a => ({id: a.payload.doc.id, ...a.payload.doc.data()}))));

    return valueChanges
      .pipe(map((ordersList: any[]) => ordersList.filter((order: any) => order.status === -1)));
  }

  finishOrder(id: string): Promise<any> {
    return this.db.collection('orders')
      .doc(id)
      .update({status: 1});
  }

  rejectOrder(id: string, products: any[], db: Product[]) {
    return this.db.collection('orders')
      .doc(id)
      .update({status: -1})
      .then(() => {
        for (const product of products) {
          const quantity = db[CartUtils.getProductIndexById(product.id, db)].quantity + product.quantity;

          this.db.collection('products')
            .doc(product.id)
            .update({quantity});
        }
      });
  }
}
