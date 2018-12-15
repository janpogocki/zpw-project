import {Injectable} from '@angular/core';
import {Product} from './product/product';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {CartUtils} from './utils/cart-utils';
import {NodeRestService} from './node-rest.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsProviderService {

  public firebaseBackendActive: boolean;

  constructor(private db: AngularFirestore,
              private nodeRest: NodeRestService) {
  }

  getFirebaseStatusDocument(): Promise<boolean> {
    const backendDb = this.db.collection('backend');

    return backendDb
      .doc('backend').ref.get()
      .then(doc => doc.data().firebase);
  }

  getProducts(): Observable<Product[]> {
    if (this.firebaseBackendActive) {
      let productsFromDB: AngularFirestoreCollection<Product>;
      productsFromDB = this.db.collection('products');
      return productsFromDB
        .snapshotChanges()
        .pipe(map((changes) =>
          changes.map(a => ({id: a.payload.doc.id, ...a.payload.doc.data()}))));
    } else {
      return this.nodeRest.getProducts()
        .pipe(map(changes => changes.map((product: any) => ({id: product._id, ...product}))));
    }
  }

  getProduct(id: string): Observable<Product> {
    if (this.firebaseBackendActive) {
      return this.getProducts()
        .pipe(map(productList => productList.filter(product => product.id === id)[0]));
    } else {
      return this.nodeRest.getProduct(id)
        .pipe(map(product => ({id: product._id, ...product})));
    }
  }

  getCurrentPromotions(): Observable<any> {
    const currentTime = new Date().getTime() / 1000;
    let valueChanges: Observable<any>;

    if (this.firebaseBackendActive) {
      valueChanges = this.db.collection('discounts')
        .snapshotChanges()
        .pipe(map((changes) =>
          changes.map(a => ({id: a.payload.doc.id, ...a.payload.doc.data()}))));
    } else {
      valueChanges = this.nodeRest.getDiscounts();
    }

    return valueChanges
      .pipe(map((promotionList: any[]) => promotionList.filter((promotion: any) => promotion.discountEndTime.seconds > currentTime)));
  }

  saveProductInDB(product: any): Promise<any> {
    const newProduct = {...product};
    delete newProduct.id;

    if (this.firebaseBackendActive) {
      if (product.id === null) {
        return this.db.collection('products')
          .add(newProduct);
      } else {
        return this.db.collection(('products'))
          .doc(product.id)
          .update(newProduct);
      }
    } else {
      if (product.id === null) {
        return this.nodeRest.saveProduct(newProduct);
      } else {
        return this.nodeRest.updateProduct(product.id, newProduct);
      }
    }
  }

  sendCartToDB(name: string, email: string, address: string, cart: Product[], currentProducts: Product[], callback) {
    const products: any[] = [];
    cart.forEach(product => products.push({id: product.id, quantity: product.quantity}));

    if (this.firebaseBackendActive) {
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
    } else {
      this.nodeRest.saveOrder({name: name, email: email, address: address, status: 0, products: products})
        .then(() => {
          for (const entry of cart) {
            this.nodeRest.updateProduct(entry.id,
              {quantity: currentProducts[CartUtils.getProductIndexById(entry.id, currentProducts)].quantity - entry.quantity});
          }

          callback(true);
        })
        .catch(() => callback(false));
    }
  }

  removeProductInDB(id: string): Promise<void> {
    if (this.firebaseBackendActive) {
      return this.db.collection('products')
        .doc(id).delete();
    } else {
      return this.nodeRest.removeProduct(id);
    }
  }

  getPendingOrders(): Observable<any> {
    let valueChanges: Observable<any>;

    if (this.firebaseBackendActive) {
      valueChanges = this.db.collection('orders')
        .snapshotChanges()
        .pipe(map((changes) =>
          changes.map(a => ({id: a.payload.doc.id, ...a.payload.doc.data()}))));
    } else {
      valueChanges = this.nodeRest.getOrders()
        .pipe(map((changes) =>
          changes.map(order => ({id: order._id, ...order}))));
    }

    return valueChanges
      .pipe(map((ordersList: any[]) => ordersList.filter((order: any) => order.status === 0)));
  }

  getFinishedOrders(): Observable<any> {
    let valueChanges: Observable<any>;

    if (this.firebaseBackendActive) {
      valueChanges = this.db.collection('orders')
        .snapshotChanges()
        .pipe(map((changes) =>
          changes.map(a => ({id: a.payload.doc.id, ...a.payload.doc.data()}))));
    } else {
      valueChanges = this.nodeRest.getOrders()
        .pipe(map((changes) =>
          changes.map(order => ({id: order._id, ...order}))));
    }

    return valueChanges
      .pipe(map((ordersList: any[]) => ordersList.filter((order: any) => order.status === 1)));
  }

  getRejectedOrders(): Observable<any> {
    let valueChanges: Observable<any>;

    if (this.firebaseBackendActive) {
      valueChanges = this.db.collection('orders')
        .snapshotChanges()
        .pipe(map((changes) =>
          changes.map(a => ({id: a.payload.doc.id, ...a.payload.doc.data()}))));
    } else {
      valueChanges = this.nodeRest.getOrders()
        .pipe(map((changes) =>
          changes.map(order => ({id: order._id, ...order}))));
    }

    return valueChanges
      .pipe(map((ordersList: any[]) => ordersList.filter((order: any) => order.status === -1)));
  }

  finishOrder(id: string): Promise<any> {
    if (this.firebaseBackendActive) {
      return this.db.collection('orders')
        .doc(id)
        .update({status: 1});
    } else {
      return this.nodeRest.updateOrder(id, {status: 1});
    }
  }

  rejectOrder(id: string, products: any[], db: Product[]) {
    if (this.firebaseBackendActive) {
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
    } else {
      return this.nodeRest.updateOrder(id, {status: -1})
        .then(() => {
          for (const product of products) {
            const quantity = db[CartUtils.getProductIndexById(product.id, db)].quantity + product.quantity;

            this.nodeRest.updateProduct(product.id, {quantity});
          }
        });
    }
  }
}
