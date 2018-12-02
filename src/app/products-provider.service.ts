import {Injectable} from '@angular/core';
import {Product} from './product/product';
import {forkJoin, Observable, zip} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import {map} from 'rxjs/operators';
import {forEach} from '@angular/router/src/utils/collection';

@Injectable({
  providedIn: 'root'
})
export class ProductsProviderService {

  productsFromDB: AngularFirestoreCollection<Product>;

  constructor(private db: AngularFirestore,
              private storage: AngularFireStorage) {

  }

  getProducts(): Observable<Product[]> {
    this.productsFromDB = this.db.collection('products');
    return this.productsFromDB
      .snapshotChanges()
      .pipe(map((changes) =>
        changes.map(a => ({id: a.payload.doc.id, ...a.payload.doc.data()}))));
  }

  getProductsWithPhotoFullUrl(): Observable<Product[]> {
    return this.getProducts()
      .pipe(map((products: Product[]) => {
        return products.map((product: Product) => {
          let newUrl: string;

          this.getProductPhotoFullUrl(product)
            .subscribe((url) => (newUrl = url));

          return {photoFullUrl: newUrl, ...product};
        });
      }));
  }

  getProduct(id: string): Observable<Product> {
    return this.getProducts()
      .pipe(map(productList => productList.filter(product => product.id === id)[0]));
  }

  getProductPhotoFullUrl(product: Product): Observable<string> {
    const ref = this.storage.ref('products/' + product.photo);
    return ref.getDownloadURL();
  }
}
