import {Injectable} from '@angular/core';
import {Product} from './product/product';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsProviderService {

  productsFromDB: AngularFirestoreCollection<Product>;

  constructor(private db: AngularFirestore) {

  }

  getProducts(): Observable<Product[]> {
    this.productsFromDB = this.db.collection('products');
    return this.productsFromDB
      .snapshotChanges()
      .pipe(map((changes) =>
        changes.map(a => ({id: a.payload.doc.id, ...a.payload.doc.data()}))));
  }

  getProduct(id: string): Observable<Product> {
    return this.getProducts()
      .pipe(map(productList => productList.filter(product => product.id === id)[0]));
  }

  sendCartToDB(name: string, email: string, address: string, cart: Product[], callback) {
    const products: any[] = [];
    cart.forEach(product => products.push({id: product.id, quantity: product.quantity}));

    this.db.collection('orders')
      .add({name: name, email: email, address: address, products: products})
      .then(() => callback(true))
      .catch(() => callback(false));
  }
}
